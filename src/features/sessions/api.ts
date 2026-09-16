import {
  apiDelete,
  apiGet,
  apiPatch,
  apiPost,
} from "@/lib/api/client";
import type { SessionInput } from "@/lib/repositories/sessions";
import type { StudySession } from "./types";

export async function fetchSessions(): Promise<StudySession[]> {
  return apiGet<StudySession[]>("/api/sessions");
}

export async function createSessionRequest(
  data: SessionInput,
): Promise<StudySession> {
  return apiPost<StudySession>("/api/sessions", data);
}

export async function updateSessionRequest(
  id: string,
  data: SessionInput,
): Promise<StudySession> {
  return apiPatch<StudySession>(`/api/sessions/${encodeURIComponent(id)}`, data);
}

export async function deleteSessionRequest(id: string): Promise<void> {
  await apiDelete(`/api/sessions/${encodeURIComponent(id)}`);
}

export async function bulkImportSessionsRequest(
  sessions: StudySession[],
): Promise<StudySession[]> {
  return apiPost<StudySession[]>("/api/sessions/import", { sessions });
}
