import { FolderKanban, CheckCircle2, Clock, Trophy } from "lucide-react";
import { MetricCard } from "@/components/dashboard";
import type { PortfolioStats } from "../data/projects";

interface PortfolioOverviewProps {
  stats: PortfolioStats;
}

export function PortfolioOverview({ stats }: PortfolioOverviewProps) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <MetricCard
        label="Projects"
        countTo={stats.totalProjects}
        icon={FolderKanban}
        staggerIndex={0}
      />
      <MetricCard
        label="Completed"
        countTo={stats.completedProjects}
        icon={CheckCircle2}
        staggerIndex={1}
      />
      <MetricCard
        label="In Progress"
        countTo={stats.inProgressProjects}
        icon={Clock}
        staggerIndex={2}
      />
      <MetricCard
        label="Portfolio Strength"
        countTo={stats.portfolioScore}
        countSuffix="%"
        icon={Trophy}
        staggerIndex={3}
      />
    </div>
  );
}
