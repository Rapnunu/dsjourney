import type { Project } from "../data/projects";
import { ProjectCard } from "./project-card";

interface FeaturedProjectsProps {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
}

export function FeaturedProjects({ projects, onEdit, onDelete }: FeaturedProjectsProps) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-text-primary mb-4">
        Featured Projects
      </h3>

      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border-primary bg-bg-surface/50 p-10 text-center text-sm text-text-muted">
          No portfolio projects yet.
        </div>
      )}
    </div>
  );
}
