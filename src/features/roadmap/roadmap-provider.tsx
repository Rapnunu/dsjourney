"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  getUserFriendlyApiError,
  type UserFriendlyError,
} from "@/lib/api/user-friendly-error";
import {
  mutationFailed,
  mutationOk,
  type MutationResult,
} from "@/lib/api/mutation-result";
import {
  deleteRoadmapProgressOverrideRequest,
  fetchRoadmapProgress,
  upsertRoadmapProgressRequest,
} from "./api";
import {
  applyMasteryUpdate,
  assertCatalogInvariant,
  ensureCatalogIntegrity,
  mergeProgress,
  seedPersistedProgressFromRecords,
  topicExistsInCatalog,
  type PersistedTopicProgress,
} from "./roadmap-catalog";
import type { MasteryLevel, RoadmapCategory } from "./types";

interface TopicMutationQueue {
  desiredMastery: MasteryLevel | null;
  draining: boolean;
  waiters: Array<(result: MutationResult) => void>;
}

function consumeLatestIntent(queue: TopicMutationQueue): MasteryLevel | null {
  if (queue.desiredMastery === null) {
    return null;
  }

  let latest = queue.desiredMastery;
  queue.desiredMastery = null;

  while (queue.desiredMastery !== null) {
    latest = queue.desiredMastery;
    queue.desiredMastery = null;
  }

  return latest;
}

interface RoadmapContextType {
  roadmap: RoadmapCategory[];
  isHydrated: boolean;
  error: UserFriendlyError | null;
  pendingTopicIds: ReadonlySet<string>;
  reload: () => Promise<void>;
  updateMastery: (
    topicId: string,
    mastery: MasteryLevel,
  ) => Promise<MutationResult>;
}

const RoadmapContext = createContext<RoadmapContextType | undefined>(undefined);

function getPersistedMastery(
  persistedProgress: Map<string, PersistedTopicProgress>,
  topicId: string,
): MasteryLevel {
  return persistedProgress.get(topicId)?.mastery ?? "not_started";
}

