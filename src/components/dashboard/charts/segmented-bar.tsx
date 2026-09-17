"use client";

import { useState } from "react";
import { CHART_COLORS } from "./chart-colors";
import { ChartTooltip } from "./chart-tooltip";

export interface SegmentData {
  id: string;
  label: string;
  count: number;
  percentage: number;
  color: string;
}

interface SegmentedBarProps {
  segments: SegmentData[];
  totalLabel?: string;
  ariaLabel: string;
}

export function SegmentedBar({ segments, totalLabel, ariaLabel }: SegmentedBarProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const total = segments.reduce((sum, s) => sum + s.count, 0);
  const active = segments.find((s) => s.id === activeId);

  return (
    <div className="relative">
      <div
        className="flex h-3 overflow-hidden rounded-full"
        style={{ backgroundColor: CHART_COLORS.track }}
        role="img"
        aria-label={ariaLabel}
      >
        {segments.map((segment) => {
          if (segment.count === 0) return null;
          const widthPct = total > 0 ? (segment.count / total) * 100 : 0;

          return (
            <button
              key={segment.id}
              type="button"
              className="h-full transition-opacity hover:opacity-90 focus-ring"
              style={{
                width: `${widthPct}%`,
                backgroundColor: segment.color,
                minWidth: widthPct > 0 ? "4px" : undefined,
              }}
              onMouseEnter={() => setActiveId(segment.id)}
              onMouseLeave={() => setActiveId(null)}
              onFocus={() => setActiveId(segment.id)}
              onBlur={() => setActiveId(null)}
              aria-label={`${segment.label}: ${segment.count} of ${total} topics, ${segment.percentage.toFixed(1)}%`}
            />
          );
        })}
      </div>

      {active && (
        <div className="absolute left-1/2 top-full z-20 mt-2 -translate-x-1/2">
          <ChartTooltip
            title={active.label}
            lines={[
              `${active.count} of ${total} topics`,
              `${active.percentage.toFixed(1)}%`,
            ]}
          />
        </div>
      )}

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
        {segments.map((segment) => (
          <div key={segment.id} className="flex items-center gap-2 text-xs">
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: segment.color }}
              aria-hidden="true"
            />
            <span className="text-text-secondary">{segment.label}</span>
            <span className="tabular-nums text-text-muted">{segment.count}</span>
          </div>
        ))}
      </div>

      {totalLabel && (
        <p className="mt-2 text-xs text-text-muted">{totalLabel}</p>
      )}
    </div>
  );
}
