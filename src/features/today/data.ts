import { mockRoadmapData } from "../roadmap/data";
import { MASTERY_WEIGHTS, MASTERY_REMAINING_FACTOR } from "../roadmap/types";
import type { MasteryLevel } from "../roadmap/types";
import { mockSessions } from "../sessions/data";

export interface DashboardStats {
  overallReadiness: number;
  studyStreak: number;
  hoursThisWeek: number;
  totalSessions: number;
}

export interface RecommendedTopic {
  topicName: string;
  categoryName: string;
  estimatedHours: number;
  reason: string;
  topicId: string;
}

export interface ReviewTopic {
  topicId: string;
  topicName: string;
  categoryName: string;
  lastStudied: string;
  mastery: MasteryLevel;
}

export interface TodayGoal {
  id: string;
  label: string;
  completed: boolean;
}

// Compute overall readiness from roadmap data
export function computeReadiness(): number {
  const allTopics = mockRoadmapData.flatMap((c) => c.topics);
  if (allTopics.length === 0) return 0;
  const sum = allTopics.reduce((acc, t) => acc + MASTERY_WEIGHTS[t.mastery], 0);
  return Math.round((sum / allTopics.length) * 100);
}

// Compute study streak (consecutive days with sessions ending at today or yesterday)
export function computeStreak(): number {
  const today = new Date("2026-07-22"); // Mock "today"
  const sessionDates = new Set(mockSessions.map((s) => s.date));
  let streak = 0;
  let checkDate = new Date(today);

  // If no session today, start checking from yesterday
  const todayStr = checkDate.toISOString().split("T")[0];
  if (!sessionDates.has(todayStr)) {
    checkDate.setDate(checkDate.getDate() - 1);
  }

  while (true) {
    const dateStr = checkDate.toISOString().split("T")[0];
    if (sessionDates.has(dateStr)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

// Hours studied in the last 7 days
export function computeWeeklyHours(): number {
  const today = new Date("2026-07-22");
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekAgoStr = weekAgo.toISOString().split("T")[0];

  return parseFloat(
    mockSessions
      .filter((s) => s.date >= weekAgoStr)
      .reduce((sum, s) => sum + s.hoursStudied, 0)
      .toFixed(1)
  );
}

// Get dashboard stats
export function getDashboardStats(): DashboardStats {
  return {
    overallReadiness: computeReadiness(),
    studyStreak: computeStreak(),
    hoursThisWeek: computeWeeklyHours(),
    totalSessions: mockSessions.length,
  };
}

// Get recommended next topic: pick from the lowest-readiness category,
// choosing the first non-mastered topic
export function getRecommendedTopic(): RecommendedTopic | null {
  const categoryReadiness = mockRoadmapData.map((cat) => {
    const avg =
      cat.topics.length > 0
        ? cat.topics.reduce((sum, t) => sum + MASTERY_WEIGHTS[t.mastery], 0) /
          cat.topics.length
        : 1;
    return { category: cat, readiness: avg };
  });

  // Sort by readiness ascending
  categoryReadiness.sort((a, b) => a.readiness - b.readiness);

  for (const { category } of categoryReadiness) {
    // Find first topic that isn't mastered, preferring not_started > learning > practiced
    const priorityOrder: MasteryLevel[] = ["not_started", "learning", "practiced"];
    for (const level of priorityOrder) {
      const topic = category.topics.find((t) => t.mastery === level);
      if (topic) {
        const reasons: Record<MasteryLevel, string> = {
          not_started: "Lowest readiness category — start here",
          learning: "Recently started — keep building momentum",
          practiced: "Almost there — push to mastery",
          mastered: "",
        };
        return {
          topicName: topic.name,
          categoryName: category.name,
          estimatedHours: topic.estimatedHours,
          reason: reasons[level],
          topicId: topic.id,
        };
      }
    }
  }
  return null;
}

// Get topics due for review: mastery is learning/practiced but lastStudied > 5 days ago
export function getReviewTopics(): ReviewTopic[] {
  const today = new Date("2026-07-22");
  const cutoff = new Date(today);
  cutoff.setDate(cutoff.getDate() - 5);
  const cutoffStr = cutoff.toISOString().split("T")[0];

  const results: ReviewTopic[] = [];

  for (const cat of mockRoadmapData) {
    for (const topic of cat.topics) {
      if (
        (topic.mastery === "learning" || topic.mastery === "practiced") &&
        topic.lastStudied &&
        topic.lastStudied <= cutoffStr
      ) {
        results.push({
          topicId: topic.id,
          topicName: topic.name,
          categoryName: cat.name,
          lastStudied: topic.lastStudied,
          mastery: topic.mastery,
        });
      }
    }
  }

  // Sort by lastStudied ascending (oldest first)
  results.sort((a, b) => a.lastStudied.localeCompare(b.lastStudied));
  return results.slice(0, 5);
}

// Mock today's goals
export const mockGoals: TodayGoal[] = [
  { id: "g-1", label: "Study for 2 hours", completed: true },
  { id: "g-2", label: "Complete 1 roadmap topic", completed: false },
  { id: "g-3", label: "Log a study session", completed: true },
  { id: "g-4", label: "Review 1 weak topic", completed: false },
  { id: "g-5", label: "Practice SQL queries", completed: false },
];
