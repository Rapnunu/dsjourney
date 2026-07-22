export interface Project {
  id: string;
  title: string;
  description?: string;
  repositoryUrl?: string;
  liveUrl?: string;
  tags: string[];
  status: "planned" | "in_progress" | "completed";
  createdAt: Date;
  updatedAt: Date;
}
