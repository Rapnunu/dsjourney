"use client";

import { Clock, ExternalLink, Calendar } from "lucide-react";
import type { RoadmapTopic, MasteryLevel } from "../types";
import { DIFFICULTY_CONFIG } from "../types";
import { MasteryPills } from "./mastery-pills";

interface TopicRowProps {
  topic: RoadmapTopic;
  onMasteryChange: (topicId: string, level: MasteryLevel) => void;
  isLast: boolean;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function TopicRow({ topic, onMasteryChange, isLast }: TopicRowProps) {
  const diffConfig = DIFFICULTY_CONFIG[topic.difficulty];

  return (
    <div
      className={`
        flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3
        hover:bg-bg-surface-hover/50 transition-colors duration-100
        ${!isLast ? "border-b border-border-subtle" : ""}
      `}
    >
      {/* Left: Topic info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-text-primary truncate">
          {topic.name}
        </p>
        <div className="flex items-center gap-3 mt-1.5 flex-wrap">
          {/* Difficulty badge */}
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${diffConfig.bgColor} ${diffConfig.color}`}
          >
            {diffConfig.label}
          </span>

          {/* Estimated hours */}
          <span className="inline-flex items-center gap-1 text-xs text-text-muted">
            <Clock size={12} />
            {topic.estimatedHours}h
          </span>

          {/* Resource link */}
          {topic.resourceLink && (
            <a
              href={topic.resourceLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-accent hover:text-accent-hover transition-colors"
            >
              <ExternalLink size={12} />
              Resource
            </a>
          )}

          {/* Last studied */}
          {topic.lastStudied && (
            <span className="inline-flex items-center gap-1 text-xs text-text-muted">
              <Calendar size={12} />
              {formatDate(topic.lastStudied)}
            </span>
          )}
        </div>
      </div>

      {/* Right: Mastery pills */}
      <div className="flex-shrink-0">
        <MasteryPills
          currentLevel={topic.mastery}
          onSelect={(level) => onMasteryChange(topic.id, level)}
        />
      </div>
    </div>
  );
}
