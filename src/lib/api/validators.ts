import type { Project, ProjectStatus } from "@/features/portfolio/data/projects";
import type { MasteryLevel } from "@/features/roadmap/types";
import type { StudySession } from "@/features/sessions/types";
import type { SessionInput } from "@/lib/repositories/sessions";
import type { ProjectInput } from "@/lib/repositories/portfolio";
import {
  MAX_PORTFOLIO_IMPORT,
  MAX_ROADMAP_IMPORT,
  MAX_SESSIONS_IMPORT,
  PORTFOLIO_DESCRIPTION_MAX,
  PORTFOLIO_HIGHLIGHT_ITEM_MAX,
  PORTFOLIO_HIGHLIGHT_MAX_COUNT,
  PORTFOLIO_ID_MAX,
  PORTFOLIO_TECH_ITEM_MAX,
  PORTFOLIO_TECH_MAX_COUNT,
  PORTFOLIO_TITLE_MAX,
  PORTFOLIO_URL_MAX,
  ROADMAP_TOPIC_ID_MAX,
  SESSION_CATEGORY_NAME_MAX,
  SESSION_HOURS_MAX,
  SESSION_ID_MAX,
  SESSION_NOTES_MAX,
  SESSION_TOPIC_ID_MAX,
  SESSION_TOPIC_NAME_MAX,
} from "@/lib/api/validation-limits";

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

const BLOCKED_URL_SCHEME = /^(javascript|data|vbscript|file):/i;

export type ValidationResult<T> =
  | T
  | { error: string; status?: number };

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function hasMaxLength(value: string, max: number): boolean {
  return value.length <= max;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function boundedStringArray(
  value: unknown,
  maxItems: number,
  maxItemLength: number,
): string[] | null {
  if (!isStringArray(value) || value.length > maxItems) {
    return null;
  }

  if (value.some((item) => item.length > maxItemLength)) {
    return null;
  }

  return value;
}

/** Validates YYYY-MM-DD calendar dates. */
export function isValidDateString(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [year, month, day] = value.split("-").map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));

  return (
    parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() === month - 1 &&
    parsed.getUTCDate() === day
  );
}

/** Validates ISO-8601 timestamps used by session imports. */
function isValidIsoDateTime(value: string): boolean {
  const parsed = Date.parse(value);
  return Number.isFinite(parsed);
}

/**
 * Allows only http: and https: URLs.
 * Rejects javascript:, data:, vbscript:, file:, and malformed values.
 */
export function parseHttpHttpsUrl(
  value: string,
): { url: string } | { error: string } {
  const trimmed = value.trim();

  if (!trimmed) {
    return { error: "URL must not be empty." };
  }

  if (trimmed.length > PORTFOLIO_URL_MAX) {
    return { error: "URL exceeds maximum length." };
  }

  if (BLOCKED_URL_SCHEME.test(trimmed)) {
    return { error: "URL scheme is not allowed." };
  }

  let parsed: URL;

  try {
    parsed = new URL(trimmed);
  } catch {
    return { error: "URL is malformed." };
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return { error: "URL must use http or https." };
  }

  return { url: trimmed };
}

function parseOptionalHttpHttpsUrl(
  value: unknown,
): { url?: string } | { error: string } {
  if (value === undefined || value === null || value === "") {
    return {};
  }

  if (typeof value !== "string") {
    return { error: "Invalid project payload." };
  }

  const result = parseHttpHttpsUrl(value);

  if ("error" in result) {
    return result;
  }

  return { url: result.url };
}

function parseHoursStudied(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return null;
  }

  if (value <= 0 || value > SESSION_HOURS_MAX) {
    return null;
  }

  return value;
}

function parseDifficultyRating(
  value: unknown,
): StudySession["difficultyRating"] | null {
  if (
    typeof value !== "number" ||
    !Number.isInteger(value) ||
    value < 1 ||
    value > 5
  ) {
    return null;
  }

  return value as StudySession["difficultyRating"];
}

function assertUniqueIds(
  ids: string[],
  label: string,
): { error: string; status?: number } | null {
  const seen = new Set<string>();

  for (const id of ids) {
    if (seen.has(id)) {
      return {
        error: `Duplicate ${label} in import batch: ${id}.`,
        status: 409,
      };
    }

    seen.add(id);
  }

  return null;
}

export function parseTopicIdParam(topicId: string): ValidationResult<string> {
  if (!isNonEmptyString(topicId) || !hasMaxLength(topicId, ROADMAP_TOPIC_ID_MAX)) {
    return { error: "Invalid topic ID." };
  }

  return topicId;
}

