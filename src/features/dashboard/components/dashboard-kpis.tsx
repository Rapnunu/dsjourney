import { Gauge, Flame, Clock, Target } from "lucide-react";
import { MetricCard } from "@/components/dashboard";

interface DashboardKpisProps {
  roadmapProgress: number;
  hoursThisWeek: number;
  studyStreak: number;
  internshipReadiness: number;
}

export function DashboardKpis({
  roadmapProgress,
  hoursThisWeek,
  studyStreak,
  internshipReadiness,
}: DashboardKpisProps) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <MetricCard
        label="Roadmap Progress"
        countTo={roadmapProgress}
        countSuffix="%"
        icon={Gauge}
      />
      <MetricCard
        label="This Week"
        countTo={hoursThisWeek}
        decimals={1}
        suffix="hrs"
        icon={Clock}
      />
      <MetricCard
        label="Study Streak"
        countTo={studyStreak}
        suffix={studyStreak === 1 ? "day" : "days"}
        icon={Flame}
      />
      <MetricCard
        label="Internship Readiness"
        countTo={internshipReadiness}
        countSuffix="%"
        icon={Target}
      />
    </div>
  );
}
