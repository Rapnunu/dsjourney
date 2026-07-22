"use client";

import Link from "next/link";
import { Clock, Lightbulb, ArrowRight } from "lucide-react";
import type { RecommendedTopic as RecommendedTopicType } from "../data";

interface RecommendedTopicProps {
  topic: RecommendedTopicType | null;
}

export function RecommendedTopic({ topic }: RecommendedTopicProps) {
  if (!topic) {
    return (
      <div className="rounded-xl border border-dashed border-border-primary bg-bg-surface/50 p-5">
        <h3 className="text-sm font-semibold text-text-primary mb-2">Recommended Next</h3>
        <p className="text-sm text-text-muted">All topics mastered! 🎉</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border-primary bg-bg-surface/50 p-5">
      <h3 className="text-sm font-semibold text-text-muted mb-3">Recommended Next</h3>

      <p className="text-lg font-semibold text-text-primary mb-2">{topic.topicName}</p>

      <div className="flex items-center gap-3 mb-3 flex-wrap">
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-accent-muted text-accent">
          {topic.categoryName}
        </span>
        <span className="inline-flex items-center gap-1 text-xs text-text-muted">
          <Clock size={12} />
          {topic.estimatedHours}h estimated
        </span>
      </div>

      <div className="flex items-start gap-2 mb-4 px-3 py-2 rounded-lg bg-bg-primary/50">
        <Lightbulb size={14} className="text-amber-400 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-text-secondary">{topic.reason}</p>
      </div>

      <Link
        href="/study-sessions"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
          bg-accent text-white hover:bg-accent-hover
          focus-ring transition-colors duration-150"
      >
        Start Study Session
        <ArrowRight size={15} />
      </Link>
    </div>
  );
}
