"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  dashboardProgressFill,
  dashboardProgressTrack,
  DashboardScrollReveal,
  SectionCard,
} from "@/components/dashboard";
import {
  CATEGORY_BAR_COLORS,
  HorizontalBar,
  MASTERY_CHART_COLORS,
  SegmentedBar,
} from "@/components/dashboard/charts";
import type { CategoryReadiness } from "@/features/readiness/data";
import type { MasteryDistributionSegment } from "@/features/today/data";

interface JourneyOverviewProps {
  mastery: MasteryDistributionSegment[];
  categories: CategoryReadiness[];
  roadmapProgress: number;
}

const MASTERY_DISPLAY_ORDER = [
  "mastered",
  "practiced",
  "learning",
  "not_started",
] as const;

export function JourneyOverview({
  mastery,
  categories,
  roadmapProgress,
}: JourneyOverviewProps) {
  const totalTopics = mastery.reduce((sum, segment) => sum + segment.count, 0);
  const masteryByLevel = new Map(mastery.map((segment) => [segment.level, segment]));

  const masterySegments = mastery.map((segment) => ({
    id: segment.level,
    label: segment.label,
    count: segment.count,
    percentage: segment.percentage,
    color: MASTERY_CHART_COLORS[segment.level],
  }));

  const roadmapCategories = categories.filter(
    (category) => category.id !== "projects",
  );

  return (
    <DashboardScrollReveal>
      <SectionCard
        title="Your Journey"
        action={
          <Link
            href="/roadmap"
            className="text-xs font-medium text-brand-teal hover:text-brand-teal/80"
          >
            View Roadmap
          </Link>
        }
      >
        <p className="mb-4 text-sm text-text-secondary">
          {totalTopics} total topics across your learning roadmap.
        </p>

        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="text-text-muted">Overall roadmap progress</span>
          <span className="font-semibold tabular-nums text-text-primary">
            {roadmapProgress}%
          </span>
        </div>
        <div className={`${dashboardProgressTrack} mb-6`}>
          <div
            className={dashboardProgressFill}
            style={{ width: `${roadmapProgress}%` }}
            role="progressbar"
            aria-valuenow={roadmapProgress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Overall roadmap progress"
          />
        </div>

        <SegmentedBar
          segments={masterySegments}
          ariaLabel={`Roadmap mastery distribution across ${totalTopics} topics`}
        />

        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {MASTERY_DISPLAY_ORDER.map((level) => {
            const segment = masteryByLevel.get(level);
            return (
              <div
                key={level}
                className="rounded-lg border border-border-subtle bg-bg-elevated px-3 py-2"
              >
                <p className="text-[10px] uppercase tracking-wide text-text-muted">
                  {segment?.label ?? level}
                </p>
                <p className="mt-0.5 text-lg font-semibold tabular-nums text-text-primary">
                  {segment?.count ?? 0}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-6 border-t border-border-subtle pt-5">
          <h3 className="mb-3 text-xs font-medium uppercase tracking-wide text-text-muted">
            Category Progress
          </h3>
          <div className="space-y-3">
            {roadmapCategories.map((category, index) => (
              <HorizontalBar
                key={category.id}
                label={category.name}
                value={category.readiness}
                color={CATEGORY_BAR_COLORS[index % CATEGORY_BAR_COLORS.length]}
              />
            ))}
          </div>
        </div>

        <Link
          href="/roadmap"
          className="mt-5 inline-flex items-center gap-1 text-xs font-medium text-text-muted transition-colors hover:text-text-secondary"
        >
          View Roadmap
          <ArrowRight size={12} />
        </Link>
      </SectionCard>
    </DashboardScrollReveal>
  );
}