export function parseSessionInput(value: unknown): ValidationResult<SessionInput> {
  if (!value || typeof value !== "object") {
    return { error: "Invalid session payload." };
  }

  const record = value as Record<string, unknown>;

  if (
    !isNonEmptyString(record.topicId) ||
    !hasMaxLength(record.topicId, SESSION_TOPIC_ID_MAX) ||
    !isNonEmptyString(record.topicName) ||
    !hasMaxLength(record.topicName, SESSION_TOPIC_NAME_MAX) ||
    !isNonEmptyString(record.categoryName) ||
    !hasMaxLength(record.categoryName, SESSION_CATEGORY_NAME_MAX) ||
    typeof record.date !== "string" ||
    !isValidDateString(record.date) ||
    typeof record.notes !== "string" ||
    record.notes.length > SESSION_NOTES_MAX
  ) {
    return { error: "Invalid session payload." };
  }

  const hoursStudied = parseHoursStudied(record.hoursStudied);
  const difficultyRating = parseDifficultyRating(record.difficultyRating);

  if (hoursStudied === null || difficultyRating === null) {
    return { error: "Invalid session payload." };
  }

  return {
    topicId: record.topicId,
    topicName: record.topicName,
    categoryName: record.categoryName,
    date: record.date,
    hoursStudied,
    difficultyRating,
    notes: record.notes,
  };
}

export function parseStudySessionsImport(
  value: unknown,
): ValidationResult<StudySession[]> {
  if (!value || typeof value !== "object") {
    return { error: "Invalid sessions import payload." };
  }

  const record = value as Record<string, unknown>;

  if (!Array.isArray(record.sessions)) {
    return { error: "Invalid sessions import payload." };
  }

  if (record.sessions.length > MAX_SESSIONS_IMPORT) {
    return {
      error: `Import exceeds maximum of ${MAX_SESSIONS_IMPORT} sessions.`,
      status: 413,
    };
  }

  const sessions: StudySession[] = [];
  const ids: string[] = [];

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
      !hasMaxLength(session.id, SESSION_ID_MAX) ||
      typeof session.createdAt !== "string" ||
      !isValidIsoDateTime(session.createdAt)
    ) {
      return { error: "Invalid sessions import payload." };
    }

    ids.push(session.id);
    sessions.push({
      ...input,
      id: session.id,
      createdAt: session.createdAt,
    });
  }

  const duplicateCheck = assertUniqueIds(ids, "session ID");

  if (duplicateCheck) {
    return duplicateCheck;
  }

  return sessions;
}

export function parseRoadmapUpsertBody(value: unknown): ValidationResult<{
  mastery: MasteryLevel;
  lastStudied?: string | null;
}> {
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

  if (record.lastStudied === null || record.lastStudied === undefined) {
    return {
      mastery: record.mastery as MasteryLevel,
      lastStudied: record.lastStudied as string | null | undefined,
    };
  }

  if (
    typeof record.lastStudied !== "string" ||
    !isValidDateString(record.lastStudied)
  ) {
    return { error: "Invalid roadmap payload." };
  }

  return {
    mastery: record.mastery as MasteryLevel,
    lastStudied: record.lastStudied,
  };
}

export function parseRoadmapImportRecords(value: unknown): ValidationResult<
  Array<{
    topicId: string;
    mastery: MasteryLevel;
    lastStudied?: string | null;
  }>
> {
  if (!value || typeof value !== "object") {
    return { error: "Invalid roadmap import payload." };
  }

  const record = value as Record<string, unknown>;

  if (!Array.isArray(record.records)) {
    return { error: "Invalid roadmap import payload." };
  }

  if (record.records.length > MAX_ROADMAP_IMPORT) {
    return {
      error: `Import exceeds maximum of ${MAX_ROADMAP_IMPORT} roadmap records.`,
      status: 413,
    };
  }

  const records: Array<{
    topicId: string;
    mastery: MasteryLevel;
    lastStudied?: string | null;
  }> = [];
  const topicIds: string[] = [];

  for (const item of record.records) {
    if (!item || typeof item !== "object") {
      return { error: "Invalid roadmap import payload." };
    }

    const row = item as Record<string, unknown>;

    if (
      !isNonEmptyString(row.topicId) ||
      !hasMaxLength(row.topicId, ROADMAP_TOPIC_ID_MAX) ||
      typeof row.mastery !== "string" ||
      !MASTERY_LEVELS.has(row.mastery as MasteryLevel)
    ) {
      return { error: "Invalid roadmap import payload." };
    }

    if (row.lastStudied !== undefined && row.lastStudied !== null) {
      if (
        typeof row.lastStudied !== "string" ||
        !isValidDateString(row.lastStudied)
      ) {
        return { error: "Invalid roadmap import payload." };
      }
    }

    topicIds.push(row.topicId);
    records.push({
      topicId: row.topicId,
      mastery: row.mastery as MasteryLevel,
      lastStudied:
        row.lastStudied === undefined
          ? undefined
          : (row.lastStudied as string | null),
    });
  }

  const duplicateCheck = assertUniqueIds(topicIds, "topic ID");

  if (duplicateCheck) {
    return duplicateCheck;
  }

  return records;
}

