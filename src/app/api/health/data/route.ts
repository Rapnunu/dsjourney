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

async function runRepositoryProbe<T>(
  operation: () => Promise<T[]>,
): Promise<{ ok: true; count: number } | { ok: false }> {
  try {
    const rows = await operation();
    return { ok: true, count: rows.length };
  } catch {
    return { ok: false };
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
  const tables: Record<TrackerTable, boolean> = {
    study_sessions: false,
    roadmap_progress: false,
    portfolio_projects: false,
  };
  const repositories: Record<
    TrackerTable,
    { ok: true; count: number } | { ok: false } | null
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

  try {
    const { data: session, error } = await auth.getSession();
    sessionAvailable = !error && Boolean(session?.user);

    if (sessionAvailable && session?.user?.id) {
      try {
        await requireUser();
        const userId = session.user.id;
        repositories.study_sessions = await runRepositoryProbe(() =>
          listSessions(userId),
        );
        repositories.roadmap_progress = await runRepositoryProbe(() =>
          listRoadmapProgress(userId),
        );
        repositories.portfolio_projects = await runRepositoryProbe(() =>
          listPortfolioProjects(userId),
        );
      } catch {
        repositories.study_sessions = { ok: false };
        repositories.roadmap_progress = { ok: false };
        repositories.portfolio_projects = { ok: false };
      }
    }
  } catch {
    sessionAvailable = false;
  }

  return NextResponse.json({
    hasDatabaseUrl,
    hasNeonAuthBaseUrl,
    hasNeonAuthCookieSecret,
    dbPing,
    sessionAvailable,
    tables,
    repositories,
  });
}
