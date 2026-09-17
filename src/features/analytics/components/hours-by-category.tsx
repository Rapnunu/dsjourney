"use client";

import { useEffect, useState } from "react";
import { dashboardCard } from "@/components/dashboard";
import type { CategoryHours } from "../data";

interface HoursByCategoryProps {
  categories: CategoryHours[];
}

/** Teal/blue-forward palette — categories stay distinct without rainbow saturation. */
const BAR_COLORS: Record<string, string> = {
  indigo: "bg-brand-blue",
  sky: "bg-brand-teal",
  violet: "bg-brand-blue/75",
  rose: "bg-brand-teal/70",
  emerald: "bg-brand-blue/55",
  zinc: "bg-text-muted",
};

const TEXT_COLORS: Record<string, string> = {
  indigo: "text-brand-blue",
  sky: "text-brand-teal",
  violet: "text-brand-blue",
  rose: "text-brand-teal",
  emerald: "text-brand-blue",
  zinc: "text-text-secondary",
};

export function HoursByCategory({ categories }: HoursByCategoryProps) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setAnimate(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const maxHours = Math.max(...categories.map((c) => c.hours), 1);

  return (
    <div className={`${dashboardCard} p-5`}>
      <h3 className="mb-5 text-sm font-semibold text-text-primary">
        Study Hours by Category
      </h3>

      <div className="space-y-4">
        {categories.map((cat) => {
          const barColor = BAR_COLORS[cat.color] ?? BAR_COLORS.zinc;
          const textColor = TEXT_COLORS[cat.color] ?? TEXT_COLORS.zinc;
          const widthPct = (cat.hours / maxHours) * 100;

          return (
            <div key={cat.category}>
              <div className="mb-1.5 flex items-center justify-between">
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

              <div className="h-2.5 overflow-hidden rounded-full bg-bg-elevated">
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
