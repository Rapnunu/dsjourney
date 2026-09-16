import "server-only";

import { and, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { roadmapProgress, type RoadmapProgressRow } from "@/lib/db/schema";
import type { MasteryLevel } from "@/features/roadmap/types";

export interface RoadmapProgressRecord {
  topicId: string;
  mastery: MasteryLevel;
  lastStudied?: string;
}

function fromRow(row: RoadmapProgressRow): RoadmapProgressRecord {
  return {
    topicId: row.topicId,
    mastery: row.mastery as MasteryLevel,
    ...(row.lastStudied ? { lastStudied: row.lastStudied } : {}),
  };
}

export async function listRoadmapProgress(
  userId: string,
): Promise<RoadmapProgressRecord[]> {
  const rows = await db
    .select()
    .from(roadmapProgress)
    .where(eq(roadmapProgress.userId, userId));

  return rows.map(fromRow);
}

export async function upsertRoadmapProgress(
  userId: string,
  topicId: string,
  mastery: MasteryLevel,
  lastStudied?: string | null,
): Promise<RoadmapProgressRecord> {
  const [row] = await db
    .insert(roadmapProgress)
    .values({
      userId,
      topicId,
      mastery,
      lastStudied: lastStudied ?? null,
    })
    .onConflictDoUpdate({
      target: [roadmapProgress.userId, roadmapProgress.topicId],
      set: {
        mastery,
        lastStudied: lastStudied ?? null,
      },
    })
    .returning();

  if (!row) {
    throw new Error("Failed to update roadmap progress.");
  }

  return fromRow(row);
}

export async function deleteRoadmapProgressOverride(
  userId: string,
  topicId: string,
): Promise<void> {
  await db
    .delete(roadmapProgress)
    .where(
      and(
        eq(roadmapProgress.userId, userId),
        eq(roadmapProgress.topicId, topicId),
      ),
    );
}

export async function bulkImportRoadmapProgress(
  userId: string,
  records: Array<{
    topicId: string;
    mastery: MasteryLevel;
    lastStudied?: string | null;
  }>,
): Promise<RoadmapProgressRecord[]> {
  if (records.length === 0) {
    return [];
  }

  const rows = await db
    .insert(roadmapProgress)
    .values(
      records.map((record) => ({
        userId,
        topicId: record.topicId,
        mastery: record.mastery,
        lastStudied: record.lastStudied ?? null,
      })),
    )
    .onConflictDoUpdate({
      target: [roadmapProgress.userId, roadmapProgress.topicId],
      set: {
        mastery: sql`excluded.mastery`,
        lastStudied: sql`excluded.last_studied`,
      },
    })
    .returning();

  return rows.map(fromRow);
}
