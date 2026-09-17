"use client";

import { dashboardCard, DashboardScrollReveal } from "@/components/dashboard";
import {
  CATEGORY_BAR_COLORS,
  HorizontalBar,
  MASTERY_CHART_COLORS,
  SegmentedBar,
} from "@/components/dashboard/charts";
import type { ProgressComparison } from "@/features/analytics/data";
import type { CategoryReadiness } from "@/features/readiness/data";
import type { MasteryDistributionSegment } from "../data";

interface YourJourneyPanelProps {
  mastery: MasteryDistributionSegment[];
  categories: CategoryReadiness[];
  effortVsProgress: ProgressComparison[];
}

export function YourJourneyPanel({
  mastery,
  categories,
  effortVsProgress,
}: YourJourneyPanelProps) {
  const totalTopics = mastery.reduce((sum, segment) => sum + segment.count, 0);

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
      <div className={`${dashboardCard} p-5`}>
        <h2 className="text-sm font-semibold text-text-primary">Your Journey</h2>

        <div className="mt-5">
          <h3 className="mb-3 text-xs font-medium uppercase tracking-wide text-text-muted">
            Roadmap Mastery
          </h3>
          <SegmentedBar
            segments={masterySegments}
            totalLabel={`${totalTopics} topics total`}
            ariaLabel={`Roadmap mastery distribution across ${totalTopics} topics`}
          />
        </div>

        <div className="mt-6">
          <h3 className="mb-4 text-xs font-medium uppercase tracking-wide text-text-muted">
            Progress by Skill Area
          </h3>
          <div className="space-y-4">
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

        {effortVsProgress.length > 0 && (
          <div className="mt-6 border-t border-border-subtle pt-6">
            <h3 className="mb-4 text-xs font-medium uppercase tracking-wide text-text-muted">
              Effort vs Progress
            </h3>
            <div className="space-y-4">
              {effortVsProgress.map((item, index) => {
                const maxHours = Math.max(
                  ...effortVsProgress.map((row) => row.hoursStudied),
                  1,
                );
                const hoursPct = (item.hoursStudied / maxHours) * 100;

                return (
                  <div key={item.category}>
                    <div className="mb-1.5 flex items-center justify-between gap-3">
                      <span className="truncate text-sm text-text-primary">
                        {item.category}
                      </span>
                      <span className="shrink-0 text-xs tabular-nums text-text-secondary">
                        {item.hoursStudied}h · {item.roadmapProgress}%
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div
                        className="h-1 overflow-hidden rounded-full"
                        style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
                        aria-label={`${item.category} hours studied: ${item.hoursStudied}`}
                      >
                        <div
                          className="h-full rounded-full transition-all duration-700 ease-out"
                          style={{
                            width: `${hoursPct}%`,
                            backgroundColor:
                              CATEGORY_BAR_COLORS[index % CATEGORY_BAR_COLORS.length],
                            opacity: 0.7,
                          }}
                        />
                      </div>
                      <div
                        className="h-1 overflow-hidden rounded-full"
                        style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
                        aria-label={`${item.category} roadmap progress: ${item.roadmapProgress}%`}
                      >
                        <div
                          className="h-full rounded-full transition-all duration-700 ease-out"
                          style={{
                            width: `${item.roadmapProgress}%`,
                            backgroundColor:
                              CATEGORY_BAR_COLORS[index % CATEGORY_BAR_COLORS.length],
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="mt-3 text-[10px] text-text-muted">
              Top bar: hours studied · Bottom bar: roadmap progress
            </p>
          </div>
        )}
      </div>
    </DashboardScrollReveal>
  );
}
