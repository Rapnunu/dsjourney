"use client";

import { useState, useMemo } from "react";
import { Search, X, Pencil, Trash2 } from "lucide-react";
import { DsSelect } from "@/components/ui/ds-select";
import type { StudySession } from "../types";
import { DifficultyRating } from "./difficulty-rating";

interface SessionTableProps {
  sessions: StudySession[];
  onEdit: (session: StudySession) => void;
  onDelete: (sessionId: string) => void;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function truncate(str: string, maxLen: number): string {
  return str.length > maxLen ? str.slice(0, maxLen) + "..." : str;
}

export function SessionTable({ sessions, onEdit, onDelete }: SessionTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Unique categories
  const categories = useMemo(() => {
    const cats = new Set(sessions.map((s) => s.categoryName));
    return Array.from(cats).sort();
  }, [sessions]);

  // Filter and sort
  const filteredSessions = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return sessions
      .filter((s) => {
        if (categoryFilter !== "all" && s.categoryName !== categoryFilter) return false;
        if (query) {
          return (
            s.topicName.toLowerCase().includes(query) ||
            s.categoryName.toLowerCase().includes(query) ||
            s.notes.toLowerCase().includes(query)
          );
        }
        return true;
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [sessions, searchQuery, categoryFilter]);

  return (
    <div className="space-y-4">
      {/* Search + Filter bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search sessions..."
            className="w-full h-9 pl-9 pr-9 rounded-lg border border-border-primary bg-bg-surface/50 text-sm text-text-primary
              placeholder:text-text-muted
              focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent
              transition-colors duration-150"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary p-0.5 rounded transition-colors"
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="w-full sm:w-52">
          <DsSelect
            value={categoryFilter}
            onValueChange={setCategoryFilter}
            options={[
              { value: "all", label: "All Categories" },
              ...categories.map((cat) => ({ value: cat, label: cat })),
            ]}
            aria-label="Filter sessions by category"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-[10px] border border-border-subtle bg-bg-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-subtle">
                <th className="text-left px-4 py-3 text-xs font-medium text-text-muted whitespace-nowrap">Date</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-text-muted whitespace-nowrap">Topic</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-text-muted whitespace-nowrap">Hours</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-text-muted whitespace-nowrap">Difficulty</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-text-muted whitespace-nowrap hidden md:table-cell">Notes</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-text-muted whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSessions.length > 0 ? (
                filteredSessions.map((session, idx) => (
                  <tr
                    key={session.id}
                    className={`
                      hover:bg-bg-surface-hover/50 transition-colors duration-100
                      ${idx < filteredSessions.length - 1 ? "border-b border-border-subtle" : ""}
                    `}
                  >
                    <td className="px-4 py-3 text-text-secondary whitespace-nowrap tabular-nums">
                      {formatDate(session.date)}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-text-primary font-medium truncate max-w-[200px]">{session.topicName}</p>
                      <p className="text-xs text-text-muted mt-0.5">{session.categoryName}</p>
                    </td>
                    <td className="px-4 py-3 text-text-secondary tabular-nums whitespace-nowrap">
                      {session.hoursStudied}h
                    </td>
                    <td className="px-4 py-3">
                      <DifficultyRating value={session.difficultyRating} size="sm" />
                    </td>
                    <td className="px-4 py-3 text-text-muted hidden md:table-cell">
                      <span title={session.notes}>{truncate(session.notes, 60)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onEdit(session)}
                          className="p-1.5 rounded-md text-text-muted hover:text-text-primary hover:bg-bg-surface-hover transition-colors focus-ring"
                          aria-label="Edit session"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => onDelete(session.id)}
                          className="p-1.5 rounded-md text-text-muted hover:text-rose-400 hover:bg-rose-500/10 transition-colors focus-ring"
                          aria-label="Delete session"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : sessions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center">
                    <p className="text-sm font-medium text-text-primary">
                      No study sessions yet.
                    </p>
                    <p className="mx-auto mt-2 max-w-sm text-sm text-text-secondary">
                      Log your first study session to start building your study
                      history.
                    </p>
                  </td>
                </tr>
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-sm text-text-muted">
                    No sessions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
