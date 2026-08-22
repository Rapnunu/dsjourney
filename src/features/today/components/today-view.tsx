"use client";

import { useMemo } from "react";
import { WelcomeHeader } from "./welcome-header";
import { QuickStats } from "./quick-stats";
import { RecommendedTopic } from "./recommended-topic";
import { DueForReview } from "./due-for-review";
import { TodaysGoals } from "./todays-goals";
import { QuickActions } from "./quick-actions";
import { getDashboardStats, getRecommendedTopic, getReviewTopics } from "../data";
import { useSessionStore } from "@/features/sessions/session-provider";
import { useRoadmapStore } from "@/features/roadmap/roadmap-provider";

// ── Skeleton placeholders ──────────────────────────────────────────

function SkeletonPulse({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-bg-surface/60 ${className ?? ""}`}
    />
  );
}

function QuickStatsSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border border-border-subtle bg-bg-surface/50 px-4 py-4 flex items-center gap-3"
        >
          <SkeletonPulse className="h-10 w-10 rounded-xl" />
          <div className="flex-1 space-y-2">
            <SkeletonPulse className="h-6 w-12" />
            <SkeletonPulse className="h-3 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      {/* Left column */}
      <div className="lg:col-span-3 space-y-6">
        <div className="rounded-xl border border-border-primary bg-bg-surface/50 p-5 space-y-3">
          <SkeletonPulse className="h-4 w-32" />
          <SkeletonPulse className="h-5 w-48" />
          <SkeletonPulse className="h-4 w-40" />
          <SkeletonPulse className="h-9 w-36 rounded-lg" />
        </div>
        <div className="rounded-xl border border-border-primary bg-bg-surface/50 p-5 space-y-3">
          <SkeletonPulse className="h-4 w-28" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between py-2">
              <div className="space-y-1.5">
                <SkeletonPulse className="h-4 w-36" />
                <SkeletonPulse className="h-3 w-20" />
              </div>
              <SkeletonPulse className="h-5 w-16 rounded-md" />
            </div>
          ))}
        </div>
      </div>

      {/* Right column */}
      <div className="lg:col-span-2 space-y-6">
        <div className="rounded-xl border border-border-primary bg-bg-surface/50 p-5 space-y-3">
          <SkeletonPulse className="h-4 w-28" />
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonPulse key={i} className="h-5 w-full" />
          ))}
        </div>
        <div className="rounded-xl border border-border-primary bg-bg-surface/50 p-5 space-y-3">
          <SkeletonPulse className="h-4 w-24" />
          <SkeletonPulse className="h-9 w-full rounded-lg" />
          <SkeletonPulse className="h-9 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}

// ── Main view ──────────────────────────────────────────────────────

export function TodayView() {
  const { sessions, isHydrated: sessionsHydrated } = useSessionStore();
  const { roadmap, isHydrated: roadmapHydrated } = useRoadmapStore();
  const isHydrated = sessionsHydrated && roadmapHydrated;

  // Session-dependent stats (recalculate when sessions change)
  const stats = useMemo(
    () => getDashboardStats(sessions, roadmap),
    [sessions, roadmap],
  );

  const recommendedTopic = useMemo(
    () => getRecommendedTopic(roadmap),
    [roadmap],
  );
  const reviewTopics = useMemo(() => getReviewTopics(roadmap), [roadmap]);

  return (
    <div>
      <WelcomeHeader />

      <div className="space-y-6">
        {!isHydrated ? (
          <>
            <QuickStatsSkeleton />
            <DashboardSkeleton />
          </>
        ) : (
          <>
            <QuickStats stats={stats} />

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Left column */}
              <div className="lg:col-span-3 space-y-6">
                <RecommendedTopic topic={recommendedTopic} />
                <DueForReview topics={reviewTopics} />
              </div>

              {/* Right column */}
              <div className="lg:col-span-2 space-y-6">
                <TodaysGoals />
                <QuickActions />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

