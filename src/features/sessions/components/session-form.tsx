"use client";

import { useState, useEffect } from "react";
import { Plus, Save } from "lucide-react";
import type { StudySession, TopicOption } from "../types";
import { DifficultyRating } from "./difficulty-rating";

interface SessionFormProps {
  topicOptions: TopicOption[];
  onSubmit: (session: Omit<StudySession, "id" | "createdAt">) => void;
  onCancel?: () => void;
  editingSession?: StudySession | null;
}

function getTodayStr(): string {
  const d = new Date();
  return d.toISOString().split("T")[0];
}

// Group topics by category
function groupByCategory(options: TopicOption[]): Record<string, TopicOption[]> {
  const groups: Record<string, TopicOption[]> = {};
  options.forEach((opt) => {
    if (!groups[opt.category]) groups[opt.category] = [];
    groups[opt.category].push(opt);
  });
  return groups;
}

export function SessionForm({ topicOptions, onSubmit, onCancel, editingSession }: SessionFormProps) {
  const [topicId, setTopicId] = useState("");
  const [date, setDate] = useState(getTodayStr());
  const [hoursStudied, setHoursStudied] = useState(1);
  const [difficultyRating, setDifficultyRating] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [notes, setNotes] = useState("");

  const isEditing = !!editingSession;

  // Populate form when editing
  useEffect(() => {
    if (editingSession) {
      setTopicId(editingSession.topicId);
      setDate(editingSession.date);
      setHoursStudied(editingSession.hoursStudied);
      setDifficultyRating(editingSession.difficultyRating);
      setNotes(editingSession.notes);
    } else {
      resetForm();
    }
  }, [editingSession]);

  function resetForm() {
    setTopicId("");
    setDate(getTodayStr());
    setHoursStudied(1);
    setDifficultyRating(3);
    setNotes("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!topicId || hoursStudied <= 0) return;

    const selectedTopic = topicOptions.find((t) => t.id === topicId);
    if (!selectedTopic) return;

    onSubmit({
      topicId,
      topicName: selectedTopic.name,
      categoryName: selectedTopic.category,
      date,
      hoursStudied,
      difficultyRating,
      notes,
    });

    if (!isEditing) resetForm();
  }

  const grouped = groupByCategory(topicOptions);

  const inputClasses = "w-full bg-bg-primary border border-border-primary rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors duration-150";
  const labelClasses = "text-xs font-medium text-text-secondary mb-1.5 block";

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-border-primary bg-bg-surface/50 p-5"
    >
      <h3 className="text-sm font-semibold text-text-primary mb-4">
        {isEditing ? "Edit Session" : "Log Study Session"}
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Topic */}
        <div>
          <label htmlFor="session-topic" className={labelClasses}>Topic</label>
          <select
            id="session-topic"
            value={topicId}
            onChange={(e) => setTopicId(e.target.value)}
            className={inputClasses}
            required
          >
            <option value="" disabled>Select a topic...</option>
            {Object.entries(grouped).map(([category, topics]) => (
              <optgroup key={category} label={category}>
                {topics.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        {/* Date */}
        <div>
          <label htmlFor="session-date" className={labelClasses}>Study Date</label>
          <input
            id="session-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={`${inputClasses} [color-scheme:dark]`}
            required
          />
        </div>

        {/* Hours */}
        <div>
          <label htmlFor="session-hours" className={labelClasses}>Hours Studied</label>
          <input
            id="session-hours"
            type="number"
            min={0.5}
            max={24}
            step={0.5}
            value={hoursStudied}
            onChange={(e) => setHoursStudied(parseFloat(e.target.value) || 0)}
            className={inputClasses}
            required
          />
        </div>

        {/* Difficulty */}
        <div>
          <label className={labelClasses}>How difficult was it?</label>
          <div className="pt-1">
            <DifficultyRating
              value={difficultyRating}
              onChange={(v) => setDifficultyRating(v as 1 | 2 | 3 | 4 | 5)}
              size="md"
            />
          </div>
        </div>

        {/* Notes — full width */}
        <div className="sm:col-span-2">
          <label htmlFor="session-notes" className={labelClasses}>Notes (optional)</label>
          <textarea
            id="session-notes"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="What did you learn? Any struggles?"
            className={`${inputClasses} resize-none`}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 mt-4">
        <button
          type="submit"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
            bg-accent text-white hover:bg-accent-hover
            focus-ring transition-colors duration-150 cursor-pointer"
        >
          {isEditing ? <Save size={15} /> : <Plus size={15} />}
          {isEditing ? "Update Session" : "Log Session"}
        </button>
        {isEditing && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-sm font-medium text-text-secondary
              hover:text-text-primary hover:bg-bg-surface-hover
              focus-ring transition-colors duration-150 cursor-pointer"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
