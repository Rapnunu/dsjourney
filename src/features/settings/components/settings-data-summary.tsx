"use client";

import { useMemo } from "react";
import { useSessionStore } from "@/features/sessions/session-provider";
import { useRoadmapStore } from "@/features/roadmap/roadmap-provider";
import { usePortfolioStore } from "@/features/portfolio/portfolio-provider";

function countRoadmapTopicsWithProgress(
  roadmap: ReturnType<typeof useRoadmapStore>["roadmap"],
): number {
  return roadmap.reduce((total, category) => {
    return (
      total +
      category.topics.filter((topic) => topic.mastery !== "not_started").length
    );
  }, 0);
}

export function SettingsDataSummary() {
  const { sessions, isHydrated: sessionsHydrated } = useSessionStore();
  const { roadmap, isHydrated: roadmapHydrated } = useRoadmapStore();
  const { projects, isHydrated: portfolioHydrated } = usePortfolioStore();

  const isHydrated = sessionsHydrated && roadmapHydrated && portfolioHydrated;

  const summary = useMemo(() => {
    if (!isHydrated) {
      return null;
    }

    const topicCount = countRoadmapTopicsWithProgress(roadmap);

    return {
      topicCount,
      sessionCount: sessions.length,
      projectCount: projects.length,
    };
  }, [isHydrated, roadmap, projects.length, sessions.length]);

  if (!summary) {
    return null;
  }

  return (
    <dl className="mt-4 grid gap-3 sm:grid-cols-3">
      <div className="rounded-lg border border-border-subtle bg-bg-elevated px-4 py-3">
        <dt className="text-xs text-text-muted">Roadmap topics with progress</dt>
        <dd className="mt-1 text-lg font-semibold text-text-primary">
          {summary.topicCount}
        </dd>
      </div>
      <div className="rounded-lg border border-border-subtle bg-bg-elevated px-4 py-3">
        <dt className="text-xs text-text-muted">Study sessions</dt>
        <dd className="mt-1 text-lg font-semibold text-text-primary">
          {summary.sessionCount}
        </dd>
      </div>
      <div className="rounded-lg border border-border-subtle bg-bg-elevated px-4 py-3">
        <dt className="text-xs text-text-muted">Portfolio projects</dt>
        <dd className="mt-1 text-lg font-semibold text-text-primary">
          {summary.projectCount}
        </dd>
      </div>
    </dl>
  );
}
