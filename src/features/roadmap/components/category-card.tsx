"use client";

import { ChevronRight, Clock } from "lucide-react";
import type { RoadmapCategory, MasteryLevel } from "../types";
import { MASTERY_WEIGHTS, MASTERY_REMAINING_FACTOR } from "../types";
import { ProgressBar } from "./progress-bar";
import { TopicRow } from "./topic-row";

interface CategoryCardProps {
  category: RoadmapCategory;
  isExpanded: boolean;
  onToggle: () => void;
  onMasteryChange: (topicId: string, level: MasteryLevel) => void;
}

function computeCategoryStats(topics: RoadmapCategory["topics"]) {
  const total = topics.length;

  // Readiness: weighted average of mastery levels (0–100%)
  const readiness =
    total > 0
      ? Math.round(
          (topics.reduce((sum, t) => sum + MASTERY_WEIGHTS[t.mastery], 0) /
            total) *
            100
        )
      : 0;

  // Remaining hours: sum of estimated hours scaled by remaining factor
  const remainingHours = parseFloat(
    topics
      .reduce(
        (sum, t) => sum + t.estimatedHours * MASTERY_REMAINING_FACTOR[t.mastery],
        0
      )
      .toFixed(1)
  );

  // Total estimated hours
  const totalHours = topics.reduce((sum, t) => sum + t.estimatedHours, 0);

  // Completed = practiced or mastered
  const completed = topics.filter(
    (t) => t.mastery === "practiced" || t.mastery === "mastered"
  ).length;

  return { total, readiness, remainingHours, totalHours, completed };
}

export function CategoryCard({
  category,
  isExpanded,
  onToggle,
  onMasteryChange,
}: CategoryCardProps) {
  const { total, readiness, remainingHours, completed } = computeCategoryStats(
    category.topics
  );

  return (
    <div className="rounded-xl border border-border-primary bg-bg-surface/50 overflow-hidden transition-colors duration-150">
      {/* Header — always visible, clickable */}
      <button
        onClick={onToggle}
        className="focus-ring w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-bg-surface-hover/30 transition-colors duration-100 cursor-pointer"
      >
        {/* Chevron */}
        <ChevronRight
          size={18}
          className={`text-text-muted flex-shrink-0 transition-transform duration-200 ${
            isExpanded ? "rotate-90" : ""
          }`}
        />

        {/* Category info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base font-semibold text-text-primary">
              {category.name}
            </h3>
            <span className="text-xs text-text-muted hidden sm:inline">
              {category.description}
            </span>
          </div>
          <div className="mt-2 max-w-xs">
            <ProgressBar completed={readiness} total={100} />
          </div>
        </div>

        {/* Stats */}
        <div className="flex-shrink-0 flex items-center gap-4">
          {/* Remaining hours */}
          <div className="hidden sm:flex items-center gap-1.5 text-text-muted">
            <Clock size={14} />
            <span className="text-xs tabular-nums whitespace-nowrap">
              <span className="text-text-secondary font-medium">
                {remainingHours}h
              </span>{" "}
              left
            </span>
          </div>

          {/* Topics + readiness */}
          <div className="text-right">
            <span className="text-sm text-text-secondary tabular-nums">
              <span className="text-text-primary font-medium">{completed}</span>
              {" / "}
              {total} topics
            </span>
            <p className="text-xs text-text-muted mt-0.5">
              {readiness}% ready
            </p>
          </div>
        </div>
      </button>

      {/* Expandable topic list */}
      {isExpanded && (
        <div className="border-t border-border-subtle">
          {category.topics.map((topic, idx) => (
            <TopicRow
              key={topic.id}
              topic={topic}
              onMasteryChange={onMasteryChange}
              isLast={idx === category.topics.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export { computeCategoryStats };
