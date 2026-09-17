"use client";

import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import {
  dashboardBtnPrimary,
  dashboardCard,
  DashboardScrollReveal,
  EmptyState,
} from "@/components/dashboard";
import { CHART_COLORS, SegmentedBar } from "@/components/dashboard/charts";
import {
  getProjectStatusDistribution,
  getRecruiterInsight,
  STATUS_CONFIG,
  type Project,
} from "@/features/portfolio/data/projects";

interface PortfolioSnapshotProps {
  projects: Project[];
}

const STATUS_CHART_COLORS: Record<string, string> = {
  completed: CHART_COLORS.success,
  in_progress: CHART_COLORS.warning,
  planned: CHART_COLORS.mutedGray,
};

export function PortfolioSnapshot({ projects }: PortfolioSnapshotProps) {
  const insight = getRecruiterInsight(projects);
  const distribution = getProjectStatusDistribution(projects);

  return (
    <DashboardScrollReveal delayMs={60}>
      <div className={`${dashboardCard} p-5`}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-text-primary">Portfolio</h2>
          <Link
            href="/portfolio"
            className="text-xs font-medium text-brand-teal hover:text-brand-teal/80"
          >
            Manage
          </Link>
        </div>

        {projects.length === 0 ? (
          <EmptyState
            title="No projects yet."
            description="Build your first Data Science project and start strengthening your portfolio."
            action={
              <Link href="/portfolio" className={`${dashboardBtnPrimary} inline-flex`}>
                <Plus size={15} />
                Add Your First Project
              </Link>
            }
          />
        ) : (
          <>
            <div>
              <h3 className="mb-3 text-xs font-medium uppercase tracking-wide text-text-muted">
                Portfolio Projects
              </h3>
              <SegmentedBar
                segments={distribution.map((segment) => ({
                  id: segment.status,
                  label: segment.label,
                  count: segment.count,
                  percentage: segment.percentage,
                  color: STATUS_CHART_COLORS[segment.status],
                }))}
                totalLabel={`${projects.length} project${projects.length === 1 ? "" : "s"} total`}
                ariaLabel={`Portfolio project status distribution across ${projects.length} projects`}
              />
            </div>

            <div className="mt-5 flex items-center justify-between rounded-lg border border-border-subtle bg-bg-elevated px-3 py-2.5">
              <span className="text-sm text-text-secondary">
                Portfolio Strength
              </span>
              <span
                className="text-sm font-semibold tabular-nums text-text-primary"
                aria-label={`Portfolio strength: ${insight.portfolioStrength} percent`}
              >
                {insight.portfolioStrength}%
              </span>
            </div>

            <ul className="mt-4 space-y-2">
              {projects.slice(0, 3).map((project) => {
                const status = STATUS_CONFIG[project.status];
                return (
                  <li
                    key={project.id}
                    className="flex items-center justify-between gap-2 text-sm"
                  >
                    <span className="truncate text-text-primary">
                      {project.title}
                    </span>
                    <span className={`shrink-0 text-xs ${status.color}`}>
                      {status.label}
                    </span>
                  </li>
                );
              })}
            </ul>

            <Link
              href="/portfolio"
              className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-text-muted transition-colors hover:text-text-secondary"
            >
              View portfolio
              <ArrowRight size={12} />
            </Link>
          </>
        )}
      </div>
    </DashboardScrollReveal>
  );
}
