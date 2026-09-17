"use client";

import { Calendar } from "lucide-react";
import { dashboardCard, DashboardScrollReveal } from "@/components/dashboard";
import { daysBetweenLocal } from "@/lib/date-only";
import type { ReviewTopic } from "../data";
import { MASTERY_CONFIG } from "../../roadmap/types";

interface DueForReviewProps {
  topics: ReviewTopic[];
}

export function DueForReview({ topics }: DueForReviewProps) {
  return (
    <DashboardScrollReveal>
    <div className={`${dashboardCard} p-5`}>
      <div className="mb-4 flex items-center gap-2">
        <h3 className="text-sm font-semibold text-text-primary">Due for Review</h3>
        {topics.length > 0 && (
          <span className="rounded-md bg-bg-elevated px-2 py-0.5 text-xs tabular-nums text-text-muted">
            {topics.length}
          </span>
        )}
      </div>

      {topics.length > 0 ? (
        <div className="max-h-64 overflow-y-auto">
          {topics.map((topic, idx) => {
            const days = daysBetweenLocal(topic.lastStudied);
            const masteryConfig = MASTERY_CONFIG[topic.mastery];
            return (
              <div
                key={topic.topicId}
                className={`flex items-center justify-between gap-3 py-2.5 ${
                  idx < topics.length - 1 ? "border-b border-border-subtle" : ""
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
                <div className="flex shrink-0 items-center gap-3">
                  <span
                    className={`rounded-md px-2 py-0.5 text-xs font-medium ${masteryConfig.activeBg} ${masteryConfig.activeColor}`}
                  >
                    {masteryConfig.label}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-text-muted">
                    <Calendar size={11} />
                    {days}d
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-text-muted">
          All caught up — no topics due for review.
        </p>
      )}
    </div>
    </DashboardScrollReveal>
  );
}
