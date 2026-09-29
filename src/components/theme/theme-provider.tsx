"use client";

import {
  createContext,
  useCallback,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  THEME_CHANGE_EVENT,
  THEME_STORAGE_KEY,
  isTheme,
  setThemeWithReveal,
  toggleThemeValue,
  type Theme,
  type ThemeRevealOrigin,
} from "@/lib/theme";

function getThemeSnapshot(): Theme {
  if (typeof document === "undefined") {
    return "dark";
  }

  return document.documentElement.classList.contains("light") ? "light" : "dark";
}

function getServerThemeSnapshot(): Theme {
  return "dark";
}

function subscribeToTheme(onStoreChange: () => void) {
  const handleStorage = (event: StorageEvent) => {
    if (event.key !== THEME_STORAGE_KEY || !isTheme(event.newValue)) {
      return;
    }

    const root = document.documentElement;
    root.classList.remove("dark", "light");
    root.classList.add(event.newValue);
    root.style.colorScheme = event.newValue;
    onStoreChange();
  };

  window.addEventListener(THEME_CHANGE_EVENT, onStoreChange);
  window.addEventListener("storage", handleStorage);

  return () => {
    window.removeEventListener(THEME_CHANGE_EVENT, onStoreChange);
    window.removeEventListener("storage", handleStorage);
  };
}

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme, origin?: ThemeRevealOrigin) => void;
  toggleTheme: (origin?: ThemeRevealOrigin) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    getServerThemeSnapshot,
  );

  const setTheme = useCallback((nextTheme: Theme, origin?: ThemeRevealOrigin) => {
    if (nextTheme === getThemeSnapshot()) {
      return;
    }

    setThemeWithReveal(nextTheme, origin);
  }, []);

  const toggleTheme = useCallback((origin?: ThemeRevealOrigin) => {
    setThemeWithReveal(toggleThemeValue(getThemeSnapshot()), origin);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
}
