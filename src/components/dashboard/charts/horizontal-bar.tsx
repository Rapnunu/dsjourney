"use client";

import { useEffect, useState } from "react";
import { CHART_COLORS } from "./chart-colors";

interface HorizontalBarProps {
  label: string;
  value: number;
  maxValue?: number;
  suffix?: string;
  color?: string;
  animate?: boolean;
  valueLabel?: string;
  className?: string;
}

export function HorizontalBar({
  label,
  value,
  maxValue = 100,
  suffix = "%",
  color = CHART_COLORS.teal,
  animate = true,
  valueLabel,
  className = "",
}: HorizontalBarProps) {
  const [ready, setReady] = useState(!animate);
  const pct = maxValue > 0 ? Math.min(100, (value / maxValue) * 100) : 0;
  const display = valueLabel ?? `${value}${suffix}`;

  useEffect(() => {
    if (!animate) return;
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, [animate]);

  const barWidth = ready ? pct : 0;

  return (
    <div className={className}>
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <span className="truncate text-sm text-text-primary">{label}</span>
        <span
          className="shrink-0 text-sm font-semibold tabular-nums text-text-primary"
          aria-label={`${label}: ${display}`}
        >
          {display}
        </span>
      </div>
      <div
        className="h-2 overflow-hidden rounded-full"
        style={{ backgroundColor: CHART_COLORS.track }}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={maxValue}
        aria-label={`${label} progress`}
      >
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${barWidth}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
}
