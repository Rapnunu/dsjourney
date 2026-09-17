"use client";

import { Check } from "lucide-react";
import { type MasteryLevel, MASTERY_CONFIG } from "../types";

interface MasteryPillsProps {
  currentLevel: MasteryLevel;
  onSelect: (level: MasteryLevel) => void;
}

const masteryOrder: MasteryLevel[] = ["not_started", "learning", "practiced", "mastered"];

export function MasteryPills({ currentLevel, onSelect }: MasteryPillsProps) {
  return (
    <div className="flex items-center gap-1.5">
      {masteryOrder.map((level) => {
        const config = MASTERY_CONFIG[level];
        const isActive = currentLevel === level;

        return (
          <button
            key={level}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(level);
            }}
            className={`
              relative flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium
              transition-all duration-150 whitespace-nowrap
              focus-ring cursor-pointer
              ${isActive
                ? `${config.activeBg} ${config.activeColor} ring-1 ${config.activeBorder}`
                : `bg-transparent ${config.color} opacity-45 hover:opacity-75`
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
