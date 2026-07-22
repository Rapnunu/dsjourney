"use client";

import Link from "next/link";
import { ArrowRight, Clock, TrendingUp, Sparkles } from "lucide-react";
import type { RecommendedFocus as RecommendedFocusType } from "../data";

interface RecommendedFocusProps {
  topics: RecommendedFocusType[];
}

export function RecommendedFocus({ topics }: RecommendedFocusProps) {
  if (topics.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border-primary bg-bg-surface/50 p-5">
        <h3 className="text-sm font-semibold text-text-primary mb-2">Recommended Focus</h3>
        <p className="text-sm text-text-muted">All areas are well covered! 🎉</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border-primary bg-bg-surface/50 p-5">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles size={16} className="text-accent" />
        <h3 className="text-sm font-semibold text-text-primary">
          Recommended Focus
        </h3>
      </div>

      {/* Topic cards */}
      <div className="space-y-3 mb-5">
        {topics.map((item, i) => (
          <div
            key={`${item.category}-${item.topic}`}
            className="group rounded-lg border border-border-subtle bg-bg-primary/40 px-4 py-3 hover:border-border-primary hover:bg-bg-primary/60 transition-colors duration-150"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">
                  {item.topic}
                </p>
                <p className="text-xs text-text-muted mt-0.5">{item.category}</p>
              </div>
              {i === 0 && (
                <span className="flex-shrink-0 text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-accent-muted text-accent">
                  Top pick
                </span>
              )}
            </div>

            <div className="flex items-center gap-4 mt-2.5 text-xs text-text-secondary">
              <span className="inline-flex items-center gap-1">
                <Clock size={12} className="text-text-muted" />
                {item.estimatedHours}h estimated
              </span>
              <span className="inline-flex items-center gap-1">
                <TrendingUp size={12} className="text-emerald-400" />
                +{item.readinessGain}% readiness
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <Link
        href="/study-sessions"
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium
          bg-accent text-white hover:bg-accent-hover
          focus-ring transition-colors duration-150"
      >
        Start Study Session
        <ArrowRight size={15} />
      </Link>
    </div>
  );
}
