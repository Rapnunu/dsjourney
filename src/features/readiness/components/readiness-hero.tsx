"use client";

import { useEffect, useState } from "react";
import CountUp from "@/components/react-bits/CountUp";
import { dashboardCard } from "@/components/dashboard";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

interface ReadinessHeroProps {
  readiness: number;
  summary: string;
}

function getStrokeColor(score: number): string {
  if (score >= 70) return "#25b782";
  if (score >= 45) return "#3578e5";
  return "#e1a72d";
}

function getLabel(score: number): string {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  if (score >= 40) return "Developing";
  if (score >= 20) return "Building";
  return "Starting";
}

export function ReadinessHero({ readiness, summary }: ReadinessHeroProps) {
  const reducedMotion = usePrefersReducedMotion();
  const [animatedRing, setAnimatedRing] = useState(0);
  const ringProgress = reducedMotion ? readiness : animatedRing;

  useEffect(() => {
    if (reducedMotion) return;

    const duration = 1000;
    const startTime = Date.now();
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedRing(Math.round(eased * readiness));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [readiness, reducedMotion]);

  const radius = 72;
  const strokeWidth = 8;
  const center = 88;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (ringProgress / 100) * circumference;
  const strokeColor = getStrokeColor(readiness);

  return (
    <div className={`${dashboardCard} p-6 sm:p-8`}>
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:gap-10">
        <div className="relative shrink-0">
          <svg
            width={center * 2}
            height={center * 2}
            className="-rotate-90"
            aria-hidden="true"
          >
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth={strokeWidth}
            />
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-[stroke-dashoffset] duration-700 ease-out"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold tabular-nums text-text-primary sm:text-5xl">
              <CountUp to={readiness} suffix="%" duration={1} />
            </span>
            <span className="mt-1 text-sm font-medium text-text-secondary">
              {getLabel(readiness)}
            </span>
          </div>
        </div>

        <div className="text-center sm:text-left">
          <h2 className="mb-2 text-xl font-semibold text-text-primary">
            Internship Readiness
          </h2>
          <p className="max-w-md text-sm leading-relaxed text-text-secondary">
            {summary}
          </p>
          <p className="mt-3 text-xs text-text-muted">
            You&apos;re building momentum — focus on your biggest skill gaps.
          </p>
        </div>
      </div>
    </div>
  );
}
