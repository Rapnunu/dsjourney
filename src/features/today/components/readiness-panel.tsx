"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { dashboardCard, DashboardScrollReveal } from "@/components/dashboard";
import {
  CATEGORY_BAR_COLORS,
  HorizontalBar,
  ProgressRing,
} from "@/components/dashboard/charts";
import type { SkillGap } from "@/features/readiness/data";

interface ReadinessPanelProps {
  readiness: number;
  skillGaps: SkillGap[];
}

function getReadinessLabel(score: number): string {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  if (score >= 40) return "Developing";
  if (score >= 20) return "Building";
  return "Starting";
}

export function ReadinessPanel({ readiness, skillGaps }: ReadinessPanelProps) {
  return (
    <DashboardScrollReveal delayMs={60}>
      <div className={`${dashboardCard} p-5`}>
        <h2 className="text-sm font-semibold text-text-primary">Readiness</h2>

        <div className="mt-5 flex flex-col items-center">
          <ProgressRing value={readiness} label={getReadinessLabel(readiness)} />
          <p className="mt-3 text-center text-xs text-text-muted">
            Internship Readiness — {readiness}%
          </p>
        </div>

        <div className="mt-6 border-t border-border-subtle pt-5">
          <h3 className="mb-4 text-xs font-medium uppercase tracking-wide text-text-muted">
            Top Skill Gaps
          </h3>
          <div className="space-y-3">
            {skillGaps.map((gap, index) => (
              <HorizontalBar
                key={gap.categoryName}
                label={gap.categoryName}
                value={gap.readiness}
                color={CATEGORY_BAR_COLORS[index % CATEGORY_BAR_COLORS.length]}
              />
            ))}
          </div>
          <Link
            href="/readiness"
            className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-brand-teal transition-colors hover:text-brand-teal/80 focus-ring rounded"
          >
            View Readiness
            <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </DashboardScrollReveal>
  );
}
