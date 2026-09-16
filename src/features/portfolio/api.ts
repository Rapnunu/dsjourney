import {
  apiDelete,
  apiGet,
  apiPatch,
  apiPost,
} from "@/lib/api/client";
import type { ProjectInput } from "@/lib/repositories/portfolio";
import type { Project } from "./data/projects";

export async function fetchPortfolioProjects(): Promise<Project[]> {
  return apiGet<Project[]>("/api/portfolio");
}

export async function createPortfolioProjectRequest(
  data: ProjectInput,
): Promise<Project> {
  return apiPost<Project>("/api/portfolio", data);
}

export async function updatePortfolioProjectRequest(
  id: string,
  data: ProjectInput,
): Promise<Project> {
  return apiPatch<Project>(
    `/api/portfolio/${encodeURIComponent(id)}`,
    data,
  );
}

export async function deletePortfolioProjectRequest(id: string): Promise<void> {
  await apiDelete(`/api/portfolio/${encodeURIComponent(id)}`);
}

export async function bulkImportPortfolioProjectsRequest(
  projects: Project[],
): Promise<Project[]> {
  return apiPost<Project[]>("/api/portfolio/import", { projects });
}
