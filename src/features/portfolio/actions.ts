"use server";

import { requireUser } from "@/lib/auth/require-user";
import {
  bulkImportPortfolioProjects,
  createPortfolioProject,
  deletePortfolioProject,
  listPortfolioProjects,
  updatePortfolioProject,
  type ProjectInput,
} from "@/lib/repositories/portfolio";
import type { Project } from "./data/projects";

export async function listPortfolioProjectsAction(): Promise<Project[]> {
  const user = await requireUser();
  return listPortfolioProjects(user.id);
}

export async function createPortfolioProjectAction(
  data: ProjectInput,
): Promise<Project> {
  const user = await requireUser();
  return createPortfolioProject(user.id, data);
}

export async function updatePortfolioProjectAction(
  id: string,
  data: ProjectInput,
): Promise<Project> {
  const user = await requireUser();
  return updatePortfolioProject(user.id, id, data);
}

export async function deletePortfolioProjectAction(id: string): Promise<void> {
  const user = await requireUser();
  await deletePortfolioProject(user.id, id);
}

export async function bulkImportPortfolioProjectsAction(
  projects: Project[],
): Promise<Project[]> {
  const user = await requireUser();
  return bulkImportPortfolioProjects(user.id, projects);
}
