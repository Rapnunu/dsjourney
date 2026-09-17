"use client";

import type { ReactNode } from "react";
import { CHART_COLORS } from "./chart-colors";

interface ChartTooltipProps {
  title: string;
  lines: ReactNode[];
  className?: string;
}

export function ChartTooltip({ title, lines, className = "" }: ChartTooltipProps) {
  return (
    <div
      className={`pointer-events-none z-20 rounded-lg border px-3 py-2 text-xs shadow-none ${className}`}
      style={{
        backgroundColor: CHART_COLORS.tooltipBg,
        borderColor: CHART_COLORS.tooltipBorder,
        color: CHART_COLORS.tooltipText,
      }}
      role="tooltip"
    >
      <p className="font-medium">{title}</p>
      {lines.map((line, i) => (
        <p
          key={i}
          className="mt-0.5"
          style={{ color: CHART_COLORS.tooltipSecondary }}
        >
          {line}
        </p>
      ))}
    </div>
  );
}
