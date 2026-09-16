import {
  apiDelete,
  apiGet,
  apiPost,
  apiPut,
} from "@/lib/api/client";
import type { RoadmapProgressRecord } from "@/lib/repositories/roadmap";
import type { MasteryLevel } from "./types";

export async function fetchRoadmapProgress(): Promise<RoadmapProgressRecord[]> {
  return apiGet<RoadmapProgressRecord[]>("/api/roadmap");
}

export async function upsertRoadmapProgressRequest(
  topicId: string,
  mastery: MasteryLevel,
  lastStudied?: string | null,
): Promise<RoadmapProgressRecord> {
  return apiPut<RoadmapProgressRecord>(
    `/api/roadmap/${encodeURIComponent(topicId)}`,
    { mastery, lastStudied },
  );
}

export async function deleteRoadmapProgressOverrideRequest(
  topicId: string,
): Promise<void> {
  await apiDelete(`/api/roadmap/${encodeURIComponent(topicId)}`);
}

export async function bulkImportRoadmapProgressRequest(
  records: Array<{
    topicId: string;
    mastery: MasteryLevel;
    lastStudied?: string | null;
  }>,
): Promise<RoadmapProgressRecord[]> {
  return apiPost<RoadmapProgressRecord[]>("/api/roadmap/import", { records });
}
