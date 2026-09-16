"use server";

import { requireUser } from "@/lib/auth/require-user";
import {
  bulkImportRoadmapProgress,
  deleteRoadmapProgressOverride,
  listRoadmapProgress,
  upsertRoadmapProgress,
  type RoadmapProgressRecord,
} from "@/lib/repositories/roadmap";
import type { MasteryLevel } from "./types";

export async function listRoadmapProgressAction(): Promise<
  RoadmapProgressRecord[]
> {
  const user = await requireUser();
  return listRoadmapProgress(user.id);
}

export async function upsertRoadmapProgressAction(
  topicId: string,
  mastery: MasteryLevel,
  lastStudied?: string | null,
): Promise<RoadmapProgressRecord> {
  const user = await requireUser();
  return upsertRoadmapProgress(user.id, topicId, mastery, lastStudied);
}

export async function deleteRoadmapProgressOverrideAction(
  topicId: string,
): Promise<void> {
  const user = await requireUser();
  await deleteRoadmapProgressOverride(user.id, topicId);
}

export async function bulkImportRoadmapProgressAction(
  records: Array<{
    topicId: string;
    mastery: MasteryLevel;
    lastStudied?: string | null;
  }>,
): Promise<RoadmapProgressRecord[]> {
  const user = await requireUser();
  return bulkImportRoadmapProgress(user.id, records);
}
