"use client";

import { useEffect, useState } from "react";
import { Eye, CheckCircle2, ArrowUpCircle, Lightbulb } from "lucide-react";
import type { RecruiterInsight } from "../data/projects";

interface RecruiterViewProps {
  insight: RecruiterInsight;
}

export function RecruiterView({ insight }: RecruiterViewProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const duration = 600;
    const startTime = Date.now();
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(eased * insight.portfolioStrength));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [insight.portfolioStrength]);

  const getScoreColor = () => {
    if (insight.portfolioStrength >= 75) return "text-emerald-400";
    if (insight.portfolioStrength >= 50) return "text-brand-teal";
    return "text-amber-400";
  };

  const getBarColor = () => {
    if (insight.portfolioStrength >= 75) return "bg-success";
    if (insight.portfolioStrength >= 50) return "bg-brand-blue";
    return "bg-warning";
  };

  return (
    <div className="rounded-[10px] border border-border-subtle bg-bg-surface p-5">
      <div className="flex items-center gap-2 mb-5">
        <Eye size={16} className="text-violet-400" />
        <h3 className="text-sm font-semibold text-text-primary">
          Recruiter View
        </h3>
      </div>

      {/* Portfolio Strength score */}
      <div className="mb-6">
        <div className="flex items-baseline justify-between mb-2">
          <span className="text-xs font-medium text-text-muted">
            Portfolio Strength
          </span>
          <span className={`text-2xl font-bold tabular-nums ${getScoreColor()}`}>
            {animatedScore}
            <span className="text-sm text-text-muted">%</span>
          </span>
        </div>
        <div className="h-2 rounded-full bg-bg-primary/80 overflow-hidden">
          <div
            className={`h-full rounded-full ${getBarColor()} transition-all duration-700 ease-out`}
            style={{ width: `${animatedScore}%` }}
          />
        </div>
      </div>

      {/* Strengths */}
      <div className="mb-5">
        <div className="flex items-center gap-1.5 mb-3">
          <CheckCircle2 size={14} className="text-emerald-400" />
          <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
            Strengths
          </h4>
        </div>
        <ul className="space-y-2">
          {insight.strengths.map((s, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
              {s}
            </li>
          ))}
        </ul>
      </div>

      {/* Improvements */}
      <div className="mb-5">
        <div className="flex items-center gap-1.5 mb-3">
          <ArrowUpCircle size={14} className="text-amber-400" />
          <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
            Improvements
          </h4>
        </div>
        <ul className="space-y-2">
          {insight.improvements.map((s, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-amber-500 flex-shrink-0" />
              {s}
            </li>
          ))}
        </ul>
      </div>

      {/* Readiness Suggestions */}
      <div>
        <div className="flex items-center gap-1.5 mb-3">
          <Lightbulb size={14} className="text-sky-400" />
          <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
            Interview Readiness
          </h4>
        </div>
        <ul className="space-y-2">
          {insight.readinessSuggestions.map((s, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-sky-500 flex-shrink-0" />
              {s}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
