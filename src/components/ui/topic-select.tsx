"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import type { TopicOption } from "@/features/sessions/types";

interface TopicSelectProps {
  id?: string;
  value: string;
  onValueChange: (value: string) => void;
  options: TopicOption[];
  disabled?: boolean;
  error?: boolean;
}

function groupByCategory(options: TopicOption[]): Record<string, TopicOption[]> {
  const groups: Record<string, TopicOption[]> = {};
  for (const option of options) {
    if (!groups[option.category]) groups[option.category] = [];
    groups[option.category].push(option);
  }
  return groups;
}

export function TopicSelect({
  id,
  value,
  onValueChange,
  options,
  disabled = false,
  error = false,
}: TopicSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const selected = options.find((option) => option.id === value);
  const grouped = useMemo(() => groupByCategory(options), [options]);

  const filteredGroups = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return grouped;

    const result: Record<string, TopicOption[]> = {};
    for (const [category, topics] of Object.entries(grouped)) {
      const matches = topics.filter(
        (topic) =>
          topic.name.toLowerCase().includes(query) ||
          category.toLowerCase().includes(query),
      );
      if (matches.length > 0) result[category] = matches;
    }
    return result;
  }, [grouped, search]);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    searchRef.current?.focus();

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        id={id}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className={`flex h-11 w-full items-center justify-between gap-2 rounded-lg border bg-bg-input px-3 text-left text-sm transition-colors focus:outline-none focus:ring-1 disabled:cursor-not-allowed disabled:opacity-60 ${
          error
            ? "border-danger focus:border-danger focus:ring-danger/40"
            : "border-border-strong focus:border-brand-teal focus:ring-brand-teal"
        }`}
      >
        <span className={selected ? "text-text-primary" : "text-text-muted"}>
          {selected ? selected.name : "Search or select a topic..."}
        </span>
        <ChevronDown size={16} className="shrink-0 text-text-muted" />
      </button>

      {open && (
        <div
          className="absolute z-[100] mt-1.5 w-full overflow-hidden rounded-[10px] border border-border-subtle bg-bg-surface shadow-sm"
          role="listbox"
          aria-label="Study topics"
        >
          <div className="border-b border-border-subtle p-2">
            <div className="relative">
              <Search
                size={14}
                className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted"
              />
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search topics or categories..."
                className="h-9 w-full rounded-lg border border-border-strong bg-bg-input pl-8 pr-3 text-sm text-text-primary placeholder:text-text-muted focus:border-brand-teal focus:outline-none focus:ring-1 focus:ring-brand-teal"
              />
            </div>
          </div>

          <div className="max-h-60 overflow-y-auto p-1">
            {Object.keys(filteredGroups).length === 0 ? (
              <p className="px-3 py-4 text-center text-xs text-text-muted">
                No topics match your search.
              </p>
            ) : (
              Object.entries(filteredGroups).map(([category, topics]) => (
                <div key={category} className="py-1">
                  <p className="px-3 py-1 text-[10px] font-medium uppercase tracking-wide text-text-muted">
                    {category}
                  </p>
                  {topics.map((topic) => {
                    const isSelected = topic.id === value;
                    return (
                      <button
                        key={topic.id}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => {
                          onValueChange(topic.id);
                          setOpen(false);
                          setSearch("");
                        }}
                        className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-bg-elevated ${
                          isSelected
                            ? "bg-brand-teal/10 text-text-primary"
                            : "text-text-secondary"
                        }`}
                      >
                        <span className="truncate">{topic.name}</span>
                        {isSelected && (
                          <Check size={14} className="shrink-0 text-brand-teal" />
                        )}
                      </button>
                    );
                  })}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
