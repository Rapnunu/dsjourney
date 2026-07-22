"use client";

import { PageHeader } from "@/components/ui/page-header";
import { FolderKanban } from "lucide-react";
import { PortfolioOverview } from "./portfolio-overview";
import { FeaturedProjects } from "./featured-projects";
import { SkillsDemonstrated } from "./skills-demonstrated";
import { RecruiterView } from "./recruiter-view";
import {
  mockProjects,
  getPortfolioStats,
  getUniqueTechnologies,
  getRecruiterInsight,
} from "../data/projects";

export function PortfolioView() {
  const stats = getPortfolioStats();
  const technologies = getUniqueTechnologies();
  const insight = getRecruiterInsight();

  return (
    <div>
      <PageHeader
        title="Portfolio"
        subtitle="Showcase your projects and achievements"
        icon={<FolderKanban size={22} />}
      />

      <div className="space-y-6">
        {/* Overview KPI cards */}
        <PortfolioOverview stats={stats} />

        {/* Featured projects grid */}
        <FeaturedProjects projects={mockProjects} />

        {/* Skills + Recruiter View row */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2">
            <SkillsDemonstrated technologies={technologies} />
          </div>
          <div className="lg:col-span-3">
            <RecruiterView insight={insight} />
          </div>
        </div>
      </div>
    </div>
  );
}
