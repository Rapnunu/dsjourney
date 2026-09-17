import type { ReactNode } from "react";
import { dashboardCard } from "./styles";

interface SectionCardProps {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
  padding?: "sm" | "md";
}

export function SectionCard({
  title,
  action,
  children,
  className = "",
  bodyClassName = "",
  padding = "md",
}: SectionCardProps) {
  const pad = padding === "sm" ? "p-4" : "p-5";

  return (
    <section className={`${dashboardCard} ${pad} ${className}`}>
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between gap-3">
          {title && (
            <h2 className="text-sm font-semibold text-text-primary">{title}</h2>
          )}
          {action}
        </div>
      )}
      <div className={bodyClassName}>{children}</div>
    </section>
  );
}
