"use client";

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

export function ReadinessView() {
  const overallReadiness = getOverallReadiness();
  const summary = getReadinessSummary(overallReadiness);
  const categories = getCategoryReadiness();
  const gaps = getTopSkillGaps(3);
  const focusTopics = getRecommendedFocusTopics();
  const checklistItems = getInternshipChecklist();

  return (
    <div>
      <PageHeader
        title="Readiness"
        subtitle="Assess your data science internship readiness"
        icon={<Gauge size={22} />}
      />

      <div className="space-y-6">
        {/* Hero section */}
        <ReadinessHero readiness={overallReadiness} summary={summary} />

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left column — wider */}
          <div className="lg:col-span-3 space-y-6">
            <CategoryBreakdown categories={categories} />
            <RecommendedFocus topics={focusTopics} />
          </div>

          {/* Right column */}
          <div className="lg:col-span-2 space-y-6">
            <SkillGaps gaps={gaps} />
            <InternshipChecklist items={checklistItems} />
          </div>
        </div>
      </div>
    </div>
  );
}
