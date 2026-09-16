import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { auth } from "@/lib/auth/server";
import { requireUser } from "@/lib/auth/require-user";
import { listPortfolioProjects } from "@/lib/repositories/portfolio";
import { listRoadmapProgress } from "@/lib/repositories/roadmap";
import { listSessions } from "@/lib/repositories/sessions";

export const dynamic = "force-dynamic";

const TRACKER_TABLES = [
  "study_sessions",
  "roadmap_progress",
  "portfolio_projects",
] as const;

type TrackerTable = (typeof TRACKER_TABLES)[number];

function isHealthCheckEnabled(): boolean {
  return (
    process.env.NODE_ENV === "development" ||
    process.env.VERCEL_ENV === "preview"
  );
}

function getSafeErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  if (typeof error === "object" && error !== null) {
    const candidate = error as Record<string, unknown>;
    if (typeof candidate.message === "string" && candidate.message.trim()) {
      return candidate.message;
    }
  }

  return "Unknown repository error.";
}

function getDatabaseHost(): string | null {
  const databaseUrl = process.env.DATABASE_URL?.trim();

  if (!databaseUrl) {
    return null;
  }

  try {
    return new URL(databaseUrl.replace(/^postgresql:/, "http:")).hostname;
  } catch {
    return null;
  }
}

async function runRepositoryProbe<T>(
  operation: () => Promise<T[]>,
): Promise<{ ok: true; count: number } | { ok: false; error: string }> {
  try {
    const rows = await operation();
    return { ok: true, count: rows.length };
  } catch (error) {
    return { ok: false, error: getSafeErrorMessage(error) };
  }
}

export async function GET() {
  if (!isHealthCheckEnabled()) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const hasDatabaseUrl = Boolean(process.env.DATABASE_URL?.trim());
  const hasNeonAuthBaseUrl = Boolean(process.env.NEON_AUTH_BASE_URL?.trim());
  const hasNeonAuthCookieSecret = Boolean(
    process.env.NEON_AUTH_COOKIE_SECRET?.trim(),
  );

  let dbPing = false;
  let sessionAvailable = false;
  let databaseName: string | null = null;
  let schemaName: string | null = null;
  const tables: Record<TrackerTable, boolean> = {
    study_sessions: false,
    roadmap_progress: false,
    portfolio_projects: false,
  };
  const counts: Record<TrackerTable, number | null> = {
    study_sessions: null,
    roadmap_progress: null,
    portfolio_projects: null,
  };
  const repositories: Record<
    TrackerTable,
    { ok: true; count: number } | { ok: false; error: string } | null
  > = {
    study_sessions: null,
    roadmap_progress: null,
    portfolio_projects: null,
  };

  if (hasDatabaseUrl) {
    try {
      const sql = neon(process.env.DATABASE_URL!.trim());
      const ping = await sql`SELECT 1 AS ok`;
      dbPing = ping[0]?.ok === 1;

      const context = await sql`
        SELECT current_database() AS database_name, current_schema() AS schema_name
      `;
      databaseName = context[0]?.database_name ?? null;
      schemaName = context[0]?.schema_name ?? null;

      for (const tableName of TRACKER_TABLES) {
        const result = await sql`
          SELECT to_regclass(${`public.${tableName}`}) IS NOT NULL AS exists
        `;
        tables[tableName] = Boolean(result[0]?.exists);
      }
    } catch {
      dbPing = false;
    }
  }

  let userId: string | null = null;

  try {
    const { data: session, error } = await auth.getSession();
    sessionAvailable = !error && Boolean(session?.user);
    userId = session?.user?.id ?? null;
  } catch {
    sessionAvailable = false;
  }

  if (dbPing && userId) {
    try {
      const sql = neon(process.env.DATABASE_URL!.trim());

      const [sessionCount] = await sql`
        SELECT COUNT(*)::int AS count
        FROM public.study_sessions
        WHERE user_id = ${userId}::uuid
      `;
      counts.study_sessions = sessionCount?.count ?? 0;

      const [roadmapCount] = await sql`
        SELECT COUNT(*)::int AS count
        FROM public.roadmap_progress
        WHERE user_id = ${userId}::uuid
      `;
      counts.roadmap_progress = roadmapCount?.count ?? 0;

      const [portfolioCount] = await sql`
        SELECT COUNT(*)::int AS count
        FROM public.portfolio_projects
        WHERE user_id = ${userId}::uuid
      `;
      counts.portfolio_projects = portfolioCount?.count ?? 0;
    } catch (error) {
      const message = getSafeErrorMessage(error);
      counts.study_sessions = null;
      counts.roadmap_progress = null;
      counts.portfolio_projects = null;

      for (const tableName of TRACKER_TABLES) {
        repositories[tableName] = { ok: false, error: message };
      }
    }
  }

  if (sessionAvailable && userId) {
    try {
      await requireUser();
      repositories.study_sessions = await runRepositoryProbe(() =>
        listSessions(userId!),
      );
      repositories.roadmap_progress = await runRepositoryProbe(() =>
        listRoadmapProgress(userId!),
      );
      repositories.portfolio_projects = await runRepositoryProbe(() =>
        listPortfolioProjects(userId!),
      );
    } catch (error) {
      const message = getSafeErrorMessage(error);
      repositories.study_sessions = { ok: false, error: message };
      repositories.roadmap_progress = { ok: false, error: message };
      repositories.portfolio_projects = { ok: false, error: message };
    }
  }

  const userIdLooksLikeUuid = Boolean(
    userId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId),
  );

  return NextResponse.json({
    hasDatabaseUrl,
    hasNeonAuthBaseUrl,
    hasNeonAuthCookieSecret,
    dbPing,
    sessionAvailable,
    userIdLooksLikeUuid,
    databaseName,
    schemaName,
    databaseHost: getDatabaseHost(),
    neonProjectId: "steep-dream-27684205",
    expectedDatabase: "neondb",
    expectedBranch: "production",
    expectedDatabaseHost:
      "ep-late-thunder-aztt73ds-pooler.c-3.ap-southeast-1.aws.neon.tech",
    tables,
    counts,
    repositories,
  });
}
