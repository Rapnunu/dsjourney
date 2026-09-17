"use client";

import { useEffect, useState } from "react";
import type { CategoryReadiness } from "../data";

interface CategoryBreakdownProps {
  categories: CategoryReadiness[];
}

const COLOR_MAP: Record<string, { bar: string; text: string }> = {
  indigo: { bar: "bg-brand-blue", text: "text-brand-blue" },
  sky: { bar: "bg-brand-teal", text: "text-brand-teal" },
  violet: { bar: "bg-brand-blue/75", text: "text-brand-blue" },
  rose: { bar: "bg-brand-teal/70", text: "text-brand-teal" },
  emerald: { bar: "bg-brand-blue/55", text: "text-brand-blue" },
  amber: { bar: "bg-brand-teal/55", text: "text-brand-teal" },
  zinc: { bar: "bg-text-muted", text: "text-text-secondary" },
};

export function CategoryBreakdown({ categories }: CategoryBreakdownProps) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setAnimate(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className="rounded-[10px] border border-border-subtle bg-bg-surface p-5">
      <h3 className="mb-5 text-sm font-semibold text-text-primary">
        Category Breakdown
      </h3>

      <div className="space-y-4">
        {categories.map((cat) => {
          const colors = COLOR_MAP[cat.color] ?? COLOR_MAP.zinc;

          return (
            <div key={cat.id}>
              <div className="mb-1.5 flex items-center justify-between">
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

              <div className="h-2 overflow-hidden rounded-full bg-bg-elevated">
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
