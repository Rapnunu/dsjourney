"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import {
  dashboardCard,
  dashboardProgressFill,
  dashboardProgressTrack,
} from "@/components/dashboard";
import { mockGoals } from "../data";
import type { TodayGoal } from "../data";

export function TodaysGoals() {
  const [goals, setGoals] = useState<TodayGoal[]>(() =>
    JSON.parse(JSON.stringify(mockGoals)),
  );

  const toggleGoal = (id: string) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, completed: !g.completed } : g)),
    );
  };

  const completed = goals.filter((g) => g.completed).length;
  const total = goals.length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className={`${dashboardCard} p-5`}>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text-primary">
          Today&apos;s Plan
        </h3>
        <span className="text-xs tabular-nums text-text-muted">
          {completed}/{total} complete
        </span>
      </div>

      <div className={`${dashboardProgressTrack} mb-4`}>
        <div
          className={dashboardProgressFill}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="space-y-1">
        {goals.map((goal) => (
          <button
            key={goal.id}
            type="button"
            onClick={() => toggleGoal(goal.id)}
            className="group flex w-full cursor-pointer items-center gap-3 py-1.5 text-left"
          >
            <div
              className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded border transition-colors duration-150 ${
                goal.completed
                  ? "border-brand-teal bg-brand-teal"
                  : "border-border-strong group-hover:border-text-muted"
              }`}
            >
              {goal.completed && (
                <Check size={11} className="text-[#071016]" strokeWidth={3} />
              )}
            </div>
            <span
              className={`text-sm transition-colors duration-150 ${
                goal.completed
                  ? "text-text-muted line-through"
                  : "text-text-primary"
              }`}
            >
              {goal.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
