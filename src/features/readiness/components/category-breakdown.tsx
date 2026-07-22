"use client";

import { useEffect, useState } from "react";
import type { CategoryReadiness } from "../data";

interface CategoryBreakdownProps {
  categories: CategoryReadiness[];
}

const COLOR_MAP: Record<string, { bar: string; text: string; bg: string }> = {
  indigo: {
    bar: "bg-gradient-to-r from-indigo-500 to-indigo-400",
    text: "text-indigo-400",
    bg: "bg-indigo-500/10",
  },
  sky: {
    bar: "bg-gradient-to-r from-sky-500 to-sky-400",
    text: "text-sky-400",
    bg: "bg-sky-500/10",
  },
  violet: {
    bar: "bg-gradient-to-r from-violet-500 to-violet-400",
    text: "text-violet-400",
    bg: "bg-violet-500/10",
  },
  rose: {
    bar: "bg-gradient-to-r from-rose-500 to-rose-400",
    text: "text-rose-400",
    bg: "bg-rose-500/10",
  },
  emerald: {
    bar: "bg-gradient-to-r from-emerald-500 to-emerald-400",
    text: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  amber: {
    bar: "bg-gradient-to-r from-amber-500 to-amber-400",
    text: "text-amber-400",
    bg: "bg-amber-500/10",
  },
  zinc: {
    bar: "bg-gradient-to-r from-zinc-500 to-zinc-400",
    text: "text-zinc-400",
    bg: "bg-zinc-500/10",
  },
};

export function CategoryBreakdown({ categories }: CategoryBreakdownProps) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Trigger animation after mount
    const id = requestAnimationFrame(() => setAnimate(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className="rounded-xl border border-border-primary bg-bg-surface/50 p-5">
      <h3 className="text-sm font-semibold text-text-primary mb-5">
        Category Breakdown
      </h3>

      <div className="space-y-4">
        {categories.map((cat) => {
          const colors = COLOR_MAP[cat.color] ?? COLOR_MAP.zinc;

          return (
            <div key={cat.id}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium ${colors.text}`}>
                    {cat.name}
                  </span>
                  <span className="text-xs text-text-muted">
                    {cat.masteredCount}/{cat.topicCount} topics
                  </span>
                </div>
                <span className="text-sm font-semibold tabular-nums text-text-primary">
                  {cat.readiness}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="h-2 rounded-full bg-bg-primary/80 overflow-hidden">
                <div
                  className={`h-full rounded-full ${colors.bar} transition-all duration-700 ease-out`}
                  style={{ width: animate ? `${cat.readiness}%` : "0%" }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
