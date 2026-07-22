import { Clock, BookOpen, Flame, Signal } from "lucide-react";
import type { KpiStats } from "../data";

interface KpiCardsProps {
  stats: KpiStats;
}

const cards = [
  {
    key: "hours" as const,
    label: "Total Study Hours",
    icon: Clock,
    iconBg: "bg-accent-muted",
    iconColor: "text-accent",
    format: (v: number) => `${v}`,
    suffix: () => "hrs",
    field: "totalHours" as const,
  },
  {
    key: "sessions" as const,
    label: "Total Sessions",
    icon: BookOpen,
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-400",
    format: (v: number) => `${v}`,
    field: "totalSessions" as const,
  },
  {
    key: "streak" as const,
    label: "Current Streak",
    icon: Flame,
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-400",
    format: (v: number) => `${v}`,
    suffix: (v: number) => (v === 1 ? "day" : "days"),
    field: "currentStreak" as const,
  },
  {
    key: "difficulty" as const,
    label: "Avg Difficulty",
    icon: Signal,
    iconBg: "bg-rose-500/10",
    iconColor: "text-rose-400",
    format: (v: number) => `${v}`,
    suffix: () => "/ 5",
    field: "avgDifficulty" as const,
  },
] as const;

export function KpiCards({ stats }: KpiCardsProps) {
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
                  {card.format(value)}
                </p>
                {"suffix" in card && card.suffix && (
                  <span className="text-sm text-text-muted">
                    {card.suffix(value)}
                  </span>
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
