import { Clock, BookOpen, Flame, Signal } from "lucide-react";
import { MetricCard } from "@/components/dashboard";
import type { KpiStats } from "../data";

interface KpiCardsProps {
  stats: KpiStats;
}

export function KpiCards({ stats }: KpiCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <MetricCard
        label="Study Hours"
        countTo={stats.totalHours}
        decimals={1}
        suffix="hrs"
        icon={Clock}
        staggerIndex={0}
      />
      <MetricCard
        label="Sessions"
        countTo={stats.totalSessions}
        icon={BookOpen}
        staggerIndex={1}
      />
      <MetricCard
        label="Study Streak"
        countTo={stats.currentStreak}
        suffix={stats.currentStreak === 1 ? "day" : "days"}
        icon={Flame}
        staggerIndex={2}
      />
      <MetricCard
        label="Average Difficulty"
        countTo={stats.avgDifficulty}
        decimals={1}
        suffix="/ 5"
        icon={Signal}
        staggerIndex={3}
      />
    </div>
  );
}
