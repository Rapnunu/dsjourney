export type MasteryLevel = "not_started" | "learning" | "practiced" | "mastered";

export type Difficulty = "beginner" | "intermediate" | "advanced";

export interface RoadmapTopic {
  id: string;
  name: string;
  difficulty: Difficulty;
  estimatedHours: number;
  resourceLink?: string;
  lastStudied?: string;
  mastery: MasteryLevel;
}

export interface RoadmapCategory {
  id: string;
  name: string;
  description: string;
  topics: RoadmapTopic[];
}

export const MASTERY_CONFIG: Record<
  MasteryLevel,
  { label: string; color: string; bgColor: string; activeColor: string; activeBg: string; activeBorder: string; order: number }
> = {
  not_started: {
    label: "Not Started",
    color: "text-zinc-500",
    bgColor: "bg-zinc-500/10",
    activeColor: "text-zinc-200",
    activeBg: "bg-zinc-500/30",
    activeBorder: "ring-zinc-400/50",
    order: 0,
  },
  learning: {
    label: "Learning",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    activeColor: "text-amber-300",
    activeBg: "bg-amber-500/30",
    activeBorder: "ring-amber-400/50",
    order: 1,
  },
  practiced: {
    label: "Practiced",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    activeColor: "text-blue-300",
    activeBg: "bg-blue-500/30",
    activeBorder: "ring-blue-400/50",
    order: 2,
  },
  mastered: {
    label: "Mastered",
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    activeColor: "text-emerald-300",
    activeBg: "bg-emerald-500/30",
    activeBorder: "ring-emerald-400/50",
    order: 3,
  },
};

export const DIFFICULTY_CONFIG: Record<
  Difficulty,
  { label: string; color: string; bgColor: string }
> = {
  beginner: {
    label: "Beginner",
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
  },
  intermediate: {
    label: "Intermediate",
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
  },
  advanced: {
    label: "Advanced",
    color: "text-rose-400",
    bgColor: "bg-rose-500/10",
  },
};

/** Weight each mastery level contributes toward readiness (0–1) */
export const MASTERY_WEIGHTS: Record<MasteryLevel, number> = {
  not_started: 0,
  learning: 0.33,
  practiced: 0.66,
  mastered: 1,
};

/** Fraction of estimated hours still remaining at each mastery level */
export const MASTERY_REMAINING_FACTOR: Record<MasteryLevel, number> = {
  not_started: 1,
  learning: 0.67,
  practiced: 0.34,
  mastered: 0,
};
