import { ExternalLink } from "lucide-react";

function GithubIcon({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}
import type { Project } from "../data/projects";
import { STATUS_CONFIG, getTechColor } from "../data/projects";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const status = STATUS_CONFIG[project.status];

  return (
    <div className="group rounded-xl border border-border-primary bg-bg-surface/50 p-5 flex flex-col hover:border-border-primary/80 hover:bg-bg-surface/70 transition-colors duration-150">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <h4 className="text-base font-semibold text-text-primary group-hover:text-accent transition-colors duration-150">
          {project.title}
        </h4>
        <span
          className={`flex-shrink-0 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium ${status.bgColor} ${status.color}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${status.dotColor}`} />
          {status.label}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-text-secondary leading-relaxed mb-4 line-clamp-3">
        {project.description}
      </p>

      {/* Highlights */}
      {project.highlights.length > 0 && (
        <ul className="mb-4 space-y-1">
          {project.highlights.map((highlight, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-text-muted">
              <span className="mt-1.5 h-1 w-1 rounded-full bg-accent flex-shrink-0" />
              {highlight}
            </li>
          ))}
        </ul>
      )}

      {/* Tech badges */}
      <div className="flex flex-wrap gap-1.5 mb-4 mt-auto">
        {project.technologies.map((tech) => {
          const colors = getTechColor(tech);
          return (
            <span
              key={tech}
              className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium ${colors.bg} ${colors.text}`}
            >
              {tech}
            </span>
          );
        })}
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2 pt-3 border-t border-border-subtle">
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
              text-text-secondary bg-bg-primary/60 hover:bg-bg-primary hover:text-text-primary
              focus-ring transition-colors duration-150"
          >
            <GithubIcon size={13} />
            GitHub
          </a>
        )}
        {project.demoUrl && (
          <a
            href={project.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
              text-white bg-accent hover:bg-accent-hover
              focus-ring transition-colors duration-150"
          >
            <ExternalLink size={13} />
            Live Demo
          </a>
        )}
      </div>
    </div>
  );
}
