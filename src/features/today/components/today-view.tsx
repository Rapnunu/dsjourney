"use client";

import { WelcomeHeader } from "./welcome-header";
import { QuickStats } from "./quick-stats";
import { RecommendedTopic } from "./recommended-topic";
import { DueForReview } from "./due-for-review";
import { TodaysGoals } from "./todays-goals";
import { QuickActions } from "./quick-actions";
import { getDashboardStats, getRecommendedTopic, getReviewTopics } from "../data";

export function TodayView() {
  const stats = getDashboardStats();
  const recommendedTopic = getRecommendedTopic();
  const reviewTopics = getReviewTopics();

  return (
    <div>
      <WelcomeHeader />

      <div className="space-y-6">
        <QuickStats stats={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left column */}
          <div className="lg:col-span-3 space-y-6">
            <RecommendedTopic topic={recommendedTopic} />
            <DueForReview topics={reviewTopics} />
          </div>

          {/* Right column */}
          <div className="lg:col-span-2 space-y-6">
            <TodaysGoals />
            <QuickActions />
          </div>
        </div>
      </div>
    </div>
  );
}