export function parseProjectInput(value: unknown): ValidationResult<ProjectInput> {
  if (!value || typeof value !== "object") {
    return { error: "Invalid project payload." };
  }

  const record = value as Record<string, unknown>;
  const technologies = boundedStringArray(
    record.technologies,
    PORTFOLIO_TECH_MAX_COUNT,
    PORTFOLIO_TECH_ITEM_MAX,
  );
  const highlights = boundedStringArray(
    record.highlights,
    PORTFOLIO_HIGHLIGHT_MAX_COUNT,
    PORTFOLIO_HIGHLIGHT_ITEM_MAX,
  );

  if (
    !isNonEmptyString(record.title) ||
    !hasMaxLength(record.title, PORTFOLIO_TITLE_MAX) ||
    !isNonEmptyString(record.description) ||
    !hasMaxLength(record.description, PORTFOLIO_DESCRIPTION_MAX) ||
    typeof record.status !== "string" ||
    !PROJECT_STATUSES.has(record.status as ProjectStatus) ||
    technologies === null ||
    highlights === null ||
    typeof record.startDate !== "string" ||
    !isValidDateString(record.startDate)
  ) {
    return { error: "Invalid project payload." };
  }

  const githubResult = parseOptionalHttpHttpsUrl(record.githubUrl);

  if ("error" in githubResult) {
    return githubResult;
  }

  const demoResult = parseOptionalHttpHttpsUrl(record.demoUrl);

  if ("error" in demoResult) {
    return demoResult;
  }

  if (
    record.endDate !== undefined &&
    record.endDate !== null &&
    (typeof record.endDate !== "string" || !isValidDateString(record.endDate))
  ) {
    return { error: "Invalid project payload." };
  }

  return {
    title: record.title,
    description: record.description,
    status: record.status as ProjectStatus,
    technologies,
    githubUrl: githubResult.url,
    demoUrl: demoResult.url,
    highlights,
    startDate: record.startDate,
    endDate: typeof record.endDate === "string" ? record.endDate : undefined,
  };
}

export function parseProjectsImport(value: unknown): ValidationResult<Project[]> {
  if (!value || typeof value !== "object") {
    return { error: "Invalid projects import payload." };
  }

  const record = value as Record<string, unknown>;

  if (!Array.isArray(record.projects)) {
    return { error: "Invalid projects import payload." };
  }

  if (record.projects.length > MAX_PORTFOLIO_IMPORT) {
    return {
      error: `Import exceeds maximum of ${MAX_PORTFOLIO_IMPORT} projects.`,
      status: 413,
    };
  }

  const projects: Project[] = [];
  const ids: string[] = [];

  for (const item of record.projects) {
    if (!item || typeof item !== "object") {
      return { error: "Invalid projects import payload." };
    }

    const project = item as Record<string, unknown>;
    const input = parseProjectInput(project);

    if ("error" in input) {
      return input;
    }

    if (!isNonEmptyString(project.id) || !hasMaxLength(project.id, PORTFOLIO_ID_MAX)) {
      return { error: "Invalid projects import payload." };
    }

    ids.push(project.id);
    projects.push({
      ...input,
      id: project.id,
    });
  }

  const duplicateCheck = assertUniqueIds(ids, "project ID");

  if (duplicateCheck) {
    return duplicateCheck;
  }

  return projects;
}

export function isValidationError<T>(
  result: ValidationResult<T>,
): result is { error: string; status?: number } {
  return (
    typeof result === "object" &&
    result !== null &&
    "error" in result &&
    typeof (result as { error: unknown }).error === "string"
  );
}
