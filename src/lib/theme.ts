export type Theme = "dark" | "light";

export const THEME_STORAGE_KEY = "ds-prep-tracker:theme";
export const THEME_CHANGE_EVENT = "dsjourney-theme-change";

export interface ThemeRevealOrigin {
  x: number;
  y: number;
}

export function isTheme(value: string | null | undefined): value is Theme {
  return value === "dark" || value === "light";
}

export function getStoredTheme(): Theme {
  if (typeof window === "undefined") {
    return "dark";
  }

  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return isTheme(stored) ? stored : "dark";
  } catch {
    return "dark";
  }
}

export function applyThemeClass(theme: Theme): void {
  const root = document.documentElement;
  root.classList.remove("dark", "light");
  root.classList.add(theme);
  root.style.colorScheme = theme;

  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Ignore storage failures.
  }

  window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
}

export function toggleThemeValue(theme: Theme): Theme {
  return theme === "dark" ? "light" : "dark";
}

export function setThemeWithReveal(
  nextTheme: Theme,
  origin?: ThemeRevealOrigin,
): void {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  const update = () => applyThemeClass(nextTheme);

  if (
    prefersReducedMotion ||
    typeof document.startViewTransition !== "function"
  ) {
    update();
    return;
  }

  const x = origin?.x ?? window.innerWidth / 2;
  const y = origin?.y ?? window.innerHeight / 2;
  const endRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y),
  );

  const transition = document.startViewTransition(update);

  transition.ready
    .then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 480,
          easing: "ease-in-out",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    })
    .catch(() => {
      // Theme is already applied; ignore animation failures.
    });
}
