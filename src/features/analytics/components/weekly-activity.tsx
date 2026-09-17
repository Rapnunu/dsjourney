"use client";

import { useEffect, useState } from "react";
import { getLocalDateString } from "@/lib/date-only";
import { dashboardCard } from "@/components/dashboard";
import type { DailyActivity } from "../data";

interface WeeklyActivityProps {
  days: DailyActivity[];
}

export function WeeklyActivity({ days }: WeeklyActivityProps) {
  const [animate, setAnimate] = useState(false);
  const todayDate = getLocalDateString();

  useEffect(() => {
    const id = requestAnimationFrame(() => setAnimate(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const maxHours = Math.max(...days.map((d) => d.hours), 1);
  const hasWeeklyActivity = days.some((d) => d.hours > 0);

  return (
    <div className={`${dashboardCard} p-5`}>
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text-primary">
          Weekly Activity
        </h3>
        <span className="text-xs text-text-muted">This week</span>
      </div>

      <div className="relative flex h-40 items-end gap-2">
        {!hasWeeklyActivity && (
          <div className="pointer-events-none absolute inset-x-0 top-1/2 z-10 -translate-y-1/2 px-2 text-center">
            <p className="text-sm text-text-secondary">
              No study activity this week.
            </p>
            <p className="mt-1 text-xs text-text-muted">
              Log a session to start seeing your weekly pattern.
            </p>
          </div>
        )}
        {days.map((day) => {
          const heightPct = maxHours > 0 ? (day.hours / maxHours) * 100 : 0;
          const isToday = day.date === todayDate;
          const hasActivity = day.hours > 0;

          return (
            <div key={day.day} className="flex flex-1 flex-col items-center gap-2">
              <span
                className={`text-xs font-medium tabular-nums transition-opacity duration-500 ${
                  animate && hasActivity ? "opacity-100" : "opacity-0"
                } ${isToday ? "text-brand-teal" : "text-text-secondary"}`}
              >
                {day.hours > 0 ? `${day.hours}h` : ""}
              </span>

              <div className="flex w-full flex-1 items-end">
                <div
                  className={`w-full rounded-t-md transition-all duration-700 ease-out ${
                    hasActivity
                      ? isToday
                        ? "bg-brand-teal"
                        : "bg-brand-blue/70"
                      : "bg-bg-elevated"
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

              <span
                className={`text-xs font-medium ${
                  isToday ? "text-brand-teal" : "text-text-muted"
                }`}
              >
                {day.day}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border-subtle pt-3">
        <span className="text-xs text-text-muted">
          {days.filter((d) => d.hours > 0).length} active days
        </span>
        <span className="text-xs font-medium tabular-nums text-text-secondary">
          {parseFloat(days.reduce((s, d) => s + d.hours, 0).toFixed(1))}h total
        </span>
      </div>
    </div>
  );
}
