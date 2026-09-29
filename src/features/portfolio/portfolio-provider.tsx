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
  getUserFriendlyApiError,
  type UserFriendlyError,
} from "@/lib/api/user-friendly-error";
import {
  mutationFailed,
  mutationOk,
  type MutationResult,
} from "@/lib/api/mutation-result";
import {
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
  addProject: (project: ProjectInput) => Promise<MutationResult>;
  updateProject: (id: string, project: ProjectInput) => Promise<MutationResult>;
  deleteProject: (id: string) => Promise<MutationResult>;
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
        const loaded = await fetchPortfolioProjects();

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
      return mutationOk();
    } catch (createError) {
      return mutationFailed(createError);
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
      return mutationOk();
    } catch (updateError) {
      return mutationFailed(updateError);
    }
  }, []);

  const deleteProject = useCallback(async (id: string) => {
    try {
      await deletePortfolioProjectRequest(id);
      setProjects((previous) =>
        previous.filter((project) => project.id !== id),
      );
      setError(null);
      return mutationOk();
    } catch (deleteError) {
      return mutationFailed(deleteError);
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
