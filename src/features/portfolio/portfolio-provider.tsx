"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { getStoredProjects, saveStoredProjects } from "@/lib/storage";
import { mockProjects, type Project } from "./data/projects";

export type ProjectInput = Omit<Project, "id">;

interface PortfolioContextType {
  projects: Project[];
  isHydrated: boolean;
  addProject: (project: ProjectInput) => void;
  updateProject: (id: string, project: ProjectInput) => void;
  deleteProject: (id: string) => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(
  undefined,
);

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  /* eslint-disable react-hooks/set-state-in-effect -- This intentionally mirrors
     the established provider post-mount localStorage hydration pattern. */
  useEffect(() => {
    const stored = getStoredProjects();
    if (stored !== null) {
      setProjects(stored);
    } else {
      const seed = JSON.parse(JSON.stringify(mockProjects)) as Project[];
      saveStoredProjects(seed);
      setProjects(seed);
    }
    setIsHydrated(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const persistUpdate = useCallback(
    (updater: (previous: Project[]) => Project[]) => {
      setProjects((previous) => {
        const next = updater(previous);
        saveStoredProjects(next);
        return next;
      });
    },
    [],
  );

  const addProject = useCallback(
    (project: ProjectInput) => {
      persistUpdate((previous) => [
        { ...project, id: `proj-${Date.now()}` },
        ...previous,
      ]);
    },
    [persistUpdate],
  );

  const updateProject = useCallback(
    (id: string, project: ProjectInput) => {
      persistUpdate((previous) =>
        previous.map((current) =>
          current.id === id ? { ...project, id } : current,
        ),
      );
    },
    [persistUpdate],
  );

  const deleteProject = useCallback(
    (id: string) => {
      persistUpdate((previous) =>
        previous.filter((project) => project.id !== id),
      );
    },
    [persistUpdate],
  );

  return (
    <PortfolioContext.Provider
      value={{ projects, isHydrated, addProject, updateProject, deleteProject }}
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
