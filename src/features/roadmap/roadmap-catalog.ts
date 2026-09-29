import { roadmapCatalogData } from "./data";
import type { RoadmapProgressRecord } from "@/lib/repositories/roadmap";
import type { MasteryLevel, RoadmapCategory } from "./types";

export const ROADMAP_CATALOG_TOPIC_COUNT = roadmapCatalogData.reduce(
  (count, category) => count + category.topics.length,
  0,
);

export function cloneFreshRoadmapCatalog(): RoadmapCategory[] {
  return roadmapCatalogData.map((category) => ({
    ...category,
    topics: category.topics.map((topic) => ({ ...topic })),
  }));
}

export function topicExistsInCatalog(topicId: string): boolean {
  return roadmapCatalogData.some((category) =>
    category.topics.some((topic) => topic.id === topicId),
  );
}

export function countRoadmapTopics(roadmap: RoadmapCategory[]): number {
  return roadmap.reduce((count, category) => count + category.topics.length, 0);
}

export type PersistedTopicProgress = {
  mastery: MasteryLevel;
  lastStudied?: string;
};

export function mergeProgress(records: RoadmapProgressRecord[]): RoadmapCategory[] {
  const progressByTopic = new Map(records.map((row) => [row.topicId, row]));

  return cloneFreshRoadmapCatalog().map((category) => ({
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

export function seedPersistedProgressFromRecords(
  records: RoadmapProgressRecord[],
): Map<string, PersistedTopicProgress> {
  const persisted = new Map<string, PersistedTopicProgress>();

  for (const record of records) {
    if (record.mastery === "not_started") continue;

    persisted.set(record.topicId, {
      mastery: record.mastery,
      ...(record.lastStudied ? { lastStudied: record.lastStudied } : {}),
    });
  }

  return persisted;
}

export function overlayProgressOntoCatalog(
  progressByTopic: Map<string, PersistedTopicProgress>,
): RoadmapCategory[] {
  return cloneFreshRoadmapCatalog().map((category) => ({
    ...category,
    topics: category.topics.map((topic) => {
      const progress = progressByTopic.get(topic.id);
      if (!progress || progress.mastery === "not_started") {
        return topic;
      }

      return {
        ...topic,
        mastery: progress.mastery,
        ...(progress.lastStudied ? { lastStudied: progress.lastStudied } : {}),
      };
    }),
  }));
}

/** Rebuild from catalog if topic rows were lost during a bad rollback. */
export function ensureCatalogIntegrity(roadmap: RoadmapCategory[]): RoadmapCategory[] {
  if (countRoadmapTopics(roadmap) === ROADMAP_CATALOG_TOPIC_COUNT) {
    return roadmap;
  }

  const progressByTopic = new Map<string, PersistedTopicProgress>();

  for (const category of roadmap) {
    for (const topic of category.topics) {
      if (topic.mastery === "not_started" && !topic.lastStudied) continue;

      progressByTopic.set(topic.id, {
        mastery: topic.mastery,
        ...(topic.lastStudied ? { lastStudied: topic.lastStudied } : {}),
      });
    }
  }

  return overlayProgressOntoCatalog(progressByTopic);
}

export function applyMasteryUpdate(
  roadmap: RoadmapCategory[],
  topicId: string,
  mastery: MasteryLevel,
  lastStudied?: string,
): RoadmapCategory[] {
  return roadmap.map((category) => ({
    ...category,
    topics: category.topics.map((topic) => {
      if (topic.id !== topicId) {
        return { ...topic };
      }

      if (mastery === "not_started") {
        return {
          ...topic,
          mastery,
          lastStudied: undefined,
        };
      }

      return {
        ...topic,
        mastery,
        ...(lastStudied !== undefined
          ? { lastStudied }
          : topic.lastStudied !== undefined
            ? { lastStudied: topic.lastStudied }
            : {}),
      };
    }),
  }));
}

export function assertCatalogInvariant(roadmap: RoadmapCategory[]): void {
  if (process.env.NODE_ENV === "production") return;

  const topicCount = countRoadmapTopics(roadmap);
  if (topicCount !== ROADMAP_CATALOG_TOPIC_COUNT) {
    console.error(
      `[Roadmap] Catalog invariant violated: expected ${ROADMAP_CATALOG_TOPIC_COUNT} topics, got ${topicCount}.`,
    );
  }
}
