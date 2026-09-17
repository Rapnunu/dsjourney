import { Code2 } from "lucide-react";
import { getTechColor } from "../data/projects";

interface SkillsDemonstratedProps {
  technologies: string[];
}

export function SkillsDemonstrated({ technologies }: SkillsDemonstratedProps) {
  return (
    <div className="rounded-[10px] border border-border-subtle bg-bg-surface p-5">
      <div className="flex items-center gap-2 mb-4">
        <Code2 size={16} className="text-accent" />
        <h3 className="text-sm font-semibold text-text-primary">
          Skills Demonstrated
        </h3>
        <span className="text-xs text-text-muted ml-auto">
          {technologies.length} technologies
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {technologies.map((tech) => {
          const colors = getTechColor(tech);
          return (
            <span
              key={tech}
              className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium ${colors.bg} ${colors.text} transition-transform duration-150 hover:scale-105`}
            >
              {tech}
            </span>
          );
        })}
      </div>
    </div>
  );
}
