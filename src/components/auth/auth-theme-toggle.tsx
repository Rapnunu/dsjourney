"use client";

import { ThemeToggleCompact } from "@/components/theme/theme-toggle";

export function AuthThemeToggle() {
  return (
    <div className="absolute right-5 top-5 z-20 sm:right-8">
      <ThemeToggleCompact />
    </div>
  );
}
