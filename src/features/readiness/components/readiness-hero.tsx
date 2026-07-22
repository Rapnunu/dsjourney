"use client";

import { useEffect, useState } from "react";

interface ReadinessHeroProps {
  readiness: number;
  summary: string;
}

export function ReadinessHero({ readiness, summary }: ReadinessHeroProps) {
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    // Animate from 0 to readiness over ~800ms
    const duration = 800;
    const startTime = Date.now();
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedValue(Math.round(eased * readiness));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [readiness]);

  const radius = 90;
  const strokeWidth = 10;
  const center = 110;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedValue / 100) * circumference;

  // Color based on readiness
  const getGradientColors = () => {
    if (readiness >= 70) return { start: "#34d399", end: "#059669" }; // emerald
    if (readiness >= 45) return { start: "#818cf8", end: "#6366f1" }; // indigo/accent
    return { start: "#f59e0b", end: "#d97706" }; // amber
  };
  const gradient = getGradientColors();

  const getLabel = () => {
    if (readiness >= 80) return "Excellent";
    if (readiness >= 60) return "Good";
    if (readiness >= 40) return "Building";
    if (readiness >= 20) return "Developing";
    return "Starting";
  };

  return (
    <div className="relative rounded-2xl border border-border-primary bg-bg-surface/50 p-8 overflow-hidden">
      {/* Background glow */}
      <div
        className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full opacity-[0.07] blur-3xl"
        style={{ background: `radial-gradient(circle, ${gradient.start}, transparent)` }}
      />

      <div className="flex flex-col items-center gap-6 sm:flex-row sm:gap-10">
        {/* Circular progress */}
        <div className="relative flex-shrink-0">
          <svg width={center * 2} height={center * 2} className="transform -rotate-90">
            <defs>
              <linearGradient id="readiness-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={gradient.start} />
                <stop offset="100%" stopColor={gradient.end} />
              </linearGradient>
            </defs>
            {/* Background track */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="currentColor"
              className="text-border-subtle"
              strokeWidth={strokeWidth}
            />
            {/* Progress arc */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="url(#readiness-gradient)"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-[stroke-dashoffset] duration-700 ease-out"
            />
          </svg>

          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-bold tabular-nums text-text-primary">
              {animatedValue}
              <span className="text-2xl text-text-muted">%</span>
            </span>
            <span className="mt-1 text-sm font-medium text-text-secondary">
              {getLabel()}
            </span>
          </div>
        </div>

        {/* Summary text */}
        <div className="text-center sm:text-left">
          <h2 className="text-xl font-semibold text-text-primary mb-2">
            Internship Readiness
          </h2>
          <p className="text-sm text-text-secondary leading-relaxed max-w-md">
            {summary}
          </p>
          <div className="mt-4 flex items-center gap-4 justify-center sm:justify-start">
            <div className="flex items-center gap-1.5 text-xs text-text-muted">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
              Mastered
            </div>
            <div className="flex items-center gap-1.5 text-xs text-text-muted">
              <span className="inline-block h-2 w-2 rounded-full bg-blue-500" />
              Practiced
            </div>
            <div className="flex items-center gap-1.5 text-xs text-text-muted">
              <span className="inline-block h-2 w-2 rounded-full bg-amber-500" />
              Learning
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
