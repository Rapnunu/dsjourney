"use client";

import { useEffect, useState } from "react";
import type { CategoryHours } from "../data";

interface HoursByCategoryProps {
  categories: CategoryHours[];
}

const BAR_COLORS: Record<string, string> = {
  indigo: "bg-gradient-to-r from-indigo-500 to-indigo-400",
  sky: "bg-gradient-to-r from-sky-500 to-sky-400",
  violet: "bg-gradient-to-r from-violet-500 to-violet-400",
  rose: "bg-gradient-to-r from-rose-500 to-rose-400",
  emerald: "bg-gradient-to-r from-emerald-500 to-emerald-400",
  zinc: "bg-gradient-to-r from-zinc-500 to-zinc-400",
};

const TEXT_COLORS: Record<string, string> = {
  indigo: "text-indigo-400",
  sky: "text-sky-400",
  violet: "text-violet-400",
  rose: "text-rose-400",
  emerald: "text-emerald-400",
  zinc: "text-zinc-400",
};

export function HoursByCategory({ categories }: HoursByCategoryProps) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setAnimate(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const maxHours = Math.max(...categories.map((c) => c.hours), 1);

  return (
    <div className="rounded-xl border border-border-primary bg-bg-surface/50 p-5">
      <h3 className="text-sm font-semibold text-text-primary mb-5">
        Study Hours by Category
      </h3>

      <div className="space-y-4">
        {categories.map((cat) => {
          const barColor = BAR_COLORS[cat.color] ?? BAR_COLORS.zinc;
          const textColor = TEXT_COLORS[cat.color] ?? TEXT_COLORS.zinc;
          const widthPct = (cat.hours / maxHours) * 100;

          return (
            <div key={cat.category}>
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-sm font-medium ${textColor}`}>
                  {cat.category}
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-semibold tabular-nums text-text-primary">
                    {cat.hours}h
                  </span>
                  <span className="text-xs tabular-nums text-text-muted">
                    {cat.percentage}%
                  </span>
                </div>
              </div>

              {/* Horizontal bar */}
              <div className="h-3 rounded-full bg-bg-primary/80 overflow-hidden">
                <div
                  className={`h-full rounded-full ${barColor} transition-all duration-700 ease-out`}
                  style={{ width: animate ? `${widthPct}%` : "0%" }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
