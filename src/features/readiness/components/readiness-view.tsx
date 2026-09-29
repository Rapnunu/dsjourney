"use client";

import { DashboardScrollReveal } from "@/components/dashboard";
import { PageHeader } from "@/components/ui/page-header";
import { Gauge } from "lucide-react";
import { ReadinessHero } from "./readiness-hero";
import { CategoryBreakdown } from "./category-breakdown";
import { SkillGaps } from "./skill-gaps";
import { RecommendedFocus } from "./recommended-focus";
import { InternshipChecklist } from "./internship-checklist";
import {
  getOverallReadiness,
  getReadinessSummary,
  getCategoryReadiness,
  getTopSkillGaps,
  getRecommendedFocusTopics,
  getInternshipChecklist,
} from "../data";
import { useRoadmapStore } from "@/features/roadmap/roadmap-provider";
import { usePortfolioStore } from "@/features/portfolio/portfolio-provider";

function ReadinessViewSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-48 animate-pulse rounded-[10px] border border-border-subtle bg-bg-surface/60" />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="h-64 animate-pulse rounded-[10px] border border-border-subtle bg-bg-surface/60 lg:col-span-3" />
        <div className="h-64 animate-pulse rounded-[10px] border border-border-subtle bg-bg-surface/60 lg:col-span-2" />
      </div>
    </div>
  );
}

export function ReadinessView() {
  const { roadmap, isHydrated: roadmapHydrated } = useRoadmapStore();
  const { projects, isHydrated: portfolioHydrated } = usePortfolioStore();
  const isHydrated = roadmapHydrated && portfolioHydrated;
  const overallReadiness = getOverallReadiness(roadmap, projects);
  const summary = getReadinessSummary(overallReadiness);
  const categories = getCategoryReadiness(roadmap, projects);
  const gaps = getTopSkillGaps(roadmap, projects, 3);
  const focusTopics = getRecommendedFocusTopics(roadmap, projects);
  const checklistItems = getInternshipChecklist(roadmap, projects);

  return (
    <div>
      <PageHeader
        title="Readiness"
        subtitle="See how close you are to internship-ready."
        icon={<Gauge size={22} />}
      />

      {!isHydrated ? (
        <ReadinessViewSkeleton />
      ) : (
      <div className="space-y-6">
        {/* Hero section */}
        <ReadinessHero readiness={overallReadiness} summary={summary} />

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left column — wider */}
          <div className="space-y-6 lg:col-span-3">
            <DashboardScrollReveal>
              <CategoryBreakdown categories={categories} />
            </DashboardScrollReveal>
            <DashboardScrollReveal delayMs={60}>
              <RecommendedFocus topics={focusTopics} />
            </DashboardScrollReveal>
          </div>

          <div className="space-y-6 lg:col-span-2">
            <DashboardScrollReveal>
              <SkillGaps gaps={gaps} />
            </DashboardScrollReveal>
            <DashboardScrollReveal delayMs={60}>
              <InternshipChecklist items={checklistItems} />
            </DashboardScrollReveal>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
