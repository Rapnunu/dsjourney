"use client";

import { PageHeader } from "@/components/ui/page-header";
import { BarChart3 } from "lucide-react";
import { KpiCards } from "./kpi-cards";
import { HoursByCategory } from "./hours-by-category";
import { WeeklyActivity } from "./weekly-activity";
import { DifficultTopics } from "./difficult-topics";
import { ProgressVsTime } from "./progress-vs-time";
import {
  getKpiStats,
  getCategoryHours,
  getWeeklyActivity,
  getDifficultTopics,
  getProgressComparison,
} from "../data";

export function AnalyticsView() {
  const kpiStats = getKpiStats();
  const categoryHours = getCategoryHours();
  const weeklyActivity = getWeeklyActivity();
  const difficultTopics = getDifficultTopics();
  const progressData = getProgressComparison();

  return (
    <div>
      <PageHeader
        title="Analytics"
        subtitle="Insights into your preparation progress"
        icon={<BarChart3 size={22} />}
      />

      <div className="space-y-6">
        {/* KPI cards */}
        <KpiCards stats={kpiStats} />

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3">
            <HoursByCategory categories={categoryHours} />
          </div>
          <div className="lg:col-span-2">
            <WeeklyActivity days={weeklyActivity} />
          </div>
        </div>

        {/* Tables row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DifficultTopics topics={difficultTopics} />
          <ProgressVsTime data={progressData} />
        </div>
      </div>
    </div>
  );
}
