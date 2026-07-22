"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { mockGoals } from "../data";
import type { TodayGoal } from "../data";

export function TodaysGoals() {
  const [goals, setGoals] = useState<TodayGoal[]>(() =>
    JSON.parse(JSON.stringify(mockGoals))
  );

  const toggleGoal = (id: string) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, completed: !g.completed } : g))
    );
  };

  const completed = goals.filter((g) => g.completed).length;
  const total = goals.length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="rounded-xl border border-border-primary bg-bg-surface/50 p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-text-primary">Today&apos;s Goals</h3>
        <span className="text-xs text-text-muted tabular-nums">
          {completed}/{total}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 rounded-full bg-bg-surface overflow-hidden mb-4">
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Goal list */}
      <div className="space-y-2">
        {goals.map((goal) => (
          <button
            key={goal.id}
            onClick={() => toggleGoal(goal.id)}
            className="w-full flex items-center gap-3 py-1.5 group cursor-pointer text-left"
          >
            {/* Checkbox */}
            <div
              className={`flex-shrink-0 h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all duration-150 ${
                goal.completed
                  ? "bg-accent border-accent"
                  : "border-zinc-600 group-hover:border-zinc-400"
              }`}
            >
              {goal.completed && <Check size={12} className="text-white" strokeWidth={3} />}
            </div>

            {/* Label */}
            <span
              className={`text-sm transition-colors duration-150 ${
                goal.completed
                  ? "text-text-muted line-through"
                  : "text-text-primary group-hover:text-text-primary"
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
