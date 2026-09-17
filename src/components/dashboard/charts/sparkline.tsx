"use client";

import { CHART_COLORS } from "./chart-colors";

interface SparklineProps {
  values: number[];
  width?: number;
  height?: number;
  className?: string;
}

export function Sparkline({
  values,
  width = 72,
  height = 28,
  className = "",
}: SparklineProps) {
  const max = Math.max(...values, 0.1);
  const padding = 2;
  const innerW = width - padding * 2;
  const innerH = height - padding * 2;

  const points = values.map((v, i) => {
    const x = padding + (values.length > 1 ? (i / (values.length - 1)) * innerW : innerW / 2);
    const y = padding + innerH - (v / max) * innerH;
    return `${x},${y}`;
  });

  const hasData = values.some((v) => v > 0);

  if (!hasData) {
    return (
      <svg
        width={width}
        height={height}
        className={className}
        aria-hidden="true"
      >
        <line
          x1={padding}
          y1={height / 2}
          x2={width - padding}
          y2={height / 2}
          stroke={CHART_COLORS.grid}
          strokeWidth={1}
        />
      </svg>
    );
  }

  return (
    <svg
      width={width}
      height={height}
      className={className}
      aria-hidden="true"
    >
      <polyline
        fill="none"
        stroke={CHART_COLORS.teal}
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
        points={points.join(" ")}
      />
    </svg>
  );
}
