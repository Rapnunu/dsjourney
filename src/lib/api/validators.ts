import type { Project, ProjectStatus } from "@/features/portfolio/data/projects";
import type { MasteryLevel } from "@/features/roadmap/types";
import type { StudySession } from "@/features/sessions/types";
import type { SessionInput } from "@/lib/repositories/sessions";
import type { ProjectInput } from "@/lib/repositories/portfolio";

const MASTERY_LEVELS = new Set<MasteryLevel>([
  "not_started",
  "learning",
  "practiced",
  "mastered",
]);

const PROJECT_STATUSES = new Set<ProjectStatus>([
  "completed",
  "in_progress",
  "planned",
]);

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

export function parseSessionInput(
  value: unknown,
): SessionInput | { error: string } {
  if (!value || typeof value !== "object") {
    return { error: "Invalid session payload." };
  }

  const record = value as Record<string, unknown>;

  if (
    !isNonEmptyString(record.topicId) ||
    !isNonEmptyString(record.topicName) ||
    !isNonEmptyString(record.categoryName) ||
    !isNonEmptyString(record.date) ||
    typeof record.hoursStudied !== "number" ||
    !Number.isFinite(record.hoursStudied) ||
    typeof record.difficultyRating !== "number" ||
    record.difficultyRating < 1 ||
    record.difficultyRating > 5 ||
    typeof record.notes !== "string"
  ) {
    return { error: "Invalid session payload." };
  }

  return {
    topicId: record.topicId,
    topicName: record.topicName,
    categoryName: record.categoryName,
    date: record.date,
    hoursStudied: record.hoursStudied,
    difficultyRating: record.difficultyRating as StudySession["difficultyRating"],
    notes: record.notes,
  };
}

export function parseStudySessionsImport(
  value: unknown,
): StudySession[] | { error: string } {
  if (!value || typeof value !== "object") {
    return { error: "Invalid sessions import payload." };
  }

  const record = value as Record<string, unknown>;
  if (!Array.isArray(record.sessions)) {
    return { error: "Invalid sessions import payload." };
  }

  const sessions: StudySession[] = [];

  for (const item of record.sessions) {
    if (!item || typeof item !== "object") {
      return { error: "Invalid sessions import payload." };
    }

    const session = item as Record<string, unknown>;
    const input = parseSessionInput(session);

    if ("error" in input) {
      return input;
    }

    if (
      !isNonEmptyString(session.id) ||
      !isNonEmptyString(session.createdAt)
    ) {
      return { error: "Invalid sessions import payload." };
    }

    sessions.push({
      ...input,
      id: session.id,
      createdAt: session.createdAt,
    });
  }

  return sessions;
}

export function parseRoadmapUpsertBody(value: unknown):
  | { mastery: MasteryLevel; lastStudied?: string | null }
  | { error: string } {
  if (!value || typeof value !== "object") {
    return { error: "Invalid roadmap payload." };
  }

  const record = value as Record<string, unknown>;

  if (
    typeof record.mastery !== "string" ||
    !MASTERY_LEVELS.has(record.mastery as MasteryLevel)
  ) {
    return { error: "Invalid roadmap payload." };
  }

  if (
    record.lastStudied !== undefined &&
    record.lastStudied !== null &&
    typeof record.lastStudied !== "string"
  ) {
    return { error: "Invalid roadmap payload." };
  }

  return {
    mastery: record.mastery as MasteryLevel,
    lastStudied:
      record.lastStudied === undefined
        ? undefined
        : (record.lastStudied as string | null),
  };
}

export function parseRoadmapImportRecords(value: unknown): Array<{
  topicId: string;
  mastery: MasteryLevel;
  lastStudied?: string | null;
}> | { error: string } {
  if (!value || typeof value !== "object") {
    return { error: "Invalid roadmap import payload." };
  }

  const record = value as Record<string, unknown>;
  if (!Array.isArray(record.records)) {
    return { error: "Invalid roadmap import payload." };
  }

  const records: Array<{
    topicId: string;
    mastery: MasteryLevel;
    lastStudied?: string | null;
  }> = [];

  for (const item of record.records) {
    if (!item || typeof item !== "object") {
      return { error: "Invalid roadmap import payload." };
    }

    const row = item as Record<string, unknown>;
    if (
      !isNonEmptyString(row.topicId) ||
      typeof row.mastery !== "string" ||
      !MASTERY_LEVELS.has(row.mastery as MasteryLevel)
    ) {
      return { error: "Invalid roadmap import payload." };
    }

    if (
      row.lastStudied !== undefined &&
      row.lastStudied !== null &&
      typeof row.lastStudied !== "string"
    ) {
      return { error: "Invalid roadmap import payload." };
    }

    records.push({
      topicId: row.topicId,
      mastery: row.mastery as MasteryLevel,
      lastStudied:
        row.lastStudied === undefined
          ? undefined
          : (row.lastStudied as string | null),
    });
  }

  return records;
}

export function parseProjectInput(
  value: unknown,
): ProjectInput | { error: string } {
  if (!value || typeof value !== "object") {
    return { error: "Invalid project payload." };
  }

  const record = value as Record<string, unknown>;

  if (
    !isNonEmptyString(record.title) ||
    !isNonEmptyString(record.description) ||
    typeof record.status !== "string" ||
    !PROJECT_STATUSES.has(record.status as ProjectStatus) ||
    !isStringArray(record.technologies) ||
    !isStringArray(record.highlights) ||
    !isNonEmptyString(record.startDate)
  ) {
    return { error: "Invalid project payload." };
  }

  if (
    record.githubUrl !== undefined &&
    record.githubUrl !== null &&
    typeof record.githubUrl !== "string"
  ) {
    return { error: "Invalid project payload." };
  }

  if (
    record.demoUrl !== undefined &&
    record.demoUrl !== null &&
    typeof record.demoUrl !== "string"
  ) {
    return { error: "Invalid project payload." };
  }

  if (
    record.endDate !== undefined &&
    record.endDate !== null &&
    typeof record.endDate !== "string"
  ) {
    return { error: "Invalid project payload." };
  }

  return {
    title: record.title,
    description: record.description,
    status: record.status as ProjectStatus,
    technologies: record.technologies,
    githubUrl:
      typeof record.githubUrl === "string" ? record.githubUrl : undefined,
    demoUrl: typeof record.demoUrl === "string" ? record.demoUrl : undefined,
    highlights: record.highlights,
    startDate: record.startDate,
    endDate: typeof record.endDate === "string" ? record.endDate : undefined,
  };
}

export function parseProjectsImport(
  value: unknown,
): Project[] | { error: string } {
  if (!value || typeof value !== "object") {
    return { error: "Invalid projects import payload." };
  }

  const record = value as Record<string, unknown>;
  if (!Array.isArray(record.projects)) {
    return { error: "Invalid projects import payload." };
  }

  const projects: Project[] = [];

  for (const item of record.projects) {
    if (!item || typeof item !== "object") {
      return { error: "Invalid projects import payload." };
    }

    const project = item as Record<string, unknown>;
    const input = parseProjectInput(project);

    if ("error" in input) {
      return input;
    }

    if (!isNonEmptyString(project.id)) {
      return { error: "Invalid projects import payload." };
    }

    projects.push({
      ...input,
      id: project.id,
    });
  }

  return projects;
}
