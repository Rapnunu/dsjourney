"use client";

import { useEffect, useState } from "react";
import type { DailyActivity } from "../data";

interface WeeklyActivityProps {
  days: DailyActivity[];
}

export function WeeklyActivity({ days }: WeeklyActivityProps) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setAnimate(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const maxHours = Math.max(...days.map((d) => d.hours), 1);

  // Mock "today" = 2026-07-22, which is a Tuesday (index 2 in our Mon-based array)
  // Actually the session data shows 2026-07-20 = Monday, 2026-07-21 = Tuesday, 2026-07-22 = Wednesday
  const todayDate = "2026-07-22";

  return (
    <div className="rounded-xl border border-border-primary bg-bg-surface/50 p-5">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-semibold text-text-primary">
          Weekly Activity
        </h3>
        <span className="text-xs text-text-muted">This week</span>
      </div>

      {/* Bar chart */}
      <div className="flex items-end gap-2 h-40">
        {days.map((day) => {
          const heightPct = maxHours > 0 ? (day.hours / maxHours) * 100 : 0;
          const isToday = day.date === todayDate;
          const hasActivity = day.hours > 0;

          return (
            <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
              {/* Hours label */}
              <span
                className={`text-xs tabular-nums font-medium transition-opacity duration-500 ${
                  animate && hasActivity ? "opacity-100" : "opacity-0"
                } ${isToday ? "text-accent" : "text-text-secondary"}`}
              >
                {day.hours > 0 ? `${day.hours}h` : ""}
              </span>

              {/* Bar container */}
              <div className="w-full flex-1 flex items-end">
                <div
                  className={`w-full rounded-t-md transition-all duration-700 ease-out ${
                    hasActivity
                      ? isToday
                        ? "bg-gradient-to-t from-accent to-purple-400"
                        : "bg-gradient-to-t from-indigo-600/60 to-indigo-400/40"
                      : "bg-border-subtle/50"
                  }`}
                  style={{
                    height: animate
                      ? hasActivity
                        ? `${Math.max(heightPct, 8)}%`
                        : "6%"
                      : "0%",
                  }}
                />
              </div>

              {/* Day label */}
              <span
                className={`text-xs font-medium ${
                  isToday ? "text-accent" : "text-text-muted"
                }`}
              >
                {day.day}
              </span>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-4 pt-3 border-t border-border-subtle flex items-center justify-between">
        <span className="text-xs text-text-muted">
          {days.filter((d) => d.hours > 0).length} active days
        </span>
        <span className="text-xs text-text-secondary font-medium tabular-nums">
          {parseFloat(days.reduce((s, d) => s + d.hours, 0).toFixed(1))}h total
        </span>
      </div>
    </div>
  );
}
