export interface StudySession {
  id: string;
  topicId: string;
  topicName: string;
  categoryName: string;
  date: string;
  hoursStudied: number;
  difficultyRating: 1 | 2 | 3 | 4 | 5;
  notes: string;
  createdAt: string;
}

export interface TopicOption {
  id: string;
  name: string;
  category: string;
}

export const DIFFICULTY_LABELS: Record<number, { label: string; color: string; bgColor: string }> = {
  1: { label: "Easy", color: "text-emerald-400", bgColor: "bg-emerald-500/20" },
  2: { label: "Moderate", color: "text-teal-400", bgColor: "bg-teal-500/20" },
  3: { label: "Challenging", color: "text-amber-400", bgColor: "bg-amber-500/20" },
  4: { label: "Hard", color: "text-orange-400", bgColor: "bg-orange-500/20" },
  5: { label: "Very Hard", color: "text-rose-400", bgColor: "bg-rose-500/20" },
};
