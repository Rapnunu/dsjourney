import { AlertTriangle, Clock, BookOpen } from "lucide-react";
import type { SkillGap } from "../data";

interface SkillGapsProps {
  gaps: SkillGap[];
}

const SEVERITY_COLORS: Record<number, { bg: string; border: string; icon: string }> = {
  0: { bg: "bg-brand-blue/5", border: "border-brand-blue/20", icon: "text-brand-blue" },
  1: { bg: "bg-brand-teal/5", border: "border-brand-teal/20", icon: "text-brand-teal" },
  2: { bg: "bg-bg-elevated", border: "border-border-subtle", icon: "text-text-muted" },
};

export function SkillGaps({ gaps }: SkillGapsProps) {
  return (
    <div className="rounded-[10px] border border-border-subtle bg-bg-surface p-5">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle size={16} className="text-brand-teal" />
        <h3 className="text-sm font-semibold text-text-primary">
          Top Skill Gaps
        </h3>
      </div>

      <div className="space-y-3">
        {gaps.map((gap, i) => {
          const severity = SEVERITY_COLORS[i] ?? SEVERITY_COLORS[2];

          return (
            <div
              key={gap.categoryName}
              className={`rounded-lg border ${severity.border} ${severity.bg} px-4 py-3`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-text-primary">
                  {gap.categoryName}
                </span>
                <span className="text-xs font-semibold tabular-nums text-text-muted">
                  {gap.readiness}%
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs text-text-secondary">
                <span className="inline-flex items-center gap-1">
                  <BookOpen size={12} className={severity.icon} />
                  {gap.topicsRemaining} topics left
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock size={12} className={severity.icon} />
                  ~{gap.hoursRemaining}h to master
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
