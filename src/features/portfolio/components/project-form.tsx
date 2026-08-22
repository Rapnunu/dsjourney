"use client";

import { useState, type FormEvent } from "react";
import { Plus, Save, X } from "lucide-react";
import type { Project, ProjectStatus } from "../data/projects";
import type { ProjectInput } from "../portfolio-provider";

interface ProjectFormProps {
  project?: Project;
  onSubmit: (project: ProjectInput) => void;
  onCancel: () => void;
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

  const inputClasses =
    "w-full rounded-lg border border-border-primary bg-bg-primary px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors";
  const labelClasses = "mb-1.5 block text-xs font-medium text-text-secondary";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit({
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
  }

  const isEditing = project !== undefined;

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-border-primary bg-bg-surface/50 p-5"
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-text-primary">
          {isEditing ? "Edit Project" : "Add Project"}
        </h3>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md p-1 text-text-muted hover:bg-bg-surface-hover hover:text-text-primary focus-ring"
          aria-label="Close project form"
        >
          <X size={16} />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="project-title" className={labelClasses}>Title</label>
          <input id="project-title" value={title} onChange={(event) => setTitle(event.target.value)} className={inputClasses} required />
        </div>
        <div>
          <label htmlFor="project-status" className={labelClasses}>Status</label>
          <select id="project-status" value={status} onChange={(event) => setStatus(event.target.value as ProjectStatus)} className={inputClasses}>
            <option value="planned">Planned</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="project-description" className={labelClasses}>Description</label>
          <textarea id="project-description" value={description} onChange={(event) => setDescription(event.target.value)} rows={3} className={`${inputClasses} resize-none`} required />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="project-technologies" className={labelClasses}>Technologies (comma separated)</label>
          <input id="project-technologies" value={technologies} onChange={(event) => setTechnologies(event.target.value)} placeholder="Python, SQL, React" className={inputClasses} />
        </div>
        <div>
          <label htmlFor="project-github" className={labelClasses}>GitHub URL</label>
          <input id="project-github" type="url" value={githubUrl} onChange={(event) => setGithubUrl(event.target.value)} className={inputClasses} />
        </div>
        <div>
          <label htmlFor="project-demo" className={labelClasses}>Live Demo URL</label>
          <input id="project-demo" type="url" value={demoUrl} onChange={(event) => setDemoUrl(event.target.value)} className={inputClasses} />
        </div>
        <div>
          <label htmlFor="project-start-date" className={labelClasses}>Start Date</label>
          <input id="project-start-date" type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} className={`${inputClasses} [color-scheme:dark]`} required />
        </div>
        <div>
          <label htmlFor="project-end-date" className={labelClasses}>End Date</label>
          <input id="project-end-date" type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} className={`${inputClasses} [color-scheme:dark]`} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="project-highlights" className={labelClasses}>Highlights (one per line)</label>
          <textarea id="project-highlights" value={highlights} onChange={(event) => setHighlights(event.target.value)} rows={3} className={`${inputClasses} resize-none`} />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button type="submit" className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover focus-ring">
          {isEditing ? <Save size={15} /> : <Plus size={15} />}
          {isEditing ? "Update Project" : "Add Project"}
        </button>
        <button type="button" onClick={onCancel} className="rounded-lg px-4 py-2 text-sm font-medium text-text-secondary hover:bg-bg-surface-hover hover:text-text-primary focus-ring">
          Cancel
        </button>
      </div>
    </form>
  );
}
