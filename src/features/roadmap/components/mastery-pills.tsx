"use client";

import { Check } from "lucide-react";
import { type MasteryLevel, MASTERY_CONFIG } from "../types";

interface MasteryPillsProps {
  currentLevel: MasteryLevel;
  onSelect: (level: MasteryLevel) => void;
  isPending?: boolean;
}

const masteryOrder: MasteryLevel[] = ["not_started", "learning", "practiced", "mastered"];

export function MasteryPills({
  currentLevel,
  onSelect,
  isPending = false,
}: MasteryPillsProps) {
  return (
    <div
      className={`flex items-center gap-1.5 ${isPending ? "opacity-70" : ""}`}
      aria-busy={isPending}
    >
      {masteryOrder.map((level) => {
        const config = MASTERY_CONFIG[level];
        const isActive = currentLevel === level;
        const isDisabled = isActive;

        return (
          <button
            key={level}
            type="button"
            disabled={isDisabled}
            onClick={(e) => {
              e.stopPropagation();
              if (isDisabled) return;
              onSelect(level);
            }}
            className={`
              relative flex items-center gap-1 border px-2.5 py-1 rounded-lg text-xs font-medium
              transition-all duration-150 whitespace-nowrap
              focus-ring
              ${isDisabled ? "cursor-not-allowed" : "cursor-pointer"}
              ${
                isActive
                  ? `border-transparent ${config.activeBg} ${config.activeColor} ring-1 ${config.activeBorder}`
                  : `border-border-strong ${config.inactiveBg} ${config.color} hover:bg-bg-surface-hover`
              }
            `}
            aria-pressed={isActive}
          >
            {isActive && <Check size={11} strokeWidth={3} className="flex-shrink-0" />}
            {config.label}
          </button>
        );
      })}
    </div>
  );
}
