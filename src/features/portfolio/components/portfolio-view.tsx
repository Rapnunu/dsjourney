"use client";

import { useMemo, useState } from "react";
import { DashboardMagnet, DashboardScrollReveal } from "@/components/dashboard";
import { PageHeader } from "@/components/ui/page-header";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { ProviderErrorBanner } from "@/components/ui/provider-error-banner";
import { FolderKanban, Plus } from "lucide-react";
import { showFriendlyError, showSuccessToast } from "@/lib/toast";
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
    error,
    reload,
    addProject,
    updateProject,
    deleteProject,
  } = usePortfolioStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  async function handleSubmit(project: ProjectInput) {
    if (editingProject) {
      const saved = await updateProject(editingProject.id, project);
      if (saved) {
        showSuccessToast("Project updated", "Your portfolio project was saved.");
        closeForm();
      } else {
        showFriendlyError(new Error("save failed"), "update", {
          title: "Couldn't save project",
          description:
            "Something went wrong while saving your changes. Please try again.",
        });
      }
      return saved;
    }

    const saved = await addProject(project);
    if (saved) {
      showSuccessToast("Project added", "Your new project is now in your portfolio.");
      closeForm();
    } else {
      showFriendlyError(new Error("save failed"), "save", {
        title: "Couldn't save project",
        description:
          "Something went wrong while saving your changes. Please try again.",
      });
    }
    return saved;
  }

  function requestDelete(project: Project) {
    setDeleteTarget(project);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;

    setIsDeleting(true);
    const deleted = await deleteProject(deleteTarget.id);
    setIsDeleting(false);

    if (deleted) {
      showSuccessToast("Project deleted", `"${deleteTarget.title}" was removed.`);
      if (editingProject?.id === deleteTarget.id) closeForm();
      setDeleteTarget(null);
      return;
    }

    showFriendlyError(new Error("delete failed"), "delete", {
      title: "Couldn't delete project",
      description: "Something went wrong while deleting this project. Please try again.",
    });
  }

  return (
    <div>
      <PageHeader
        title="Portfolio"
        subtitle="Turn what you've learned into proof of skill."
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
        {error && (
          <ProviderErrorBanner
            title={error.title}
            description={error.description}
            onRetry={() => void reload()}
          />
        )}
        <PortfolioOverview stats={stats} />

        <div className="flex justify-end">
          <DashboardMagnet>
            <button onClick={openAddForm} className="inline-flex items-center gap-2 rounded-lg bg-brand-teal px-4 py-2.5 text-sm font-semibold text-[#071016] transition-colors hover:bg-brand-teal/90 focus-ring">
              <Plus size={15} />
              Add Project
            </button>
          </DashboardMagnet>
        </div>

        {isFormOpen && (
          <ProjectForm
            key={editingProject?.id ?? "new-project"}
            project={editingProject ?? undefined}
            onSubmit={handleSubmit}
            onCancel={closeForm}
          />
        )}

        <DashboardScrollReveal>
          <FeaturedProjects
            projects={projects}
            onEdit={openEditForm}
            onDelete={requestDelete}
            onAddProject={openAddForm}
          />
        </DashboardScrollReveal>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          <DashboardScrollReveal className="lg:col-span-2">
            <SkillsDemonstrated technologies={technologies} />
          </DashboardScrollReveal>
          <DashboardScrollReveal className="lg:col-span-3" delayMs={60}>
            <RecruiterView insight={insight} />
          </DashboardScrollReveal>
        </div>
      </div>
      )}

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete project?"
        description={
          deleteTarget
            ? `"${deleteTarget.title}" will be permanently removed. This action cannot be undone.`
            : ""
        }
        confirmLabel="Delete Project"
        loadingLabel="Deleting..."
        loading={isDeleting}
        onConfirm={() => void confirmDelete()}
        onCancel={() => {
          if (!isDeleting) setDeleteTarget(null);
        }}
      />
    </div>
  );
}
