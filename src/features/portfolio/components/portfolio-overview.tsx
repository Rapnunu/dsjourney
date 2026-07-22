import { FolderKanban, CheckCircle2, Clock, Trophy } from "lucide-react";
import type { PortfolioStats } from "../data/projects";

interface PortfolioOverviewProps {
  stats: PortfolioStats;
}

const cards = [
  {
    key: "total" as const,
    label: "Total Projects",
    icon: FolderKanban,
    iconBg: "bg-accent-muted",
    iconColor: "text-accent",
    field: "totalProjects" as const,
  },
  {
    key: "completed" as const,
    label: "Completed",
    icon: CheckCircle2,
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-400",
    field: "completedProjects" as const,
  },
  {
    key: "inProgress" as const,
    label: "In Progress",
    icon: Clock,
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-400",
    field: "inProgressProjects" as const,
  },
  {
    key: "score" as const,
    label: "Portfolio Score",
    icon: Trophy,
    iconBg: "bg-violet-500/10",
    iconColor: "text-violet-400",
    field: "portfolioScore" as const,
    suffix: "%",
  },
] as const;

export function PortfolioOverview({ stats }: PortfolioOverviewProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map((card) => {
        const Icon = card.icon;
        const value = stats[card.field];
        return (
          <div
            key={card.key}
            className="rounded-xl border border-border-subtle bg-bg-surface/50 px-4 py-4 flex items-center gap-3"
          >
            <div
              className={`flex items-center justify-center h-10 w-10 rounded-xl ${card.iconBg} ${card.iconColor}`}
            >
              <Icon size={20} />
            </div>
            <div>
              <div className="flex items-baseline gap-1">
                <p className="text-2xl font-semibold tabular-nums text-text-primary">
                  {value}
                </p>
                {"suffix" in card && card.suffix && (
                  <span className="text-sm text-text-muted">{card.suffix}</span>
                )}
              </div>
              <p className="text-xs text-text-muted">{card.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
