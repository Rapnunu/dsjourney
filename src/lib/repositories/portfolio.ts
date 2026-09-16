import "server-only";

import { and, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { portfolioProjects, type PortfolioProjectRow } from "@/lib/db/schema";
import type { Project, ProjectStatus } from "@/features/portfolio/data/projects";

export type ProjectInput = Omit<Project, "id">;

function fromRow(row: PortfolioProjectRow): Project {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    status: row.status as ProjectStatus,
    technologies: row.technologies ?? [],
    githubUrl: row.githubUrl ?? undefined,
    demoUrl: row.demoUrl ?? undefined,
    highlights: row.highlights ?? [],
    startDate: row.startDate,
    endDate: row.endDate ?? undefined,
  };
}

function toInsertRow(project: Project, userId: string) {
  return {
    userId,
    id: project.id,
    title: project.title,
    description: project.description,
    status: project.status,
    technologies: project.technologies,
    githubUrl: project.githubUrl ?? null,
    demoUrl: project.demoUrl ?? null,
    highlights: project.highlights,
    startDate: project.startDate,
    endDate: project.endDate ?? null,
  };
}

function sortProjects(projects: Project[]): Project[] {
  return [...projects].sort((a, b) => b.startDate.localeCompare(a.startDate));
}

export async function listPortfolioProjects(userId: string): Promise<Project[]> {
  const rows = await db
    .select()
    .from(portfolioProjects)
    .where(eq(portfolioProjects.userId, userId))
    .orderBy(desc(portfolioProjects.startDate));

  return sortProjects(rows.map(fromRow));
}

export async function createPortfolioProject(
  userId: string,
  data: ProjectInput,
  options?: { id?: string },
): Promise<Project> {
  const project: Project = {
    ...data,
    id: options?.id ?? `proj-${Date.now()}`,
  };

  const [row] = await db
    .insert(portfolioProjects)
    .values(toInsertRow(project, userId))
    .returning();

  if (!row) {
    throw new Error("Failed to create portfolio project.");
  }

  return fromRow(row);
}

export async function updatePortfolioProject(
  userId: string,
  id: string,
  data: ProjectInput,
): Promise<Project> {
  const [row] = await db
    .update(portfolioProjects)
    .set({
      title: data.title,
      description: data.description,
      status: data.status,
      technologies: data.technologies,
      githubUrl: data.githubUrl ?? null,
      demoUrl: data.demoUrl ?? null,
      highlights: data.highlights,
      startDate: data.startDate,
      endDate: data.endDate ?? null,
    })
    .where(and(eq(portfolioProjects.userId, userId), eq(portfolioProjects.id, id)))
    .returning();

  if (!row) {
    throw new Error("Portfolio project not found.");
  }

  return fromRow(row);
}

export async function deletePortfolioProject(
  userId: string,
  id: string,
): Promise<void> {
  const [row] = await db
    .delete(portfolioProjects)
    .where(and(eq(portfolioProjects.userId, userId), eq(portfolioProjects.id, id)))
    .returning({ id: portfolioProjects.id });

  if (!row) {
    throw new Error("Portfolio project not found.");
  }
}

export async function bulkImportPortfolioProjects(
  userId: string,
  projects: Project[],
): Promise<Project[]> {
  if (projects.length === 0) {
    return [];
  }

  const rows = await db
    .insert(portfolioProjects)
    .values(projects.map((project) => toInsertRow(project, userId)))
    .returning();

  return sortProjects(rows.map(fromRow));
}
