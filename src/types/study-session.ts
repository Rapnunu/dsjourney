export interface StudySession {
  id: string;
  topicId: string;
  startedAt: Date;
  endedAt?: Date;
  durationMinutes?: number;
  notes?: string;
  rating?: 1 | 2 | 3 | 4 | 5;
  createdAt: Date;
}
