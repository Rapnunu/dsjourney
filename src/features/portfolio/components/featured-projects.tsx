import { Plus } from "lucide-react";
import { dashboardBtnPrimary, EmptyState } from "@/components/dashboard";
import type { Project } from "../data/projects";
import { ProjectCard } from "./project-card";

interface FeaturedProjectsProps {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
  onAddProject: () => void;
}

export function FeaturedProjects({
  projects,
  onEdit,
  onDelete,
  onAddProject,
}: FeaturedProjectsProps) {
  return (
    <div>
      <h3 className="mb-4 text-sm font-semibold text-text-primary">
        Featured Projects
      </h3>

      {projects.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No projects yet."
          description="Build your first Data Science project and start strengthening your portfolio."
          action={
            <button
              type="button"
              onClick={onAddProject}
              className={`${dashboardBtnPrimary} inline-flex`}
            >
              <Plus size={15} />
              Add Your First Project
            </button>
          }
        />
      )}
    </div>
  );
}
