"use client";

import { useMemo } from "react";
import { DashboardHeader } from "./dashboard-header";
import { DashboardKpis } from "./dashboard-kpis";
import { JourneyOverview } from "./journey-overview";
import { StudyOverview } from "./study-overview";
import { DueForReviewTop } from "./due-for-review-top";
import { ReadinessSnapshot } from "./readiness-snapshot";
import { PortfolioPanel } from "./portfolio-panel";
import { RecentActivityPanel } from "./recent-activity-panel";
import { QuickActionsRow } from "./quick-actions-row";
import { RecommendedTopic } from "@/features/today/components/recommended-topic";
import {
  getDashboardStats,
  getMasteryDistribution,
  getRecentSessions,
  getRecommendedTopic,
  getReviewTopics,
} from "@/features/today/data";
import {
  getKpiStats,
  getWeeklyActivity,
  getWeeklySessionCount,
} from "@/features/analytics/data";
import {
  getCategoryReadiness,
  getOverallReadiness,
  getTopSkillGaps,
} from "@/features/readiness/data";
import { useSessionStore } from "@/features/sessions/session-provider";
import { useRoadmapStore } from "@/features/roadmap/roadmap-provider";
import { usePortfolioStore } from "@/features/portfolio/portfolio-provider";
import { dashboardCard } from "@/components/dashboard";

function SkeletonPulse({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-bg-elevated ${className ?? ""}`}
    />
  );
}

function DashboardLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className={`${dashboardCard} flex items-center gap-3 px-4 py-3.5`}
          >
            <SkeletonPulse className="h-9 w-9 rounded-lg" />
            <div className="flex-1 space-y-2">
              <SkeletonPulse className="h-6 w-12" />
              <SkeletonPulse className="h-3 w-20" />
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <SkeletonPulse className={`${dashboardCard} h-96 lg:col-span-3`} />
        <SkeletonPulse className={`${dashboardCard} h-72 lg:col-span-2`} />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <SkeletonPulse className={`${dashboardCard} h-72 lg:col-span-3`} />
        <SkeletonPulse className={`${dashboardCard} h-72 lg:col-span-2`} />
      </div>
    </div>
  );
}

export function DashboardView() {
  const { sessions, isHydrated: sessionsHydrated } = useSessionStore();
  const { roadmap, isHydrated: roadmapHydrated } = useRoadmapStore();
  const { projects, isHydrated: portfolioHydrated } = usePortfolioStore();
  const isHydrated = sessionsHydrated && roadmapHydrated && portfolioHydrated;

  const stats = useMemo(
    () => getDashboardStats(sessions, roadmap),
    [sessions, roadmap],
  );

  const kpiStats = useMemo(() => getKpiStats(sessions), [sessions]);
  const weeklyActivity = useMemo(() => getWeeklyActivity(sessions), [sessions]);
  const sessionsThisWeek = useMemo(
    () => getWeeklySessionCount(sessions),
    [sessions],
  );

  const internshipReadiness = useMemo(
    () => getOverallReadiness(roadmap, projects),
    [roadmap, projects],
  );

  const masteryDistribution = useMemo(
    () => getMasteryDistribution(roadmap),
    [roadmap],
  );

  const categoryReadiness = useMemo(
    () => getCategoryReadiness(roadmap, projects),
    [roadmap, projects],
  );

  const skillGaps = useMemo(
    () => getTopSkillGaps(roadmap, projects, 3),
    [roadmap, projects],
  );

  const recentSessions = useMemo(
    () => getRecentSessions(sessions, 3),
    [sessions],
  );

  const recommendedTopic = useMemo(
    () => getRecommendedTopic(roadmap),
    [roadmap],
  );

  const reviewTopics = useMemo(() => getReviewTopics(roadmap), [roadmap]);

  return (
    <div>
      <DashboardHeader />
      <p className="-mt-4 mb-6 max-w-2xl text-sm text-text-muted">
        See your learning progress, study consistency, readiness, and portfolio
        in one place.
      </p>

      <div className="space-y-6">
        {!isHydrated ? (
          <DashboardLoadingSkeleton />
        ) : (
          <>
            <DashboardKpis
              roadmapProgress={stats.overallReadiness}
              hoursThisWeek={stats.hoursThisWeek}
              studyStreak={stats.studyStreak}
              internshipReadiness={internshipReadiness}
            />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
              <div className="space-y-6 lg:col-span-3">
                <JourneyOverview
                  mastery={masteryDistribution}
                  categories={categoryReadiness}
                  roadmapProgress={stats.overallReadiness}
                />
              </div>
              <div className="space-y-6 lg:col-span-2">
                <RecommendedTopic topic={recommendedTopic} />
                <DueForReviewTop topics={reviewTopics} />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
              <div className="lg:col-span-3">
                <StudyOverview
                  kpiStats={kpiStats}
                  hoursThisWeek={stats.hoursThisWeek}
                  sessionsThisWeek={sessionsThisWeek}
                  weeklyActivity={weeklyActivity}
                />
              </div>
              <div className="lg:col-span-2">
                <ReadinessSnapshot
                  readiness={internshipReadiness}
                  skillGaps={skillGaps}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
              <div className="lg:col-span-3">
                <RecentActivityPanel sessions={recentSessions} />
              </div>
              <div className="lg:col-span-2">
                <PortfolioPanel projects={projects} />
              </div>
            </div>

            <QuickActionsRow />
          </>
        )}
      </div>
    </div>
  );
}
