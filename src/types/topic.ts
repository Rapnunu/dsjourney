export interface Topic {
  id: string;
  name: string;
  description?: string;
  category: string;
  status: "not_started" | "in_progress" | "completed";
  priority: "low" | "medium" | "high";
  createdAt: Date;
  updatedAt: Date;
}
