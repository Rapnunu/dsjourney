"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { FolderKanban, Plus } from "lucide-react";
import { PortfolioOverview } from "./portfolio-overview";
import { FeaturedProjects } from "./featured-projects";
import { SkillsDemonstrated } from "./skills-demonstrated";
import { RecruiterView } from "./recruiter-view";
import { ProjectForm } from "./project-form";
import {
  getPortfolioStats,
  getUniqueTechnologies,
  getRecruiterInsight,
  type Project,
} from "../data/projects";
import { usePortfolioStore, type ProjectInput } from "../portfolio-provider";

export function PortfolioView() {
  const {
    projects,
    isHydrated,
    addProject,
    updateProject,
    deleteProject,
  } = usePortfolioStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const stats = useMemo(() => getPortfolioStats(projects), [projects]);
  const technologies = useMemo(
    () => getUniqueTechnologies(projects),
    [projects],
  );
  const insight = useMemo(() => getRecruiterInsight(projects), [projects]);

  function openAddForm() {
    setEditingProject(null);
    setIsFormOpen(true);
  }

  function openEditForm(project: Project) {
    setEditingProject(project);
    setIsFormOpen(true);
  }

  function closeForm() {
    setEditingProject(null);
    setIsFormOpen(false);
  }

  function handleSubmit(project: ProjectInput) {
    if (editingProject) {
      updateProject(editingProject.id, project);
    } else {
      addProject(project);
    }
    closeForm();
  }

  function handleDelete(project: Project) {
    if (window.confirm(`Delete "${project.title}"?`)) {
      deleteProject(project.id);
      if (editingProject?.id === project.id) closeForm();
    }
  }

  return (
    <div>
      <PageHeader
        title="Portfolio"
        subtitle="Showcase your projects and achievements"
        icon={<FolderKanban size={22} />}
      />

      {!isHydrated ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-[74px] animate-pulse rounded-xl border border-border-subtle bg-bg-surface/50" />
          ))}
        </div>
      ) : (
      <div className="space-y-6">
        {/* Overview KPI cards */}
        <PortfolioOverview stats={stats} />

        <div className="flex justify-end">
          <button onClick={openAddForm} className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover focus-ring">
            <Plus size={15} />
            Add Project
          </button>
        </div>

        {isFormOpen && (
          <ProjectForm
            key={editingProject?.id ?? "new-project"}
            project={editingProject ?? undefined}
            onSubmit={handleSubmit}
            onCancel={closeForm}
          />
        )}

        {/* Featured projects grid */}
        <FeaturedProjects
          projects={projects}
          onEdit={openEditForm}
          onDelete={handleDelete}
        />

        {/* Skills + Recruiter View row */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2">
            <SkillsDemonstrated technologies={technologies} />
          </div>
          <div className="lg:col-span-3">
            <RecruiterView insight={insight} />
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
