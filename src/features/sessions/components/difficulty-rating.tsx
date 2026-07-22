"use client";

import { DIFFICULTY_LABELS } from "../types";

interface DifficultyRatingProps {
  value: number;
  onChange?: (value: number) => void;
  size?: "sm" | "md";
}

const dotColors: Record<number, string> = {
  1: "bg-emerald-400",
  2: "bg-teal-400",
  3: "bg-amber-400",
  4: "bg-orange-400",
  5: "bg-rose-400",
};

export function DifficultyRating({ value, onChange, size = "sm" }: DifficultyRatingProps) {
  const dotSize = size === "sm" ? "h-2 w-2" : "h-3 w-3";
  const gap = size === "sm" ? "gap-1" : "gap-1.5";
  const interactive = !!onChange;
  const config = DIFFICULTY_LABELS[value];

  return (
    <div className="flex items-center gap-2">
      <div className={`flex items-center ${gap}`}>
        {[1, 2, 3, 4, 5].map((level) => (
          <button
            key={level}
            type="button"
            disabled={!interactive}
            onClick={() => onChange?.(level as 1 | 2 | 3 | 4 | 5)}
            className={`
              rounded-full transition-all duration-150
              ${dotSize}
              ${level <= value ? dotColors[value] : "bg-zinc-700"}
              ${interactive ? "cursor-pointer hover:scale-125" : "cursor-default"}
            `}
            aria-label={`Difficulty ${level}`}
          />
        ))}
      </div>
      {config && (
        <span className={`text-xs ${config.color}`}>
          {config.label}
        </span>
      )}
    </div>
  );
}
