import { Gauge, Flame, Clock, BookOpen } from "lucide-react";
import { MetricCard } from "@/components/dashboard";
import type { DashboardStats } from "../data";

interface QuickStatsProps {
  stats: DashboardStats;
}

export function QuickStats({ stats }: QuickStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <MetricCard
        label="Overall Readiness"
        countTo={stats.overallReadiness}
        countSuffix="%"
        icon={Gauge}
      />
      <MetricCard
        label="Study Streak"
        countTo={stats.studyStreak}
        suffix={stats.studyStreak === 1 ? "day" : "days"}
        icon={Flame}
      />
      <MetricCard
        label="Hours This Week"
        countTo={stats.hoursThisWeek}
        decimals={1}
        suffix="hrs"
        icon={Clock}
      />
      <MetricCard
        label="Total Sessions"
        countTo={stats.totalSessions}
        icon={BookOpen}
      />
    </div>
  );
}
