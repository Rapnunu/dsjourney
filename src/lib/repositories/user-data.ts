import "server-only";

import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import {
  portfolioProjects,
  roadmapProgress,
  studySessions,
} from "@/lib/db/schema";

/**
 * Deletes all DSJourney application rows for a single user.
 * Idempotent: zero-row deletes are treated as success.
 *
 * Note: the Neon HTTP driver does not support multi-statement transactions here,
 * so deletes run sequentially, each scoped by server-derived userId.
 */
export async function deleteAllUserData(userId: string): Promise<void> {
  const database = getDb();

  await database.delete(studySessions).where(eq(studySessions.userId, userId));
  await database
    .delete(roadmapProgress)
    .where(eq(roadmapProgress.userId, userId));
  await database
    .delete(portfolioProjects)
    .where(eq(portfolioProjects.userId, userId));
}
