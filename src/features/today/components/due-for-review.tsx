"use client";

import { Calendar } from "lucide-react";
import type { ReviewTopic } from "../data";
import { MASTERY_CONFIG } from "../../roadmap/types";

interface DueForReviewProps {
  topics: ReviewTopic[];
}

function daysAgo(dateStr: string): number {
  const today = new Date("2026-07-22T00:00:00");
  const date = new Date(dateStr + "T00:00:00");
  const diff = today.getTime() - date.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function DueForReview({ topics }: DueForReviewProps) {
  return (
    <div className="rounded-xl border border-border-primary bg-bg-surface/50 p-5">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-sm font-semibold text-text-primary">Due for Review</h3>
        {topics.length > 0 && (
          <span className="text-xs text-text-muted bg-bg-surface px-2 py-0.5 rounded-full tabular-nums">
            {topics.length}
          </span>
        )}
      </div>

      {topics.length > 0 ? (
        <div className="space-y-0">
          {topics.map((topic, idx) => {
            const days = daysAgo(topic.lastStudied);
            const masteryConfig = MASTERY_CONFIG[topic.mastery];
            return (
              <div
                key={topic.topicId}
                className={`flex items-center justify-between py-2.5 ${
                  idx < topics.length - 1 ? "border-b border-border-subtle" : ""
                }`}
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">
                    {topic.topicName}
                  </p>
                  <p className="text-xs text-text-muted mt-0.5">{topic.categoryName}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${masteryConfig.activeBg} ${masteryConfig.activeColor}`}>
                    {masteryConfig.label}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-text-muted">
                    <Calendar size={11} />
                    {days}d ago
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-text-muted">All caught up! No topics due for review. ✅</p>
      )}
    </div>
  );
}
