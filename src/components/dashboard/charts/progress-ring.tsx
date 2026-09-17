"use client";

import { useEffect, useState } from "react";
import CountUp from "@/components/react-bits/CountUp";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { CHART_COLORS } from "./chart-colors";

interface ProgressRingProps {
  value: number;
  label: string;
  size?: number;
  strokeWidth?: number;
  progressColor?: string;
}

function getProgressColor(score: number): string {
  if (score >= 70) return CHART_COLORS.success;
  if (score >= 45) return CHART_COLORS.blue;
  return CHART_COLORS.teal;
}

export function ProgressRing({
  value,
  label,
  size = 140,
  strokeWidth = 7,
  progressColor,
}: ProgressRingProps) {
  const reducedMotion = usePrefersReducedMotion();
  const [animatedValue, setAnimatedValue] = useState(0);
  const displayValue = reducedMotion ? value : animatedValue;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (displayValue / 100) * circumference;
  const stroke = progressColor ?? getProgressColor(value);

  useEffect(() => {
    if (reducedMotion) return;

    const duration = 800;
    const startTime = Date.now();
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedValue(Math.round(eased * value));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [value, reducedMotion]);

  return (
    <div
      className="relative mx-auto shrink-0"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Internship Readiness: ${value}%`}
    >
      <svg
        width={size}
        height={size}
        className="-rotate-90"
        aria-hidden="true"
      >
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={CHART_COLORS.track}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold tabular-nums text-text-primary">
          <CountUp to={value} suffix="%" duration={0.8} />
        </span>
        <span className="mt-0.5 text-xs font-medium uppercase tracking-wide text-text-secondary">
          {label}
        </span>
      </div>
    </div>
  );
}
