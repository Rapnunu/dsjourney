import {
  computeStudyStreak,
  getCurrentWeekDatesLocal,
  getLocalDateString,
} from "@/lib/date-only";
import { MASTERY_WEIGHTS } from "../roadmap/types";
import type { RoadmapCategory } from "../roadmap/types";
import type { StudySession } from "../sessions/types";

export interface KpiStats {
  totalHours: number;
  totalSessions: number;
  currentStreak: number;
  avgDifficulty: number;
}

export interface CategoryHours {
  category: string;
  hours: number;
  percentage: number;
  color: string;
}

export interface DailyActivity {
  day: string;
  date: string;
  hours: number;
}

export interface DifficultTopic {
  topicName: string;
  category: string;
  avgDifficulty: number;
}

export interface ProgressComparison {
  category: string;
  hoursStudied: number;
  roadmapProgress: number;
  color: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  Python: "indigo",
  SQL: "sky",
  Statistics: "violet",
  "Machine Learning": "rose",
  "Git & GitHub": "emerald",
};

export function getKpiStats(sessions: StudySession[]): KpiStats {
  const totalHours = parseFloat(
    sessions.reduce((sum, s) => sum + s.hoursStudied, 0).toFixed(1),
  );
  const totalSessions = sessions.length;
  const sessionDates = new Set(sessions.map((s) => s.date));
  const streak = computeStudyStreak(sessionDates);

  const avgDifficulty =
    totalSessions > 0
      ? parseFloat(
          (
            sessions.reduce((sum, s) => sum + s.difficultyRating, 0) /
            totalSessions
          ).toFixed(1),
        )
      : 0;

  return { totalHours, totalSessions, currentStreak: streak, avgDifficulty };
}

export function getCategoryHours(sessions: StudySession[]): CategoryHours[] {
  const hourMap = new Map<string, number>();
  for (const s of sessions) {
    hourMap.set(s.categoryName, (hourMap.get(s.categoryName) ?? 0) + s.hoursStudied);
  }

  const totalHours = [...hourMap.values()].reduce((a, b) => a + b, 0);
  const orderedCategories = ["Python", "SQL", "Statistics", "Machine Learning", "Git & GitHub"];

  return orderedCategories.map((cat) => {
    const hours = parseFloat((hourMap.get(cat) ?? 0).toFixed(1));
    return {
      category: cat,
      hours,
      percentage: totalHours > 0 ? Math.round((hours / totalHours) * 100) : 0,
      color: CATEGORY_COLORS[cat] ?? "zinc",
    };
  });
}

export function getWeeklyActivity(sessions: StudySession[]): DailyActivity[] {
  const sessionHoursByDate = new Map<string, number>();
  for (const s of sessions) {
    sessionHoursByDate.set(s.date, (sessionHoursByDate.get(s.date) ?? 0) + s.hoursStudied);
  }

  return getCurrentWeekDatesLocal().map(({ day, date }) => ({
    day,
    date,
    hours: parseFloat((sessionHoursByDate.get(date) ?? 0).toFixed(1)),
  }));
}

export function getDifficultTopics(sessions: StudySession[]): DifficultTopic[] {
  const topicMap = new Map<string, { categoryName: string; totalDiff: number; count: number }>();

  for (const s of sessions) {
    const existing = topicMap.get(s.topicName);
    if (existing) {
      existing.totalDiff += s.difficultyRating;
      existing.count++;
    } else {
      topicMap.set(s.topicName, {
        categoryName: s.categoryName,
        totalDiff: s.difficultyRating,
        count: 1,
      });
    }
  }

  const topics: DifficultTopic[] = [...topicMap.entries()].map(([name, data]) => ({
    topicName: name,
    category: data.categoryName,
    avgDifficulty: parseFloat((data.totalDiff / data.count).toFixed(1)),
  }));

  topics.sort((a, b) => b.avgDifficulty - a.avgDifficulty);
  return topics;
}

export function getProgressComparison(
  sessions: StudySession[],
  roadmap: RoadmapCategory[],
): ProgressComparison[] {
  const hourMap = new Map<string, number>();
  for (const s of sessions) {
    hourMap.set(s.categoryName, (hourMap.get(s.categoryName) ?? 0) + s.hoursStudied);
  }

  return roadmap.map((cat) => {
    const readiness =
      cat.topics.length > 0
        ? Math.round(
            (cat.topics.reduce((sum, t) => sum + MASTERY_WEIGHTS[t.mastery], 0) /
              cat.topics.length) *
              100,
          )
        : 0;

    return {
      category: cat.name,
      hoursStudied: parseFloat((hourMap.get(cat.name) ?? 0).toFixed(1)),
      roadmapProgress: readiness,
      color: CATEGORY_COLORS[cat.name] ?? "zinc",
    };
  });
}

export function getTodayDateString(): string {
  return getLocalDateString();
}
