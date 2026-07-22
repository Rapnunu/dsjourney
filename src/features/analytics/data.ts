import { mockSessions } from "../sessions/data";
import { mockRoadmapData } from "../roadmap/data";
import { MASTERY_WEIGHTS } from "../roadmap/types";

// ── Types ──────────────────────────────────────────────────────────────

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
  day: string;       // "Mon", "Tue", …
  date: string;      // ISO date
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
  roadmapProgress: number; // 0–100
  color: string;
}

// ── Color mapping ──────────────────────────────────────────────────────

const CATEGORY_COLORS: Record<string, string> = {
  Python: "indigo",
  SQL: "sky",
  Statistics: "violet",
  "Machine Learning": "rose",
  "Git & GitHub": "emerald",
};

// ── KPI stats ──────────────────────────────────────────────────────────

export function getKpiStats(): KpiStats {
  const totalHours = parseFloat(
    mockSessions.reduce((sum, s) => sum + s.hoursStudied, 0).toFixed(1)
  );
  const totalSessions = mockSessions.length;

  // Streak: consecutive days ending at mock "today" (2026-07-22) or yesterday
  const today = new Date("2026-07-22");
  const sessionDates = new Set(mockSessions.map((s) => s.date));
  let streak = 0;
  let checkDate = new Date(today);
  const todayStr = checkDate.toISOString().split("T")[0];
  if (!sessionDates.has(todayStr)) {
    checkDate.setDate(checkDate.getDate() - 1);
  }
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const dateStr = checkDate.toISOString().split("T")[0];
    if (sessionDates.has(dateStr)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  const avgDifficulty = parseFloat(
    (
      mockSessions.reduce((sum, s) => sum + s.difficultyRating, 0) /
      mockSessions.length
    ).toFixed(1)
  );

  return { totalHours, totalSessions, currentStreak: streak, avgDifficulty };
}

// ── Study hours by category ────────────────────────────────────────────

export function getCategoryHours(): CategoryHours[] {
  const hourMap = new Map<string, number>();
  for (const s of mockSessions) {
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

// ── Weekly activity (Mon–Sun for the current week) ─────────────────────

export function getWeeklyActivity(): DailyActivity[] {
  // Mock "today" is 2026-07-22 (Wednesday). Build Mon–Sun for that week.
  const monday = new Date("2026-07-20"); // Monday of the week
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const sessionHoursByDate = new Map<string, number>();
  for (const s of mockSessions) {
    sessionHoursByDate.set(s.date, (sessionHoursByDate.get(s.date) ?? 0) + s.hoursStudied);
  }

  return dayNames.map((day, i) => {
    const d = new Date(monday);
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split("T")[0];
    return {
      day,
      date: dateStr,
      hours: parseFloat((sessionHoursByDate.get(dateStr) ?? 0).toFixed(1)),
    };
  });
}

// ── Difficult topics ───────────────────────────────────────────────────

export function getDifficultTopics(): DifficultTopic[] {
  const topicMap = new Map<string, { categoryName: string; totalDiff: number; count: number }>();

  for (const s of mockSessions) {
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

// ── Progress vs time comparison ────────────────────────────────────────

export function getProgressComparison(): ProgressComparison[] {
  const hourMap = new Map<string, number>();
  for (const s of mockSessions) {
    hourMap.set(s.categoryName, (hourMap.get(s.categoryName) ?? 0) + s.hoursStudied);
  }

  return mockRoadmapData.map((cat) => {
    const readiness =
      cat.topics.length > 0
        ? Math.round(
            (cat.topics.reduce((sum, t) => sum + MASTERY_WEIGHTS[t.mastery], 0) /
              cat.topics.length) *
              100
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
