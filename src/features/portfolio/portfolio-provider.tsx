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
  getUserFriendlyApiError,
  type UserFriendlyError,
} from "@/lib/api/user-friendly-error";
import {
  bulkImportPortfolioProjectsRequest,
  createPortfolioProjectRequest,
  deletePortfolioProjectRequest,
  fetchPortfolioProjects,
  updatePortfolioProjectRequest,
} from "./api";
import type { Project } from "./data/projects";

export type ProjectInput = Omit<Project, "id">;

interface PortfolioContextType {
  projects: Project[];
  isHydrated: boolean;
  error: UserFriendlyError | null;
  reload: () => Promise<void>;
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

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [error, setError] = useState<UserFriendlyError | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  const reload = useCallback(async () => {
    setIsHydrated(false);
    setReloadToken((token) => token + 1);
  }, []);

  useEffect(() => {
    let isActive = true;

    async function loadProjects() {
      if (isActive) {
        setError(null);
      }

      try {
        let loaded = await fetchPortfolioProjects();

        if (loaded.length > 0) {
          completeStoredPortfolioMigration();
        } else if (!isStoredPortfolioMigrationComplete()) {
          const stored = getStoredProjects();
          if (stored !== null) {
            if (stored.length > 0) {
              loaded = await bulkImportPortfolioProjectsRequest(stored);
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
          setError(getUserFriendlyApiError(loadError, "load"));
        }
      } finally {
        if (isActive) setIsHydrated(true);
      }
    }

    void loadProjects();
    return () => {
      isActive = false;
    };
  }, [reloadToken]);

  const addProject = useCallback(async (project: ProjectInput) => {
    try {
      const created = await createPortfolioProjectRequest(project);
      setProjects((previous) => sortProjects([created, ...previous]));
      setError(null);
      return true;
    } catch {
      return false;
    }
  }, []);

  const updateProject = useCallback(async (id: string, project: ProjectInput) => {
    try {
      const updated = await updatePortfolioProjectRequest(id, project);
      setProjects((previous) =>
        sortProjects(
          previous.map((current) => (current.id === id ? updated : current)),
        ),
      );
      setError(null);
      return true;
    } catch {
      return false;
    }
  }, []);

  const deleteProject = useCallback(async (id: string) => {
    try {
      await deletePortfolioProjectRequest(id);
      setProjects((previous) =>
        previous.filter((project) => project.id !== id),
      );
      setError(null);
      return true;
    } catch {
      return false;
    }
  }, []);

  return (
    <PortfolioContext.Provider
      value={{
        projects,
        isHydrated,
        error,
        reload,
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
