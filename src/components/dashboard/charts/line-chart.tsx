"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { parseLocalDateString } from "@/lib/date-only";
import { CHART_COLORS } from "./chart-colors";
import { ChartTooltip } from "./chart-tooltip";

export interface LineChartPoint {
  label: string;
  date: string;
  hours: number;
  sessionCount?: number;
}

interface LineChartProps {
  data: LineChartPoint[];
  height?: number;
  emptyMessage?: string;
  emptyDescription?: string;
  emptyAction?: ReactNode;
}

function formatTooltipDate(dateStr: string): string {
  return parseLocalDateString(dateStr).toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

export function LineChart({
  data,
  height = 200,
  emptyMessage,
  emptyDescription,
  emptyAction,
}: LineChartProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const hasActivity = data.some((d) => d.hours > 0);

  const layout = useMemo(() => {
    const padding = { top: 12, right: 8, bottom: 28, left: 36 };
    const width = 100;
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;
    const maxHours = Math.max(...data.map((d) => d.hours), 1);

    const yTicks = [0, maxHours / 2, maxHours].map((v) =>
      parseFloat(v.toFixed(1)),
    );

    const points = data.map((d, i) => {
      const x =
        padding.left +
        (data.length > 1 ? (i / (data.length - 1)) * chartW : chartW / 2);
      const y = padding.top + chartH - (d.hours / maxHours) * chartH;
      return { ...d, x, y };
    });

    const linePath = points
      .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
      .join(" ");

    return { padding, chartH, maxHours, yTicks, points, linePath, width };
  }, [data, height]);

  const hovered = hoverIndex !== null ? layout.points[hoverIndex] : null;

  if (!hasActivity && emptyMessage) {
    return (
      <div className="relative" style={{ height }}>
        <svg
          viewBox={`0 0 ${layout.width} ${height}`}
          className="h-full w-full"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {[0.25, 0.5, 0.75].map((pct) => {
            const y =
              layout.padding.top + layout.chartH * (1 - pct);
            return (
              <line
                key={pct}
                x1={layout.padding.left}
                y1={y}
                x2={layout.width - layout.padding.right}
                y2={y}
                stroke={CHART_COLORS.grid}
                strokeWidth={0.5}
                vectorEffect="non-scaling-stroke"
              />
            );
          })}
          {data.map((d, i) => {
            const x =
              layout.padding.left +
              (data.length > 1
                ? (i / (data.length - 1)) *
                  (layout.width - layout.padding.left - layout.padding.right)
                : (layout.width - layout.padding.left - layout.padding.right) /
                  2);
            return (
              <text
                key={d.date}
                x={x}
                y={height - 8}
                textAnchor="middle"
                fill={CHART_COLORS.axis}
                fontSize={10}
              >
                {d.label}
              </text>
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <p className="text-sm text-text-secondary">{emptyMessage}</p>
          {emptyDescription && (
            <p className="mt-1 max-w-xs text-xs text-text-muted">
              {emptyDescription}
            </p>
          )}
          {emptyAction && <div className="mt-4">{emptyAction}</div>}
        </div>
      </div>
    );
  }

  return (
    <div className="relative" style={{ height }}>
      <svg
        viewBox={`0 0 ${layout.width} ${height}`}
        className="h-full w-full"
        preserveAspectRatio="none"
        role="img"
        aria-label="Study activity line chart"
      >
        {layout.yTicks.map((tick) => {
          const y =
            layout.padding.top +
            layout.chartH -
            (tick / layout.maxHours) * layout.chartH;
          return (
            <g key={tick}>
              <line
                x1={layout.padding.left}
                y1={y}
                x2={layout.width - layout.padding.right}
                y2={y}
                stroke={CHART_COLORS.grid}
                strokeWidth={0.5}
                vectorEffect="non-scaling-stroke"
              />
              <text
                x={layout.padding.left - 6}
                y={y + 3}
                textAnchor="end"
                fill={CHART_COLORS.axis}
                fontSize={9}
              >
                {tick}
              </text>
            </g>
          );
        })}

        {hasActivity && (
          <path
            d={layout.linePath}
            fill="none"
            stroke={CHART_COLORS.teal}
            strokeWidth={1.5}
            vectorEffect="non-scaling-stroke"
          />
        )}

        {layout.points.map((p, i) => (
          <g key={p.date}>
            <circle
              cx={p.x}
              cy={p.y}
              r={8}
              fill="transparent"
              className="cursor-pointer"
              onMouseEnter={() => setHoverIndex(i)}
              onMouseLeave={() => setHoverIndex(null)}
            />
            {p.hours > 0 && (
              <circle
                cx={p.x}
                cy={p.y}
                r={2.5}
                fill={CHART_COLORS.teal}
                vectorEffect="non-scaling-stroke"
              />
            )}
            <text
              x={p.x}
              y={height - 8}
              textAnchor="middle"
              fill={CHART_COLORS.axis}
              fontSize={data.length > 14 ? 8 : 10}
            >
              {data.length > 14 && i % 5 !== 0 && i !== data.length - 1
                ? ""
                : p.label}
            </text>
          </g>
        ))}
      </svg>

      {hovered && (
        <div
          className="pointer-events-none absolute z-20"
          style={{
            left: `${(hovered.x / layout.width) * 100}%`,
            top: `${(hovered.y / height) * 100}%`,
            transform: "translate(-50%, -120%)",
          }}
        >
          <ChartTooltip
            title={formatTooltipDate(hovered.date)}
            lines={[
              `${hovered.hours} hour${hovered.hours === 1 ? "" : "s"}`,
              ...(hovered.sessionCount !== undefined
                ? [
                    `${hovered.sessionCount} session${hovered.sessionCount === 1 ? "" : "s"}`,
                  ]
                : []),
            ]}
          />
        </div>
      )}
    </div>
  );
}
