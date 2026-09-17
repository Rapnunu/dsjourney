"use client";

import { useEffect, useState } from "react";
import { getLocalDateString } from "@/lib/date-only";
import { CHART_COLORS } from "@/components/dashboard/charts";
import type { DailyActivity } from "@/features/analytics/data";

interface CompactWeeklyActivityProps {
  days: DailyActivity[];
}

export function CompactWeeklyActivity({ days }: CompactWeeklyActivityProps) {
  const [animate, setAnimate] = useState(false);
  const todayDate = getLocalDateString();
  const maxHours = Math.max(...days.map((day) => day.hours), 1);
  const hasActivity = days.some((day) => day.hours > 0);

  useEffect(() => {
    const id = requestAnimationFrame(() => setAnimate(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div>
      <div
        className="flex h-24 items-end gap-1.5"
        role="img"
        aria-label={
          hasActivity
            ? "Weekly study activity chart"
            : "Weekly study activity chart with no hours logged this week"
        }
      >
        {days.map((day) => {
          const heightPct = maxHours > 0 ? (day.hours / maxHours) * 100 : 0;
          const isToday = day.date === todayDate;
          const active = day.hours > 0;

          return (
            <div
              key={day.date}
              className="flex flex-1 flex-col items-center gap-1.5"
            >
              <span
                className={`text-[10px] tabular-nums ${
                  hasActivity
                    ? active
                      ? "text-text-secondary"
                      : "text-transparent"
                    : "text-text-muted"
                }`}
              >
                {hasActivity ? (active ? `${day.hours}h` : "·") : `${day.hours}h`}
              </span>
              <div className="flex w-full flex-1 items-end">
                <div
                  className="w-full rounded-t-sm transition-all duration-700 ease-out"
                  style={{
                    height: animate
                      ? hasActivity
                        ? active
                          ? `${Math.max(heightPct, 10)}%`
                          : "8%"
                        : "12%"
                      : "0%",
                    backgroundColor: active
                      ? isToday
                        ? CHART_COLORS.teal
                        : `${CHART_COLORS.blue}B3`
                      : CHART_COLORS.track,
                  }}
                />
              </div>
              <span
                className={`text-[10px] font-medium ${
                  isToday ? "text-brand-teal" : "text-text-muted"
                }`}
              >
                {day.day}
              </span>
            </div>
          );
        })}
      </div>

      {!hasActivity && (
        <p className="mt-3 text-center text-xs text-text-muted">
          No study activity this week yet.
        </p>
      )}
    </div>
  );
}
