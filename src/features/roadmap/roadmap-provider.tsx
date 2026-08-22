"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { getStoredRoadmap, saveStoredRoadmap } from "@/lib/storage";
import { mockRoadmapData } from "./data";
import type { MasteryLevel, RoadmapCategory } from "./types";

interface RoadmapContextType {
  roadmap: RoadmapCategory[];
  isHydrated: boolean;
  updateMastery: (topicId: string, mastery: MasteryLevel) => void;
}

const RoadmapContext = createContext<RoadmapContextType | undefined>(undefined);

export function RoadmapProvider({ children }: { children: ReactNode }) {
  const [roadmap, setRoadmap] = useState<RoadmapCategory[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  /* eslint-disable react-hooks/set-state-in-effect -- This intentionally mirrors
     SessionProvider's explicit post-mount localStorage hydration pattern. */
  useEffect(() => {
    const stored = getStoredRoadmap();
    if (stored !== null) {
      setRoadmap(stored);
    } else {
      const seed = JSON.parse(
        JSON.stringify(mockRoadmapData),
      ) as RoadmapCategory[];
      saveStoredRoadmap(seed);
      setRoadmap(seed);
    }
    setIsHydrated(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const updateMastery = useCallback(
    (topicId: string, mastery: MasteryLevel) => {
      setRoadmap((previous) => {
        const next = previous.map((category) => ({
          ...category,
          topics: category.topics.map((topic) =>
            topic.id === topicId ? { ...topic, mastery } : topic,
          ),
        }));
        saveStoredRoadmap(next);
        return next;
      });
    },
    [],
  );

  return (
    <RoadmapContext.Provider value={{ roadmap, isHydrated, updateMastery }}>
      {children}
    </RoadmapContext.Provider>
  );
}

export function useRoadmapStore() {
  const context = useContext(RoadmapContext);
  if (!context) {
    throw new Error("useRoadmapStore must be used within a RoadmapProvider");
  }
  return context;
}
