"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  completeStoredRoadmapMigration,
  getStoredRoadmap,
  isStoredRoadmapMigrationComplete,
} from "@/lib/storage";
import { createClient } from "@/lib/supabase/client";
import { mockRoadmapData } from "./data";
import type {
  MasteryLevel,
  RoadmapCategory,
  RoadmapTopic,
} from "./types";

interface RoadmapProgressRow {
  user_id: string;
  topic_id: string;
  mastery: MasteryLevel;
  last_studied: string | null;
}

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

function mergeProgress(rows: RoadmapProgressRow[]): RoadmapCategory[] {
  const progressByTopic = new Map(rows.map((row) => [row.topic_id, row]));

  return cloneDefaultRoadmap().map((category) => ({
    ...category,
    topics: category.topics.map((topic) => {
      const progress = progressByTopic.get(topic.id);
      if (!progress) return topic;

      return {
        ...topic,
        mastery: progress.mastery,
        ...(progress.last_studied
          ? { lastStudied: progress.last_studied }
          : {}),
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

function getLegacyProgress(
  roadmap: RoadmapCategory[],
  userId: string,
): RoadmapProgressRow[] {
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
          user_id: userId,
          topic_id: topic.id,
          mastery: topic.mastery,
          last_studied: topic.lastStudied ?? null,
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
  const details =
    typeof candidate.details === "string" && candidate.details
      ? ` ${candidate.details}`
      : "";
  const hint =
    typeof candidate.hint === "string" && candidate.hint
      ? ` Hint: ${candidate.hint}`
      : "";
  const code =
    typeof candidate.code === "string" && candidate.code
      ? ` (${candidate.code})`
      : "";

  return `${message}${code}${details}${hint}`;
}

export function RoadmapProvider({ children }: { children: ReactNode }) {
  const supabase = useMemo(() => createClient(), []);
  const [roadmap, setRoadmap] = useState<RoadmapCategory[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    async function loadRoadmap() {
      try {
        const { data: userData, error: userError } =
          await supabase.auth.getUser();
        if (userError) throw userError;
        if (!userData.user) {
          throw new Error("You must be signed in to load roadmap progress.");
        }

        const { data, error: fetchError } = await supabase
          .from("roadmap_progress")
          .select("user_id, topic_id, mastery, last_studied")
          .eq("user_id", userData.user.id);
        if (fetchError) throw fetchError;

        let rows = (data ?? []) as RoadmapProgressRow[];
        let resolvedRoadmap = mergeProgress(rows);
        if (rows.length > 0) {
          completeStoredRoadmapMigration();
        } else if (!isStoredRoadmapMigrationComplete()) {
          const stored = getStoredRoadmap();
          if (stored !== null) {
            try {
              const legacyProgress = getLegacyProgress(
                stored,
                userData.user.id,
              );

              if (legacyProgress.length > 0) {
                const { data: imported, error: importError } = await supabase
                  .from("roadmap_progress")
                  .upsert(legacyProgress, {
                    onConflict: "user_id,topic_id",
                  })
                  .select("user_id, topic_id, mastery, last_studied");
                if (importError) throw importError;
                rows = (imported ?? []) as RoadmapProgressRow[];
                resolvedRoadmap = mergeProgress(rows);
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
          setRoadmap([]);
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
  }, [supabase]);

  const updateMastery = useCallback(
    async (topicId: string, mastery: MasteryLevel) => {
      try {
        const topic = roadmap
          .flatMap((category) => category.topics)
          .find((candidate) => candidate.id === topicId);
        if (!topic) throw new Error("Roadmap topic not found.");

        const { data: userData, error: userError } =
          await supabase.auth.getUser();
        if (userError) throw userError;
        if (!userData.user) {
          throw new Error("You must be signed in to update roadmap progress.");
        }

        const defaultTopic = getDefaultTopics().get(topicId);
        const matchesDefault =
          defaultTopic !== undefined &&
          mastery === defaultTopic.mastery &&
          topic.lastStudied === defaultTopic.lastStudied;

        if (matchesDefault) {
          const { error: deleteError } = await supabase
            .from("roadmap_progress")
            .delete()
            .eq("user_id", userData.user.id)
            .eq("topic_id", topicId);
          if (deleteError) throw deleteError;
        } else {
          const { error: upsertError } = await supabase
            .from("roadmap_progress")
            .upsert(
              {
                user_id: userData.user.id,
                topic_id: topicId,
                mastery,
                last_studied: topic.lastStudied ?? null,
              },
              { onConflict: "user_id,topic_id" },
            );
          if (upsertError) throw upsertError;
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
    [roadmap, supabase],
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
