"use client";

import { useEffect, useState } from "react";
import type { ProgressComparison } from "../data";

interface ProgressVsTimeProps {
  data: ProgressComparison[];
}

const TEXT_COLORS: Record<string, string> = {
  indigo: "text-brand-blue",
  sky: "text-brand-teal",
  violet: "text-brand-blue",
  rose: "text-brand-teal",
  emerald: "text-brand-blue",
  zinc: "text-text-secondary",
};

const BAR_COLORS: Record<string, string> = {
  indigo: "bg-brand-blue/50",
  sky: "bg-brand-teal/50",
  violet: "bg-brand-blue/40",
  rose: "bg-brand-teal/40",
  emerald: "bg-brand-blue/35",
  zinc: "bg-text-muted/50",
};

const BAR_PROGRESS_COLORS: Record<string, string> = {
  indigo: "bg-brand-blue",
  sky: "bg-brand-teal",
  violet: "bg-brand-blue/80",
  rose: "bg-brand-teal/80",
  emerald: "bg-brand-blue/65",
  zinc: "bg-text-muted",
};

export function ProgressVsTime({ data }: ProgressVsTimeProps) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setAnimate(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const maxHours = Math.max(...data.map((d) => d.hoursStudied), 1);

  return (
    <div className="rounded-[10px] border border-border-subtle bg-bg-surface p-5">
      <h3 className="mb-5 text-sm font-semibold text-text-primary">
        Progress vs Time
      </h3>

      <div className="space-y-5">
        {data.map((item) => {
          const textColor = TEXT_COLORS[item.color] ?? TEXT_COLORS.zinc;
          const barBg = BAR_COLORS[item.color] ?? BAR_COLORS.zinc;
          const barFill = BAR_PROGRESS_COLORS[item.color] ?? BAR_PROGRESS_COLORS.zinc;
          const hoursWidth = (item.hoursStudied / maxHours) * 100;

          return (
            <div key={item.category}>
              <div className="mb-2 flex items-center justify-between">
                <span className={`text-sm font-medium ${textColor}`}>
                  {item.category}
                </span>
                <div className="flex items-center gap-3 text-xs tabular-nums">
                  <span className="text-text-secondary">
                    {item.hoursStudied}h studied
                  </span>
                  <span className="font-semibold text-text-primary">
                    {item.roadmapProgress}% mastery
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="h-2 overflow-hidden rounded-full bg-bg-elevated">
                  <div
                    className={`h-full rounded-full ${barBg} transition-all duration-700 ease-out`}
                    style={{
                      width: animate ? `${hoursWidth}%` : "0%",
                    }}
                  />
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-bg-elevated">
                  <div
                    className={`h-full rounded-full ${barFill} transition-all duration-700 ease-out`}
                    style={{
                      width: animate ? `${item.roadmapProgress}%` : "0%",
                    }}
                  />
                </div>
              </div>

              <div className="mt-1 flex justify-between text-[10px] text-text-muted">
                <span>Hours</span>
                <span>Roadmap progress</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
