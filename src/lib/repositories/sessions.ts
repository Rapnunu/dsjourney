import "server-only";

import { and, desc, eq } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import { studySessions, type StudySessionRow } from "@/lib/db/schema";
import type { StudySession } from "@/features/sessions/types";

export type SessionInput = Omit<StudySession, "id" | "createdAt">;

function fromRow(row: StudySessionRow): StudySession {
  return {
    id: row.id,
    topicId: row.topicId,
    topicName: row.topicName,
    categoryName: row.categoryName,
    date: row.studyDate,
    hoursStudied: Number(row.hoursStudied),
    difficultyRating: row.difficultyRating as StudySession["difficultyRating"],
    notes: row.notes,
    createdAt: row.createdAt,
  };
}

function toInsertRow(session: StudySession, userId: string) {
  return {
    userId,
    id: session.id,
    topicId: session.topicId,
    topicName: session.topicName,
    categoryName: session.categoryName,
    studyDate: session.date,
    hoursStudied: session.hoursStudied.toString(),
    difficultyRating: session.difficultyRating,
    notes: session.notes,
    createdAt: session.createdAt,
  };
}

function sortSessions(sessions: StudySession[]): StudySession[] {
  return [...sessions].sort(
    (a, b) =>
      b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt),
  );
}

export async function listSessions(userId: string): Promise<StudySession[]> {
  const rows = await getDb()
    .select()
    .from(studySessions)
    .where(eq(studySessions.userId, userId))
    .orderBy(desc(studySessions.studyDate), desc(studySessions.createdAt));

  return sortSessions(rows.map(fromRow));
}

export async function createSession(
  userId: string,
  data: SessionInput,
  options?: { id?: string; createdAt?: string },
): Promise<StudySession> {
  const session: StudySession = {
    ...data,
    id: options?.id ?? `s-${Date.now()}`,
    createdAt: options?.createdAt ?? new Date().toISOString(),
  };

  const [row] = await getDb()
    .insert(studySessions)
    .values(toInsertRow(session, userId))
    .returning();

  if (!row) {
    throw new Error("Failed to create study session.");
  }

  return fromRow(row);
}

export async function updateSession(
  userId: string,
  id: string,
  data: SessionInput,
): Promise<StudySession> {
  const [row] = await getDb()
    .update(studySessions)
    .set({
      topicId: data.topicId,
      topicName: data.topicName,
      categoryName: data.categoryName,
      studyDate: data.date,
      hoursStudied: data.hoursStudied.toString(),
      difficultyRating: data.difficultyRating,
      notes: data.notes,
    })
    .where(and(eq(studySessions.userId, userId), eq(studySessions.id, id)))
    .returning();

  if (!row) {
    throw new Error("Study session not found.");
  }

  return fromRow(row);
}

export async function deleteSession(userId: string, id: string): Promise<void> {
  const [row] = await getDb()
    .delete(studySessions)
    .where(and(eq(studySessions.userId, userId), eq(studySessions.id, id)))
    .returning({ id: studySessions.id });

  if (!row) {
    throw new Error("Study session not found.");
  }
}

export async function bulkImportSessions(
  userId: string,
  sessions: StudySession[],
): Promise<StudySession[]> {
  if (sessions.length === 0) {
    return [];
  }

  const rows = await getDb()
    .insert(studySessions)
    .values(sessions.map((session) => toInsertRow(session, userId)))
    .returning();

  return sortSessions(rows.map(fromRow));
}
