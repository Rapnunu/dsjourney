"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DashboardScrollReveal, SectionCard } from "@/components/dashboard";
import {
  CATEGORY_BAR_COLORS,
  HorizontalBar,
  ProgressRing,
} from "@/components/dashboard/charts";
import type { SkillGap } from "@/features/readiness/data";

interface ReadinessSnapshotProps {
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

export function ReadinessSnapshot({
  readiness,
  skillGaps,
}: ReadinessSnapshotProps) {
  return (
    <DashboardScrollReveal delayMs={60}>
      <SectionCard
        title="Internship Readiness"
        action={
          <Link
            href="/readiness"
            className="text-xs font-medium text-brand-teal hover:text-brand-teal/80"
          >
            View Readiness
          </Link>
        }
      >
        <div className="flex flex-col items-center py-2">
          <ProgressRing
            value={readiness}
            label={getReadinessLabel(readiness)}
            size={128}
            strokeWidth={6}
          />
        </div>

        <div className="mt-4 border-t border-border-subtle pt-4">
          <h3 className="mb-3 text-xs font-medium uppercase tracking-wide text-text-muted">
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
        </div>

        <Link
          href="/readiness"
          className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-text-muted transition-colors hover:text-text-secondary"
        >
          View Readiness
          <ArrowRight size={12} />
        </Link>
      </SectionCard>
    </DashboardScrollReveal>
  );
}
