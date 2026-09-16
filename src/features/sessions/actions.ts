"use server";

import { requireUser } from "@/lib/auth/require-user";
import {
  bulkImportSessions,
  createSession,
  deleteSession,
  listSessions,
  updateSession,
  type SessionInput,
} from "@/lib/repositories/sessions";
import type { StudySession } from "./types";

export async function listSessionsAction(): Promise<StudySession[]> {
  const user = await requireUser();
  return listSessions(user.id);
}

export async function createSessionAction(
  data: SessionInput,
): Promise<StudySession> {
  const user = await requireUser();
  return createSession(user.id, data);
}

export async function updateSessionAction(
  id: string,
  data: SessionInput,
): Promise<StudySession> {
  const user = await requireUser();
  return updateSession(user.id, id, data);
}

export async function deleteSessionAction(id: string): Promise<void> {
  const user = await requireUser();
  await deleteSession(user.id, id);
}

export async function bulkImportSessionsAction(
  sessions: StudySession[],
): Promise<StudySession[]> {
  const user = await requireUser();
  return bulkImportSessions(user.id, sessions);
}
