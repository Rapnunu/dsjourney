import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  actions?: ReactNode;
}

export function PageHeader({ title, subtitle, icon, actions }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 mb-8">
      <div className="flex items-center gap-3">
        {icon && (
          <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-accent-muted text-accent">
            {icon}
          </div>
        )}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-text-primary">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1 text-sm text-text-secondary">{subtitle}</p>
          )}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