export function RoadmapProvider({ children }: { children: ReactNode }) {
  const [roadmap, setRoadmapState] = useState<RoadmapCategory[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [error, setError] = useState<UserFriendlyError | null>(null);
  const [reloadToken, setReloadToken] = useState(0);
  const [pendingTopicIds, setPendingTopicIds] = useState<ReadonlySet<string>>(
    () => new Set(),
  );

  const topicQueuesRef = useRef(new Map<string, TopicMutationQueue>());
  const persistedProgressRef = useRef(new Map<string, PersistedTopicProgress>());
  const pendingTopicIdsRef = useRef(new Set<string>());

  const setRoadmap = useCallback(
    (updater: (previous: RoadmapCategory[]) => RoadmapCategory[]) => {
      setRoadmapState((previous) => {
        const base = ensureCatalogIntegrity(previous);
        const next = ensureCatalogIntegrity(updater(base));
        assertCatalogInvariant(next);
        return next;
      });
    },
    [],
  );

  const markTopicPending = useCallback((topicId: string, pending: boolean) => {
    const next = new Set(pendingTopicIdsRef.current);

    if (pending) {
      next.add(topicId);
    } else {
      next.delete(topicId);
    }

    pendingTopicIdsRef.current = next;
    setPendingTopicIds(next);
  }, []);

  const rollbackTopicToPersisted = useCallback(
    (topicId: string) => {
      const persisted = persistedProgressRef.current.get(topicId);
      const mastery = getPersistedMastery(persistedProgressRef.current, topicId);

      setRoadmap((previous) =>
        applyMasteryUpdate(previous, topicId, mastery, persisted?.lastStudied),
      );
    },
    [setRoadmap],
  );

  const reconcileProgressFromServer = useCallback(async () => {
    try {
      const records = await fetchRoadmapProgress();
      persistedProgressRef.current = seedPersistedProgressFromRecords(records);
      setRoadmap(() => mergeProgress(records));
      setError(null);
    } catch {
      setRoadmap((previous) => ensureCatalogIntegrity(previous));
    }
  }, [setRoadmap]);

  const runTopicDrain = useCallback(
    async (topicId: string) => {
      const queue = topicQueuesRef.current.get(topicId);
      if (!queue) return;

      markTopicPending(topicId, true);
      let lastResult: MutationResult = mutationOk();

      try {
        while (true) {
          const target = consumeLatestIntent(queue);
          if (target === null) break;

          const persistedMastery = getPersistedMastery(
            persistedProgressRef.current,
            topicId,
          );

          if (target === persistedMastery) {
            lastResult = mutationOk();
            continue;
          }

          const persistedEntry = persistedProgressRef.current.get(topicId);
          const rollbackLastStudied = persistedEntry?.lastStudied;

          try {
            if (target === "not_started") {
              await deleteRoadmapProgressOverrideRequest(topicId);
              persistedProgressRef.current.delete(topicId);
            } else {
              const record = await upsertRoadmapProgressRequest(
                topicId,
                target,
                rollbackLastStudied ?? null,
              );

              persistedProgressRef.current.set(topicId, {
                mastery: target,
                ...(record.lastStudied ? { lastStudied: record.lastStudied } : {}),
              });
            }

            setError(null);
            lastResult = mutationOk();
          } catch (updateError) {
            rollbackTopicToPersisted(topicId);
            queue.desiredMastery = null;
            lastResult = mutationFailed(updateError);
            await reconcileProgressFromServer();
            break;
          }
        }
      } finally {
        markTopicPending(topicId, false);
        queue.draining = false;

        const waiters = queue.waiters.splice(0);
        for (const resolve of waiters) {
          resolve(lastResult);
        }

        if (queue.desiredMastery !== null && !queue.draining) {
          queue.draining = true;
          void runTopicDrain(topicId);
        }
      }
    },
    [markTopicPending, reconcileProgressFromServer, rollbackTopicToPersisted],
  );

  const enqueueTopicMutation = useCallback(
    (topicId: string, mastery: MasteryLevel): Promise<MutationResult> => {
      return new Promise((resolve) => {
        let queue = topicQueuesRef.current.get(topicId);

        if (!queue) {
          queue = {
            desiredMastery: null,
            draining: false,
            waiters: [],
          };
          topicQueuesRef.current.set(topicId, queue);
        }

        queue.desiredMastery = mastery;
        queue.waiters.push(resolve);

        if (!queue.draining) {
          queue.draining = true;
          void runTopicDrain(topicId);
        }
      });
    },
    [runTopicDrain],
  );

  const reload = useCallback(async () => {
    topicQueuesRef.current.clear();
    pendingTopicIdsRef.current.clear();
    setPendingTopicIds(new Set());
    setIsHydrated(false);
    setReloadToken((token) => token + 1);
  }, []);

  useEffect(() => {
    topicQueuesRef.current.clear();
    pendingTopicIdsRef.current.clear();

    let isActive = true;

    async function loadRoadmap() {
      if (isActive) {
        setError(null);
      }

      try {
        const records = await fetchRoadmapProgress();

        if (isActive) {
          persistedProgressRef.current = seedPersistedProgressFromRecords(records);
          setRoadmap(() => mergeProgress(records));
          setError(null);
        }
      } catch (loadError) {
        if (isActive) {
          persistedProgressRef.current = new Map();
          setRoadmap(() => mergeProgress([]));
          setError(getUserFriendlyApiError(loadError, "load"));
        }
      } finally {
        if (isActive) setIsHydrated(true);
      }
    }

    void loadRoadmap();
    return () => {
      isActive = false;
    };
  }, [reloadToken, setRoadmap]);

  const updateMastery = useCallback(
    async (topicId: string, mastery: MasteryLevel) => {
      if (!topicExistsInCatalog(topicId)) {
        return mutationFailed(new Error("Topic not found."));
      }

      setRoadmap((previous) =>
        applyMasteryUpdate(previous, topicId, mastery),
      );

      return enqueueTopicMutation(topicId, mastery);
    },
    [enqueueTopicMutation, setRoadmap],
  );

  return (
    <RoadmapContext.Provider
      value={{
        roadmap,
        isHydrated,
        error,
        pendingTopicIds,
        reload,
        updateMastery,
      }}
    >
      {children}
    </RoadmapContext.Provider>
  );
}

export function useRoadmapStore() {
  const context = useContext(RoadmapContext);
  if (!context) {
    throw new Error("useRoadmapStore must be used within a RoadmapProvider");
  }
  return context;
}
