"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  completeStoredPortfolioMigration,
  getStoredProjects,
  isStoredPortfolioMigrationComplete,
} from "@/lib/storage";
import {
  bulkImportPortfolioProjectsAction,
  createPortfolioProjectAction,
  deletePortfolioProjectAction,
  listPortfolioProjectsAction,
  updatePortfolioProjectAction,
} from "./actions";
import type { Project } from "./data/projects";

export type ProjectInput = Omit<Project, "id">;

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

function sortProjects(projects: Project[]): Project[] {
  return [...projects].sort((a, b) => b.startDate.localeCompare(a.startDate));
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error) return error.message;
  if (typeof error !== "object" || error === null) return fallback;

  const candidate = error as Record<string, unknown>;
  const message =
    typeof candidate.message === "string" ? candidate.message : fallback;

  return message;
}

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    async function loadProjects() {
      try {
        let loaded = await listPortfolioProjectsAction();

        if (loaded.length > 0) {
          completeStoredPortfolioMigration();
        } else if (!isStoredPortfolioMigrationComplete()) {
          const stored = getStoredProjects();
          if (stored !== null) {
            if (stored.length > 0) {
              loaded = await bulkImportPortfolioProjectsAction(stored);
            }

            completeStoredPortfolioMigration();
          }
        }

        if (isActive) {
          setProjects(sortProjects(loaded));
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
  }, []);

  const addProject = useCallback(async (project: ProjectInput) => {
    try {
      const created = await createPortfolioProjectAction(project);
      setProjects((previous) => sortProjects([created, ...previous]));
      setError(null);
      return true;
    } catch (operationError) {
      setError(getErrorMessage(operationError, "Unable to add the project."));
      return false;
    }
  }, []);

  const updateProject = useCallback(async (id: string, project: ProjectInput) => {
    try {
      const updated = await updatePortfolioProjectAction(id, project);
      setProjects((previous) =>
        sortProjects(
          previous.map((current) => (current.id === id ? updated : current)),
        ),
      );
      setError(null);
      return true;
    } catch (operationError) {
      setError(getErrorMessage(operationError, "Unable to update the project."));
      return false;
    }
  }, []);

  const deleteProject = useCallback(async (id: string) => {
    try {
      await deletePortfolioProjectAction(id);
      setProjects((previous) =>
        previous.filter((project) => project.id !== id),
      );
      setError(null);
      return true;
    } catch (operationError) {
      setError(getErrorMessage(operationError, "Unable to delete the project."));
      return false;
    }
  }, []);

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
