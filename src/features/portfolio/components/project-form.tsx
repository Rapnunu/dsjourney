"use client";

import { useState, type FormEvent } from "react";
import { LoaderCircle, Plus, Save, X } from "lucide-react";
import { dashboardInput } from "@/components/dashboard";
import { DsSelect } from "@/components/ui/ds-select";
import { FieldError } from "@/components/ui/field-error";
import type { Project, ProjectStatus } from "../data/projects";
import type { ProjectInput } from "../portfolio-provider";

interface ProjectFormProps {
  project?: Project;
  onSubmit: (project: ProjectInput) => Promise<boolean>;
  onCancel: () => void;
}

const STATUS_OPTIONS = [
  {
    value: "planned",
    label: "Planned",
    indicator: <span className="h-2 w-2 rounded-full bg-text-muted" />,
  },
  {
    value: "in_progress",
    label: "In Progress",
    indicator: <span className="h-2 w-2 rounded-full bg-brand-teal" />,
  },
  {
    value: "completed",
    label: "Completed",
    indicator: <span className="h-2 w-2 rounded-full bg-success" />,
  },
];

interface FieldErrors {
  title?: string;
  description?: string;
  startDate?: string;
}

export function ProjectForm({ project, onSubmit, onCancel }: ProjectFormProps) {
  const [title, setTitle] = useState(project?.title ?? "");
  const [description, setDescription] = useState(project?.description ?? "");
  const [status, setStatus] = useState<ProjectStatus>(project?.status ?? "planned");
  const [technologies, setTechnologies] = useState(
    project?.technologies.join(", ") ?? "",
  );
  const [githubUrl, setGithubUrl] = useState(project?.githubUrl ?? "");
  const [demoUrl, setDemoUrl] = useState(project?.demoUrl ?? "");
  const [highlights, setHighlights] = useState(
    project?.highlights.join("\n") ?? "",
  );
  const [startDate, setStartDate] = useState(project?.startDate ?? "");
  const [endDate, setEndDate] = useState(project?.endDate ?? "");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const labelClasses = "mb-1.5 block text-xs font-medium text-text-secondary";

  function validate(): FieldErrors {
    const errors: FieldErrors = {};
    if (!title.trim()) errors.title = "Project title is required.";
    if (!description.trim()) errors.description = "Description is required.";
    if (!startDate) errors.startDate = "Start date is required.";
    return errors;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      if (errors.title) {
        document.getElementById("project-title")?.focus();
      } else if (errors.description) {
        document.getElementById("project-description")?.focus();
      } else if (errors.startDate) {
        document.getElementById("project-start-date")?.focus();
      }
      return;
    }

    setIsSubmitting(true);
    const saved = await onSubmit({
      title: title.trim(),
      description: description.trim(),
      status,
      technologies: technologies
        .split(",")
        .map((technology) => technology.trim())
        .filter(Boolean),
      githubUrl: githubUrl.trim() || undefined,
      demoUrl: demoUrl.trim() || undefined,
      highlights: highlights
        .split("\n")
        .map((highlight) => highlight.trim())
        .filter(Boolean),
      startDate,
      endDate: endDate || undefined,
    });
    setIsSubmitting(false);
    if (!saved) return;
  }

  const isEditing = project !== undefined;
  const inputErrorClass = (hasError: boolean) =>
    hasError ? "border-danger focus:border-danger focus:ring-danger/40" : "";

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[10px] border border-border-subtle bg-bg-surface p-5"
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-text-primary">
          {isEditing ? "Edit Project" : "Add Project"}
        </h3>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="rounded-md p-1 text-text-muted hover:bg-bg-surface-hover hover:text-text-primary focus-ring disabled:opacity-60"
          aria-label="Close project form"
        >
          <X size={16} />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="project-title" className={labelClasses}>Title</label>
          <input
            id="project-title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className={`${dashboardInput} ${inputErrorClass(Boolean(fieldErrors.title))}`}
            disabled={isSubmitting}
          />
          <FieldError message={fieldErrors.title} />
        </div>
        <div>
          <label htmlFor="project-status" className={labelClasses}>Status</label>
          <DsSelect
            id="project-status"
            value={status}
            onValueChange={(value) => setStatus(value as ProjectStatus)}
            options={STATUS_OPTIONS}
            disabled={isSubmitting}
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="project-description" className={labelClasses}>Description</label>
          <textarea
            id="project-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={3}
            className={`${dashboardInput} resize-none ${inputErrorClass(Boolean(fieldErrors.description))}`}
            disabled={isSubmitting}
          />
          <FieldError message={fieldErrors.description} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="project-technologies" className={labelClasses}>Technologies (comma separated)</label>
          <input
            id="project-technologies"
            value={technologies}
            onChange={(event) => setTechnologies(event.target.value)}
            placeholder="Python, SQL, React"
            className={dashboardInput}
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label htmlFor="project-github" className={labelClasses}>GitHub URL</label>
          <input
            id="project-github"
            type="url"
            value={githubUrl}
            onChange={(event) => setGithubUrl(event.target.value)}
            className={dashboardInput}
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label htmlFor="project-demo" className={labelClasses}>Live Demo URL</label>
          <input
            id="project-demo"
            type="url"
            value={demoUrl}
            onChange={(event) => setDemoUrl(event.target.value)}
            className={dashboardInput}
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label htmlFor="project-start-date" className={labelClasses}>Start Date</label>
          <input
            id="project-start-date"
            type="date"
            value={startDate}
            onChange={(event) => setStartDate(event.target.value)}
            className={`${dashboardInput} [color-scheme:dark] ${inputErrorClass(Boolean(fieldErrors.startDate))}`}
            disabled={isSubmitting}
          />
          <FieldError message={fieldErrors.startDate} />
        </div>
        <div>
          <label htmlFor="project-end-date" className={labelClasses}>End Date</label>
          <input
            id="project-end-date"
            type="date"
            value={endDate}
            onChange={(event) => setEndDate(event.target.value)}
            className={`${dashboardInput} [color-scheme:dark]`}
            disabled={isSubmitting}
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="project-highlights" className={labelClasses}>Highlights (one per line)</label>
          <textarea
            id="project-highlights"
            value={highlights}
            onChange={(event) => setHighlights(event.target.value)}
            rows={3}
            className={`${dashboardInput} resize-none`}
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex min-w-[9rem] items-center justify-center gap-2 rounded-lg bg-brand-teal px-4 py-2.5 text-sm font-semibold text-[#071016] transition-colors hover:bg-brand-teal/90 focus-ring disabled:opacity-60"
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
              : "Adding..."
            : isEditing
              ? "Save Changes"
              : "Add Project"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="rounded-lg px-4 py-2 text-sm font-medium text-text-secondary hover:bg-bg-surface-hover hover:text-text-primary focus-ring disabled:opacity-60"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
