"use client";

import { useState } from "react";
import { LoaderCircle, Plus, Save } from "lucide-react";
import { getLocalDateString } from "@/lib/date-only";
import { dashboardInput } from "@/components/dashboard";
import { DashboardMagnet } from "@/components/dashboard";
import { FieldError } from "@/components/ui/field-error";
import { TopicSelect } from "@/components/ui/topic-select";
import type { StudySession, TopicOption } from "../types";
import { DifficultyRating } from "./difficulty-rating";

interface SessionFormProps {
  topicOptions: TopicOption[];
  onSubmit: (session: Omit<StudySession, "id" | "createdAt">) => Promise<boolean>;
  onCancel?: () => void;
  editingSession?: StudySession | null;
}

interface SessionFormFieldsProps {
  topicOptions: TopicOption[];
  onSubmit: (session: Omit<StudySession, "id" | "createdAt">) => Promise<boolean>;
  onCancel?: () => void;
  editingSession: StudySession | null;
}

interface FieldErrors {
  topicId?: string;
  hoursStudied?: string;
  date?: string;
}

function SessionFormFields({
  topicOptions,
  onSubmit,
  onCancel,
  editingSession,
}: SessionFormFieldsProps) {
  const isEditing = editingSession !== null;
  const [topicId, setTopicId] = useState(editingSession?.topicId ?? "");
  const [date, setDate] = useState(editingSession?.date ?? getLocalDateString());
  const [hoursStudied, setHoursStudied] = useState(editingSession?.hoursStudied ?? 1);
  const [difficultyRating, setDifficultyRating] = useState<1 | 2 | 3 | 4 | 5>(
    editingSession?.difficultyRating ?? 3,
  );
  const [notes, setNotes] = useState(editingSession?.notes ?? "");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function resetForm() {
    setTopicId("");
    setDate(getLocalDateString());
    setHoursStudied(1);
    setDifficultyRating(3);
    setNotes("");
    setFieldErrors({});
  }

  function validate(): FieldErrors {
    const errors: FieldErrors = {};
    if (!topicId) errors.topicId = "Please select a topic.";
    if (!date) errors.date = "Study date is required.";
    if (hoursStudied <= 0 || hoursStudied > 24) {
      errors.hoursStudied = "Hours must be between 0.5 and 24.";
    }
    return errors;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const selectedTopic = topicOptions.find((t) => t.id === topicId);
    if (!selectedTopic) {
      setFieldErrors({ topicId: "Please select a valid topic." });
      return;
    }

    setIsSubmitting(true);
    const saved = await onSubmit({
      topicId,
      topicName: selectedTopic.name,
      categoryName: selectedTopic.category,
      date,
      hoursStudied,
      difficultyRating,
      notes,
    });
    setIsSubmitting(false);

    if (saved && !isEditing) resetForm();
  }

  const labelClasses = "mb-1.5 block text-xs font-medium text-text-secondary";
  const inputErrorClass = (hasError: boolean) =>
    hasError ? "border-danger focus:border-danger focus:ring-danger/40" : "";

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[10px] border border-border-subtle bg-bg-surface p-5"
    >
      <h3 className="text-sm font-semibold text-text-primary mb-4">
        {isEditing ? "Edit Session" : "Log Study Session"}
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="session-topic" className={labelClasses}>Topic</label>
          <TopicSelect
            id="session-topic"
            value={topicId}
            onValueChange={setTopicId}
            options={topicOptions}
            disabled={isSubmitting}
            error={Boolean(fieldErrors.topicId)}
          />
          <FieldError message={fieldErrors.topicId} />
        </div>

        <div>
          <label htmlFor="session-date" className={labelClasses}>Study Date</label>
          <input
            id="session-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={`${dashboardInput} [color-scheme:dark] ${inputErrorClass(Boolean(fieldErrors.date))}`}
            disabled={isSubmitting}
            required
          />
          <FieldError message={fieldErrors.date} />
        </div>

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
            className={`${dashboardInput} ${inputErrorClass(Boolean(fieldErrors.hoursStudied))}`}
            disabled={isSubmitting}
            required
          />
          <FieldError message={fieldErrors.hoursStudied} />
        </div>

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

        <div className="sm:col-span-2">
          <label htmlFor="session-notes" className={labelClasses}>Notes (optional)</label>
          <textarea
            id="session-notes"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="What did you learn? Any struggles?"
            className={`${dashboardInput} resize-none`}
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className="flex items-center gap-3 mt-4">
        <DashboardMagnet>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex min-w-[9rem] cursor-pointer items-center justify-center gap-2 rounded-lg bg-brand-teal px-4 py-2.5 text-sm font-semibold text-[#071016] transition-colors hover:bg-brand-teal/90 focus-ring disabled:opacity-60"
          >
            {isSubmitting ? (
              <LoaderCircle size={15} className="animate-spin" />
            ) : isEditing ? (
              <Save size={15} />
            ) : (
              <Plus size={15} />
            )}
            {isSubmitting
              ? isEditing
                ? "Saving..."
                : "Logging..."
              : isEditing
                ? "Update Session"
                : "Log Session"}
          </button>
        </DashboardMagnet>
        {isEditing && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-lg text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-surface-hover focus-ring transition-colors duration-150 cursor-pointer disabled:opacity-60"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export function SessionForm({
  topicOptions,
  onSubmit,
  onCancel,
  editingSession,
}: SessionFormProps) {
  const formKey = editingSession?.id ?? "create";

  return (
    <SessionFormFields
      key={formKey}
      topicOptions={topicOptions}
      onSubmit={onSubmit}
      onCancel={onCancel}
      editingSession={editingSession ?? null}
    />
  );
}
