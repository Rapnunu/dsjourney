"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import CountUp from "@/components/react-bits/CountUp";
import { DashboardScrollReveal, SectionCard } from "@/components/dashboard";
import type { DailyActivity, KpiStats } from "@/features/analytics/data";
import { CompactWeeklyActivity } from "./compact-weekly-activity";

interface StudyOverviewProps {
  kpiStats: KpiStats;
  hoursThisWeek: number;
  sessionsThisWeek: number;
  weeklyActivity: DailyActivity[];
}

function StatItem({
  label,
  value,
  suffix = "",
  decimals = 0,
}: {
  label: string;
  value: number;
  suffix?: string;
  decimals?: number;
}) {
  return (
    <div className="rounded-lg border border-border-subtle bg-bg-elevated px-3 py-2.5">
      <p className="text-[10px] uppercase tracking-wide text-text-muted">{label}</p>
      <p className="mt-1 text-lg font-semibold tabular-nums text-text-primary">
        <CountUp to={value} decimals={decimals} suffix={suffix} duration={0.8} />
      </p>
    </div>
  );
}

export function StudyOverview({
  kpiStats,
  hoursThisWeek,
  sessionsThisWeek,
  weeklyActivity,
}: StudyOverviewProps) {
  return (
    <DashboardScrollReveal>
      <SectionCard
        title="Study Overview"
        action={
          <Link
            href="/analytics"
            className="text-xs font-medium text-brand-teal hover:text-brand-teal/80"
          >
            View Analytics
          </Link>
        }
      >
        <div className="mb-5 grid grid-cols-2 gap-2 lg:grid-cols-4">
          <StatItem
            label="Hours This Week"
            value={hoursThisWeek}
            decimals={1}
            suffix="h"
          />
          <StatItem label="Sessions This Week" value={sessionsThisWeek} />
          <StatItem
            label="Current Streak"
            value={kpiStats.currentStreak}
            suffix={kpiStats.currentStreak === 1 ? " day" : " days"}
          />
          <StatItem
            label="Avg Difficulty"
            value={kpiStats.avgDifficulty}
            decimals={1}
            suffix="/5"
          />
        </div>

        <CompactWeeklyActivity days={weeklyActivity} />

        <Link
          href="/analytics"
          className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-text-muted transition-colors hover:text-text-secondary"
        >
          View Analytics
          <ArrowRight size={12} />
        </Link>
      </SectionCard>
    </DashboardScrollReveal>
  );
}
