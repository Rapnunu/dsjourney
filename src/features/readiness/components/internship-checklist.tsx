"use client";

import { useState } from "react";
import { Check, ClipboardCheck } from "lucide-react";
import type { ChecklistItem } from "../data";

interface InternshipChecklistProps {
  items: ChecklistItem[];
}

export function InternshipChecklist({ items: initialItems }: InternshipChecklistProps) {
  const [items, setItems] = useState<ChecklistItem[]>(() =>
    JSON.parse(JSON.stringify(initialItems))
  );

  const toggleItem = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const completed = items.filter((i) => i.completed).length;
  const total = items.length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="rounded-xl border border-border-primary bg-bg-surface/50 p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <ClipboardCheck size={16} className="text-emerald-400" />
          <h3 className="text-sm font-semibold text-text-primary">
            Internship Checklist
          </h3>
        </div>
        <span className="text-xs text-text-muted tabular-nums">
          {completed}/{total}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 rounded-full bg-bg-primary/80 overflow-hidden mb-4">
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Checklist items */}
      <div className="space-y-1.5">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => toggleItem(item.id)}
            className="w-full flex items-center gap-3 py-2 px-1 group cursor-pointer text-left rounded-md hover:bg-bg-surface-hover/50 transition-colors duration-100"
          >
            {/* Checkbox */}
            <div
              className={`flex-shrink-0 h-5 w-5 rounded-md border-2 flex items-center justify-center transition-all duration-150 ${
                item.completed
                  ? "bg-emerald-500 border-emerald-500"
                  : "border-zinc-600 group-hover:border-zinc-400"
              }`}
            >
              {item.completed && (
                <Check size={12} className="text-white" strokeWidth={3} />
              )}
            </div>

            {/* Label */}
            <span
              className={`text-sm transition-colors duration-150 ${
                item.completed
                  ? "text-text-muted line-through"
                  : "text-text-primary group-hover:text-text-primary"
              }`}
            >
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
