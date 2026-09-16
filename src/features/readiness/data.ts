import { MASTERY_WEIGHTS, MASTERY_REMAINING_FACTOR } from "../roadmap/types";
import type { MasteryLevel, RoadmapCategory } from "../roadmap/types";
import type { Project } from "../portfolio/data/projects";

export interface CategoryReadiness {
  id: string;
  name: string;
  readiness: number;
  topicCount: number;
  masteredCount: number;
  color: string;
}

export interface SkillGap {
  categoryName: string;
  readiness: number;
  topicsRemaining: number;
  hoursRemaining: number;
  color: string;
}

export interface RecommendedFocus {
  topic: string;
  category: string;
  estimatedHours: number;
  readinessGain: number;
}

export interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
}

const CATEGORY_COLORS: Record<string, string> = {
  python: "indigo",
  sql: "sky",
  statistics: "violet",
  ml: "rose",
  git: "emerald",
  projects: "amber",
};

const COMPLETED_PROJECT_THRESHOLD = 2;

function getProjectsReadiness(projects: Project[]) {
  const completedCount = projects.filter((p) => p.status === "completed").length;
  const readiness =
    projects.length > 0
      ? Math.round((completedCount / projects.length) * 100)
      : 0;

  return {
    id: "projects",
    name: "Projects",
    readiness,
    topicCount: projects.length,
    masteredCount: completedCount,
  };
}

export function getCategoryReadiness(
  roadmap: RoadmapCategory[],
  projects: Project[] = [],
): CategoryReadiness[] {
  const categories: CategoryReadiness[] = roadmap.map((cat) => {
    const readiness =
      cat.topics.length > 0
        ? Math.round(
            (cat.topics.reduce((sum, t) => sum + MASTERY_WEIGHTS[t.mastery], 0) /
              cat.topics.length) *
              100,
          )
        : 0;
    const masteredCount = cat.topics.filter((t) => t.mastery === "mastered").length;

    return {
      id: cat.id,
      name: cat.name,
      readiness,
      topicCount: cat.topics.length,
      masteredCount,
      color: CATEGORY_COLORS[cat.id] ?? "zinc",
    };
  });

  categories.push({
    ...getProjectsReadiness(projects),
    color: CATEGORY_COLORS.projects,
  });

  return categories;
}

export function getOverallReadiness(
  roadmap: RoadmapCategory[],
  projects: Project[] = [],
): number {
  const categories = getCategoryReadiness(roadmap, projects);
  if (categories.length === 0) return 0;
  return Math.round(
    categories.reduce((sum, c) => sum + c.readiness, 0) / categories.length,
  );
}

export function getReadinessSummary(readiness: number): string {
  if (readiness >= 80) return "You're nearly interview-ready — keep sharpening your edge!";
  if (readiness >= 60) return "Solid progress! Focus on weak areas to cross the finish line.";
  if (readiness >= 40) return "Good foundation in place. Consistent study will pay off.";
  if (readiness >= 20) return "You're getting started — build momentum with daily sessions.";
  return "Just beginning your journey. Every session counts!";
}

export function getTopSkillGaps(
  roadmap: RoadmapCategory[],
  projects: Project[] = [],
  count = 3,
): SkillGap[] {
  const categories = getCategoryReadiness(roadmap, projects);
  const sorted = [...categories].sort((a, b) => a.readiness - b.readiness);

  return sorted.slice(0, count).map((cat) => {
    const roadmapCat = roadmap.find((c) => c.id === cat.id);
    let hoursRemaining = 0;
    let topicsRemaining = 0;

    if (roadmapCat) {
      for (const topic of roadmapCat.topics) {
        if (topic.mastery !== "mastered") {
          topicsRemaining++;
          hoursRemaining += topic.estimatedHours * MASTERY_REMAINING_FACTOR[topic.mastery];
        }
      }
    } else {
      topicsRemaining = cat.topicCount - cat.masteredCount;
      hoursRemaining = topicsRemaining * 8;
    }

    return {
      categoryName: cat.name,
      readiness: cat.readiness,
      topicsRemaining,
      hoursRemaining: Math.round(hoursRemaining),
      color: cat.color,
    };
  });
}

export function getRecommendedFocusTopics(
  roadmap: RoadmapCategory[],
  projects: Project[] = [],
): RecommendedFocus[] {
  const totalCategories = roadmap.length + 1;
  const results: RecommendedFocus[] = [];
  const catReadiness = getCategoryReadiness(roadmap, projects);
  const sorted = [...catReadiness].sort((a, b) => a.readiness - b.readiness);

  for (const cat of sorted) {
    if (results.length >= 4) break;
    const roadmapCat = roadmap.find((c) => c.id === cat.id);

    if (!roadmapCat) {
      const nextProject = projects.find((p) => p.status !== "completed");
      if (nextProject && cat.readiness < 100) {
        results.push({
          topic: nextProject.title,
          category: "Projects",
          estimatedHours: 10,
          readinessGain: Math.max(
            1,
            Math.round((1 / Math.max(cat.topicCount, 1) / totalCategories) * 100),
          ),
        });
      }
      continue;
    }

    const priorityOrder: MasteryLevel[] = ["not_started", "learning", "practiced"];
    for (const level of priorityOrder) {
      const topic = roadmapCat.topics.find((t) => t.mastery === level);
      if (topic) {
        const currentWeight = MASTERY_WEIGHTS[topic.mastery];
        const gain =
          ((1 - currentWeight) / roadmapCat.topics.length / totalCategories) * 100;
        results.push({
          topic: topic.name,
          category: cat.name,
          estimatedHours: Math.round(
            topic.estimatedHours * MASTERY_REMAINING_FACTOR[topic.mastery],
          ),
          readinessGain: Math.max(1, Math.round(gain)),
        });
        break;
      }
    }
  }

  return results;
}

export function getInternshipChecklist(
  roadmap: RoadmapCategory[],
  projects: Project[] = [],
): ChecklistItem[] {
  const catReadiness = getCategoryReadiness(roadmap, projects);
  const overall = getOverallReadiness(roadmap, projects);
  const pythonR = catReadiness.find((c) => c.id === "python")?.readiness ?? 0;
  const sqlR = catReadiness.find((c) => c.id === "sql")?.readiness ?? 0;
  const statsR = catReadiness.find((c) => c.id === "statistics")?.readiness ?? 0;
  const mlR = catReadiness.find((c) => c.id === "ml")?.readiness ?? 0;
  const gitR = catReadiness.find((c) => c.id === "git")?.readiness ?? 0;
  const completedProjects = projects.filter((p) => p.status === "completed").length;

  return [
    {
      id: "cl-1",
      label: "Complete Python fundamentals (≥ 60% mastery)",
      completed: pythonR >= 60,
    },
    {
      id: "cl-2",
      label: "Write SQL JOINs and aggregations confidently",
      completed: sqlR >= 50,
    },
    {
      id: "cl-3",
      label: "Understand hypothesis testing & distributions",
      completed: statsR >= 40,
    },
    {
      id: "cl-4",
      label: "Train and evaluate at least one ML model",
      completed: mlR >= 25,
    },
    {
      id: "cl-5",
      label: "Push a project to GitHub with proper branching",
      completed: gitR >= 60,
    },
    {
      id: "cl-6",
      label: "Build at least 2 portfolio projects",
      completed: completedProjects >= COMPLETED_PROJECT_THRESHOLD,
    },
    {
      id: "cl-7",
      label: "Prepare a resume tailored to DS roles",
      completed: false,
    },
    {
      id: "cl-8",
      label: "Reach 70% overall readiness",
      completed: overall >= 70,
    },
  ];
}
