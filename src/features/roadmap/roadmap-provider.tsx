"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  completeStoredRoadmapMigration,
  getStoredRoadmap,
  isStoredRoadmapMigrationComplete,
} from "@/lib/storage";
import type { RoadmapProgressRecord } from "@/lib/repositories/roadmap";
import {
  bulkImportRoadmapProgressRequest,
  deleteRoadmapProgressOverrideRequest,
  fetchRoadmapProgress,
  upsertRoadmapProgressRequest,
} from "./api";
import { mockRoadmapData } from "./data";
import type {
  MasteryLevel,
  RoadmapCategory,
  RoadmapTopic,
} from "./types";

interface RoadmapContextType {
  roadmap: RoadmapCategory[];
  isHydrated: boolean;
  error: string | null;
  updateMastery: (
    topicId: string,
    mastery: MasteryLevel,
  ) => Promise<boolean>;
}

const RoadmapContext = createContext<RoadmapContextType | undefined>(undefined);

function cloneDefaultRoadmap(): RoadmapCategory[] {
  return mockRoadmapData.map((category) => ({
    ...category,
    topics: category.topics.map((topic) => ({ ...topic })),
  }));
}

function mergeProgress(records: RoadmapProgressRecord[]): RoadmapCategory[] {
  const progressByTopic = new Map(records.map((row) => [row.topicId, row]));

  return cloneDefaultRoadmap().map((category) => ({
    ...category,
    topics: category.topics.map((topic) => {
      const progress = progressByTopic.get(topic.id);
      if (!progress) return topic;

      return {
        ...topic,
        mastery: progress.mastery,
        ...(progress.lastStudied ? { lastStudied: progress.lastStudied } : {}),
      };
    }),
  }));
}

function getDefaultTopics(): Map<string, RoadmapTopic> {
  return new Map(
    mockRoadmapData.flatMap((category) =>
      category.topics.map((topic) => [topic.id, topic] as const),
    ),
  );
}

function getLegacyProgress(roadmap: RoadmapCategory[]) {
  const defaults = getDefaultTopics();

  return roadmap.flatMap((category) =>
    category.topics.flatMap((topic) => {
      const defaultTopic = defaults.get(topic.id);
      if (!defaultTopic) return [];

      const differsFromDefault =
        topic.mastery !== defaultTopic.mastery ||
        topic.lastStudied !== defaultTopic.lastStudied;
      if (!differsFromDefault) return [];

      return [
        {
          topicId: topic.id,
          mastery: topic.mastery,
          lastStudied: topic.lastStudied ?? null,
        },
      ];
    }),
  );
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error) return error.message;
  if (typeof error !== "object" || error === null) return fallback;

  const candidate = error as Record<string, unknown>;
  const message =
    typeof candidate.message === "string" ? candidate.message : fallback;

  return message;
}

export function RoadmapProvider({ children }: { children: ReactNode }) {
  const [roadmap, setRoadmap] = useState<RoadmapCategory[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    async function loadRoadmap() {
      try {
        let records = await fetchRoadmapProgress();
        let resolvedRoadmap = mergeProgress(records);

        if (records.length > 0) {
          completeStoredRoadmapMigration();
        } else if (!isStoredRoadmapMigrationComplete()) {
          const stored = getStoredRoadmap();
          if (stored !== null) {
            try {
              const legacyProgress = getLegacyProgress(stored);

              if (legacyProgress.length > 0) {
                records = await bulkImportRoadmapProgressRequest(legacyProgress);
                resolvedRoadmap = mergeProgress(records);
              }

              completeStoredRoadmapMigration();
            } catch (migrationError) {
              if (isActive) {
                setRoadmap(stored.length > 0 ? stored : mergeProgress([]));
                setError(
                  getErrorMessage(
                    migrationError,
                    "Unable to migrate local roadmap progress.",
                  ),
                );
              }
              return;
            }
          }
        }

        if (isActive) {
          setRoadmap(resolvedRoadmap);
          setError(null);
        }
      } catch (loadError) {
        if (isActive) {
          setRoadmap(mergeProgress([]));
          setError(getErrorMessage(loadError, "Unable to load roadmap progress."));
        }
      } finally {
        if (isActive) setIsHydrated(true);
      }
    }

    void loadRoadmap();
    return () => {
      isActive = false;
    };
  }, []);

  const updateMastery = useCallback(
    async (topicId: string, mastery: MasteryLevel) => {
      try {
        const topic = roadmap
          .flatMap((category) => category.topics)
          .find((candidate) => candidate.id === topicId);
        if (!topic) throw new Error("Roadmap topic not found.");

        const defaultTopic = getDefaultTopics().get(topicId);
        const matchesDefault =
          defaultTopic !== undefined &&
          mastery === defaultTopic.mastery &&
          topic.lastStudied === defaultTopic.lastStudied;

        if (matchesDefault) {
          await deleteRoadmapProgressOverrideRequest(topicId);
        } else {
          await upsertRoadmapProgressRequest(
            topicId,
            mastery,
            topic.lastStudied ?? null,
          );
        }

        setRoadmap((previous) =>
          previous.map((category) => ({
            ...category,
            topics: category.topics.map((currentTopic) =>
              currentTopic.id === topicId
                ? { ...currentTopic, mastery }
                : currentTopic,
            ),
          })),
        );
        setError(null);
        return true;
      } catch (operationError) {
        setError(
          getErrorMessage(operationError, "Unable to update roadmap mastery."),
        );
        return false;
      }
    },
    [roadmap],
  );

  return (
    <RoadmapContext.Provider
      value={{ roadmap, isHydrated, error, updateMastery }}
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
