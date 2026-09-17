"use client";

import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import CountUp from "@/components/react-bits/CountUp";
import {
  dashboardBtnPrimary,
  DashboardScrollReveal,
  EmptyState,
  SectionCard,
} from "@/components/dashboard";
import {
  getPortfolioStats,
  getRecruiterInsight,
  STATUS_CONFIG,
  type Project,
} from "@/features/portfolio/data/projects";

interface PortfolioPanelProps {
  projects: Project[];
}

function StatBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-border-subtle bg-bg-elevated px-3 py-2 text-center">
      <p className="text-lg font-semibold tabular-nums text-text-primary">
        <CountUp to={value} duration={0.8} />
      </p>
      <p className="mt-0.5 text-[10px] text-text-muted">{label}</p>
    </div>
  );
}

export function PortfolioPanel({ projects }: PortfolioPanelProps) {
  const stats = getPortfolioStats(projects);
  const insight = getRecruiterInsight(projects);
  const featured = projects.slice(0, 3);

  return (
    <DashboardScrollReveal delayMs={60}>
      <SectionCard
        title="Portfolio"
        action={
          <Link
            href="/portfolio"
            className="text-xs font-medium text-brand-teal hover:text-brand-teal/80"
          >
            View Portfolio
          </Link>
        }
      >
        {projects.length === 0 ? (
          <EmptyState
            title="No projects yet."
            description="Your portfolio is one of the biggest parts of becoming internship-ready."
            action={
              <Link href="/portfolio" className={`${dashboardBtnPrimary} inline-flex`}>
                <Plus size={15} />
                Add Project
              </Link>
            }
          />
        ) : (
          <>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <StatBox label="Total" value={stats.totalProjects} />
              <StatBox label="Completed" value={stats.completedProjects} />
              <StatBox label="In Progress" value={stats.inProgressProjects} />
              <div className="rounded-lg border border-border-subtle bg-bg-elevated px-3 py-2 text-center">
                <p className="text-lg font-semibold tabular-nums text-text-primary">
                  <CountUp
                    to={insight.portfolioStrength}
                    suffix="%"
                    duration={0.8}
                  />
                </p>
                <p className="mt-0.5 text-[10px] text-text-muted">Strength</p>
              </div>
            </div>

            <ul className="mt-4 space-y-2">
              {featured.map((project) => {
                const status = STATUS_CONFIG[project.status];
                return (
                  <li
                    key={project.id}
                    className="flex items-center justify-between gap-2 rounded-lg border border-border-subtle bg-bg-elevated px-3 py-2"
                  >
                    <span className="truncate text-sm text-text-primary">
                      {project.title}
                    </span>
                    <span className={`shrink-0 text-xs ${status.color}`}>
                      {status.label}
                    </span>
                  </li>
                );
              })}
            </ul>
          </>
        )}

        <Link
          href="/portfolio"
          className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-text-muted transition-colors hover:text-text-secondary"
        >
          View Portfolio
          <ArrowRight size={12} />
        </Link>
      </SectionCard>
    </DashboardScrollReveal>
  );
}
