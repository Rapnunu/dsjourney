"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  completeStoredPortfolioMigration,
  getStoredProjects,
  isStoredPortfolioMigrationComplete,
} from "@/lib/storage";
import { createClient } from "@/lib/supabase/client";
import type { Project, ProjectStatus } from "./data/projects";

export type ProjectInput = Omit<Project, "id">;

interface PortfolioProjectRow {
  user_id: string;
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  technologies: string[];
  github_url: string | null;
  demo_url: string | null;
  highlights: string[];
  start_date: string;
  end_date: string | null;
}

interface PortfolioContextType {
  projects: Project[];
  isHydrated: boolean;
  error: string | null;
  addProject: (project: ProjectInput) => Promise<boolean>;
  updateProject: (id: string, project: ProjectInput) => Promise<boolean>;
  deleteProject: (id: string) => Promise<boolean>;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(
  undefined,
);

function fromRow(row: PortfolioProjectRow): Project {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    status: row.status,
    technologies: row.technologies ?? [],
    githubUrl: row.github_url ?? undefined,
    demoUrl: row.demo_url ?? undefined,
    highlights: row.highlights ?? [],
    startDate: row.start_date,
    endDate: row.end_date ?? undefined,
  };
}

function toRow(project: Project, userId: string): PortfolioProjectRow {
  return {
    user_id: userId,
    id: project.id,
    title: project.title,
    description: project.description,
    status: project.status,
    technologies: project.technologies,
    github_url: project.githubUrl ?? null,
    demo_url: project.demoUrl ?? null,
    highlights: project.highlights,
    start_date: project.startDate,
    end_date: project.endDate ?? null,
  };
}

function sortProjects(projects: Project[]): Project[] {
  return [...projects].sort((a, b) => b.startDate.localeCompare(a.startDate));
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error) return error.message;
  if (typeof error !== "object" || error === null) return fallback;

  const candidate = error as Record<string, unknown>;
  const message =
    typeof candidate.message === "string" ? candidate.message : fallback;
  const code =
    typeof candidate.code === "string" && candidate.code
      ? ` (${candidate.code})`
      : "";
  const details =
    typeof candidate.details === "string" && candidate.details
      ? ` ${candidate.details}`
      : "";
  const hint =
    typeof candidate.hint === "string" && candidate.hint
      ? ` Hint: ${candidate.hint}`
      : "";

  return `${message}${code}${details}${hint}`;
}

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const supabase = useMemo(() => createClient(), []);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    async function loadProjects() {
      try {
        const { data: userData, error: userError } =
          await supabase.auth.getUser();
        if (userError) throw userError;
        if (!userData.user) {
          throw new Error("You must be signed in to load portfolio projects.");
        }

        const { data, error: fetchError } = await supabase
          .from("portfolio_projects")
          .select(
            "user_id, id, title, description, status, technologies, github_url, demo_url, highlights, start_date, end_date",
          )
          .eq("user_id", userData.user.id)
          .order("start_date", { ascending: false });
        if (fetchError) throw fetchError;

        let rows = (data ?? []) as PortfolioProjectRow[];
        if (rows.length > 0) {
          completeStoredPortfolioMigration();
        } else if (!isStoredPortfolioMigrationComplete()) {
          const stored = getStoredProjects();
          if (stored !== null) {
            if (stored.length > 0) {
              const { data: imported, error: importError } = await supabase
                .from("portfolio_projects")
                .insert(
                  stored.map((project) =>
                    toRow(project, userData.user.id),
                  ),
                )
                .select(
                  "user_id, id, title, description, status, technologies, github_url, demo_url, highlights, start_date, end_date",
                );
              if (importError) throw importError;
              rows = (imported ?? []) as PortfolioProjectRow[];
            }

            completeStoredPortfolioMigration();
          }
        }

        if (isActive) {
          setProjects(sortProjects(rows.map(fromRow)));
          setError(null);
        }
      } catch (loadError) {
        if (isActive) {
          setProjects([]);
          setError(
            getErrorMessage(loadError, "Unable to load portfolio projects."),
          );
        }
      } finally {
        if (isActive) setIsHydrated(true);
      }
    }

    void loadProjects();
    return () => {
      isActive = false;
    };
  }, [supabase]);

  const getCurrentUserId = useCallback(async () => {
    const { data, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!data.user) {
      throw new Error("You must be signed in to manage portfolio projects.");
    }
    return data.user.id;
  }, [supabase]);

  const addProject = useCallback(
    async (project: ProjectInput) => {
      try {
        const userId = await getCurrentUserId();
        const newProject: Project = {
          ...project,
          id: `proj-${Date.now()}`,
        };
        const { data: inserted, error: insertError } = await supabase
          .from("portfolio_projects")
          .insert(toRow(newProject, userId))
          .select(
            "user_id, id, title, description, status, technologies, github_url, demo_url, highlights, start_date, end_date",
          )
          .single();
        if (insertError) throw insertError;

        setProjects((previous) =>
          sortProjects([
            fromRow(inserted as PortfolioProjectRow),
            ...previous,
          ]),
        );
        setError(null);
        return true;
      } catch (operationError) {
        setError(
          getErrorMessage(operationError, "Unable to add the project."),
        );
        return false;
      }
    },
    [getCurrentUserId, supabase],
  );

  const updateProject = useCallback(
    async (id: string, project: ProjectInput) => {
      try {
        const userId = await getCurrentUserId();
        const { data: updated, error: updateError } = await supabase
          .from("portfolio_projects")
          .update({
            title: project.title,
            description: project.description,
            status: project.status,
            technologies: project.technologies,
            github_url: project.githubUrl ?? null,
            demo_url: project.demoUrl ?? null,
            highlights: project.highlights,
            start_date: project.startDate,
            end_date: project.endDate ?? null,
          })
          .eq("user_id", userId)
          .eq("id", id)
          .select(
            "user_id, id, title, description, status, technologies, github_url, demo_url, highlights, start_date, end_date",
          )
          .single();
        if (updateError) throw updateError;

        const mapped = fromRow(updated as PortfolioProjectRow);
        setProjects((previous) =>
          sortProjects(
            previous.map((current) => (current.id === id ? mapped : current)),
          ),
        );
        setError(null);
        return true;
      } catch (operationError) {
        setError(
          getErrorMessage(operationError, "Unable to update the project."),
        );
        return false;
      }
    },
    [getCurrentUserId, supabase],
  );

  const deleteProject = useCallback(
    async (id: string) => {
      try {
        const userId = await getCurrentUserId();
        const { error: deleteError } = await supabase
          .from("portfolio_projects")
          .delete()
          .eq("user_id", userId)
          .eq("id", id)
          .select("id")
          .single();
        if (deleteError) throw deleteError;

        setProjects((previous) =>
          previous.filter((project) => project.id !== id),
        );
        setError(null);
        return true;
      } catch (operationError) {
        setError(
          getErrorMessage(operationError, "Unable to delete the project."),
        );
        return false;
      }
    },
    [getCurrentUserId, supabase],
  );

  return (
    <PortfolioContext.Provider
      value={{
        projects,
        isHydrated,
        error,
        addProject,
        updateProject,
        deleteProject,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolioStore() {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error("usePortfolioStore must be used within a PortfolioProvider");
  }
  return context;
}
