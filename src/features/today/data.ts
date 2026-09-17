import {
  addDaysLocal,
  computeStudyStreak,
  getLocalDateString,
  getMondayOfWeekLocal,
} from "@/lib/date-only";
import { MASTERY_CONFIG, MASTERY_WEIGHTS } from "../roadmap/types";
import type { MasteryLevel, RoadmapCategory } from "../roadmap/types";
import type { StudySession } from "../sessions/types";

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

export interface MasteryDistributionSegment {
  level: MasteryLevel;
  label: string;
  count: number;
  percentage: number;
}

const MASTERY_LEVEL_ORDER: MasteryLevel[] = [
  "not_started",
  "learning",
  "practiced",
  "mastered",
];

export function getMasteryDistribution(
  roadmap: RoadmapCategory[],
): MasteryDistributionSegment[] {
  const allTopics = roadmap.flatMap((category) => category.topics);
  const total = allTopics.length;

  return MASTERY_LEVEL_ORDER.map((level) => {
    const count = allTopics.filter((topic) => topic.mastery === level).length;
    return {
      level,
      label: MASTERY_CONFIG[level].label,
      count,
      percentage: total > 0 ? (count / total) * 100 : 0,
    };
  });
}

export function getRecentSessions(
  sessions: StudySession[],
  count = 3,
): StudySession[] {
  return [...sessions]
    .sort((a, b) => {
      const dateCompare = b.date.localeCompare(a.date);
      if (dateCompare !== 0) return dateCompare;
      return b.createdAt.localeCompare(a.createdAt);
    })
    .slice(0, count);
}

export function computeReadiness(roadmap: RoadmapCategory[]): number {
  const allTopics = roadmap.flatMap((c) => c.topics);
  if (allTopics.length === 0) return 0;
  const sum = allTopics.reduce((acc, t) => acc + MASTERY_WEIGHTS[t.mastery], 0);
  return Math.round((sum / allTopics.length) * 100);
}

export function computeStreak(sessions: StudySession[]): number {
  const sessionDates = new Set(sessions.map((s) => s.date));
  return computeStudyStreak(sessionDates);
}

export function computeWeeklyHours(sessions: StudySession[]): number {
  const monday = getMondayOfWeekLocal();
  const sunday = addDaysLocal(monday, 6);
  const mondayStr = getLocalDateString(monday);
  const sundayStr = getLocalDateString(sunday);

  return parseFloat(
    sessions
      .filter((s) => s.date >= mondayStr && s.date <= sundayStr)
      .reduce((sum, s) => sum + s.hoursStudied, 0)
      .toFixed(1),
  );
}

export function getDashboardStats(
  sessions: StudySession[],
  roadmap: RoadmapCategory[],
): DashboardStats {
  return {
    overallReadiness: computeReadiness(roadmap),
    studyStreak: computeStreak(sessions),
    hoursThisWeek: computeWeeklyHours(sessions),
    totalSessions: sessions.length,
  };
}

export function getRecommendedTopic(
  roadmap: RoadmapCategory[],
): RecommendedTopic | null {
  const categoryReadiness = roadmap.map((cat) => {
    const avg =
      cat.topics.length > 0
        ? cat.topics.reduce((sum, t) => sum + MASTERY_WEIGHTS[t.mastery], 0) /
          cat.topics.length
        : 1;
    return { category: cat, readiness: avg };
  });

  categoryReadiness.sort((a, b) => a.readiness - b.readiness);

  for (const { category } of categoryReadiness) {
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

export function getReviewTopics(roadmap: RoadmapCategory[]): ReviewTopic[] {
  const cutoff = addDaysLocal(new Date(), -5);
  const cutoffStr = getLocalDateString(cutoff);

  const results: ReviewTopic[] = [];

  for (const cat of roadmap) {
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

  results.sort((a, b) => a.lastStudied.localeCompare(b.lastStudied));
  return results.slice(0, 5);
}

export const mockGoals: TodayGoal[] = [
  { id: "g-1", label: "Study for 2 hours", completed: true },
  { id: "g-2", label: "Complete 1 roadmap topic", completed: false },
  { id: "g-3", label: "Log a study session", completed: true },
  { id: "g-4", label: "Review 1 weak topic", completed: false },
  { id: "g-5", label: "Practice SQL queries", completed: false },
];
