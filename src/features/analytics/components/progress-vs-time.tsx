"use client";

import { useEffect, useState } from "react";
import type { ProgressComparison } from "../data";

interface ProgressVsTimeProps {
  data: ProgressComparison[];
}

const TEXT_COLORS: Record<string, string> = {
  indigo: "text-indigo-400",
  sky: "text-sky-400",
  violet: "text-violet-400",
  rose: "text-rose-400",
  emerald: "text-emerald-400",
  zinc: "text-zinc-400",
};

const BAR_COLORS: Record<string, string> = {
  indigo: "bg-indigo-500/60",
  sky: "bg-sky-500/60",
  violet: "bg-violet-500/60",
  rose: "bg-rose-500/60",
  emerald: "bg-emerald-500/60",
  zinc: "bg-zinc-500/60",
};

const BAR_PROGRESS_COLORS: Record<string, string> = {
  indigo: "bg-indigo-400",
  sky: "bg-sky-400",
  violet: "bg-violet-400",
  rose: "bg-rose-400",
  emerald: "bg-emerald-400",
  zinc: "bg-zinc-400",
};

export function ProgressVsTime({ data }: ProgressVsTimeProps) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setAnimate(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const maxHours = Math.max(...data.map((d) => d.hoursStudied), 1);

  return (
    <div className="rounded-xl border border-border-primary bg-bg-surface/50 p-5">
      <h3 className="text-sm font-semibold text-text-primary mb-5">
        Progress vs Time Invested
      </h3>

      {/* Table with inline bars */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border-subtle">
              <th className="text-left py-2 pr-4 text-xs font-medium text-text-muted w-[140px]">
                Category
              </th>
              <th className="text-left py-2 pr-4 text-xs font-medium text-text-muted">
                Hours Studied
              </th>
              <th className="text-left py-2 text-xs font-medium text-text-muted">
                Roadmap Progress
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => {
              const textColor = TEXT_COLORS[row.color] ?? TEXT_COLORS.zinc;
              const barBg = BAR_COLORS[row.color] ?? BAR_COLORS.zinc;
              const barFill = BAR_PROGRESS_COLORS[row.color] ?? BAR_PROGRESS_COLORS.zinc;
              const hoursWidthPct = (row.hoursStudied / maxHours) * 100;

              return (
                <tr
                  key={row.category}
                  className="border-b border-border-subtle/50 last:border-b-0"
                >
                  <td className={`py-3 pr-4 font-medium ${textColor}`}>
                    {row.category}
                  </td>

                  {/* Hours bar */}
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 rounded-full bg-bg-primary/80 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${barBg} transition-all duration-700 ease-out`}
                          style={{ width: animate ? `${hoursWidthPct}%` : "0%" }}
                        />
                      </div>
                      <span className="text-xs tabular-nums text-text-secondary font-medium w-8 text-right">
                        {row.hoursStudied}h
                      </span>
                    </div>
                  </td>

                  {/* Progress bar */}
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 rounded-full bg-bg-primary/80 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${barFill} transition-all duration-700 ease-out`}
                          style={{ width: animate ? `${row.roadmapProgress}%` : "0%" }}
                        />
                      </div>
                      <span className="text-xs tabular-nums text-text-secondary font-medium w-10 text-right">
                        {row.roadmapProgress}%
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
