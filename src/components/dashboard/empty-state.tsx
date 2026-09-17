import type { ReactNode } from "react";
import { dashboardCard } from "./styles";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`${dashboardCard} border-dashed px-6 py-10 text-center ${className}`}
    >
      <p className="text-sm font-medium text-text-primary">{title}</p>
      {description && (
        <p className="mx-auto mt-2 max-w-sm text-sm text-text-secondary">
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
