"use client";

import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { DashboardScrollReveal, SectionCard } from "@/components/dashboard";
import { daysBetweenLocal } from "@/lib/date-only";
import { MASTERY_CONFIG } from "@/features/roadmap/types";
import type { ReviewTopic } from "@/features/today/data";

interface DueForReviewTopProps {
  topics: ReviewTopic[];
}

export function DueForReviewTop({ topics }: DueForReviewTopProps) {
  const topTopics = topics.slice(0, 3);

  return (
    <DashboardScrollReveal delayMs={40}>
      <SectionCard
        title="Due for Review"
        action={
          topTopics.length > 0 ? (
            <Link
              href="/today"
              className="text-xs font-medium text-brand-teal hover:text-brand-teal/80"
            >
              View all
            </Link>
          ) : undefined
        }
      >
        {topTopics.length === 0 ? (
          <p className="text-sm text-text-muted">
            All caught up — no topics due for review.
          </p>
        ) : (
          <ul className="space-y-0" aria-label="Top topics due for review">
            {topTopics.map((topic, index) => {
              const days = daysBetweenLocal(topic.lastStudied);
              const masteryConfig = MASTERY_CONFIG[topic.mastery];

              return (
                <li
                  key={topic.topicId}
                  className={`flex items-center justify-between gap-3 py-2.5 ${
                    index < topTopics.length - 1
                      ? "border-b border-border-subtle"
                      : ""
                  }`}
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-text-primary">
                      {topic.topicName}
                    </p>
                    <p className="mt-0.5 text-xs text-text-muted">
                      {topic.categoryName}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span
                      className={`rounded-md px-2 py-0.5 text-xs font-medium ${masteryConfig.activeBg} ${masteryConfig.activeColor}`}
                    >
                      {masteryConfig.label}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-text-muted">
                      <Calendar size={11} />
                      {days}d ago
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {topTopics.length > 0 && (
          <Link
            href="/today"
            className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-text-muted transition-colors hover:text-text-secondary"
          >
            View all
            <ArrowRight size={12} />
          </Link>
        )}
      </SectionCard>
    </DashboardScrollReveal>
  );
}
