"use client";

import Link from "next/link";
import { ArrowRight, Clock, Lightbulb } from "lucide-react";
import {
  dashboardBtnPrimary,
  dashboardCard,
  DashboardMagnet,
  DashboardScrollReveal,
  EmptyState,
} from "@/components/dashboard";
import type { RecommendedTopic as RecommendedTopicType } from "../data";

interface RecommendedTopicProps {
  topic: RecommendedTopicType | null;
}

export function RecommendedTopic({ topic }: RecommendedTopicProps) {
  if (!topic) {
    return (
      <EmptyState
        title="Recommended Next"
        description="All topics mastered — great work."
      />
    );
  }

  return (
    <DashboardScrollReveal delayMs={40}>
    <div className={`${dashboardCard} dashboard-card-hover p-5`}>
      <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
        Recommended Next
      </p>

      <h3 className="mt-2 text-xl font-semibold text-text-primary">
        {topic.topicName}
      </h3>

      <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
        <span className="rounded-md bg-bg-elevated px-2 py-0.5 text-xs font-medium text-brand-teal">
          {topic.categoryName}
        </span>
        <span className="inline-flex items-center gap-1 text-xs text-text-muted">
          <Clock size={12} />
          {topic.estimatedHours}h estimated
        </span>
      </div>

      <div className="mt-4 flex items-start gap-2 rounded-lg border border-border-subtle bg-bg-elevated px-3 py-2.5">
        <Lightbulb size={14} className="mt-0.5 shrink-0 text-warning" />
        <p className="text-sm text-text-secondary">{topic.reason}</p>
      </div>

      <DashboardMagnet className="mt-5 inline-block">
        <Link href="/study-sessions" className={dashboardBtnPrimary}>
          Start Study Session
          <ArrowRight size={15} />
        </Link>
      </DashboardMagnet>
    </div>
    </DashboardScrollReveal>
  );
}
