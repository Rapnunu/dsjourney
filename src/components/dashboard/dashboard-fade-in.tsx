"use client";

import type { ReactNode } from "react";
import FadeContent from "@/components/react-bits/FadeContent";
import { DASHBOARD_SCROLL_SELECTOR } from "./constants";

interface DashboardFadeInProps {
  children: ReactNode;
  className?: string;
  delayMs?: number;
}

export function DashboardFadeIn({
  children,
  className = "",
  delayMs = 0,
}: DashboardFadeInProps) {
  return (
    <FadeContent
      triggerOnMount
      duration={0.4}
      y={10}
      delay={delayMs / 1000}
      container={DASHBOARD_SCROLL_SELECTOR}
      className={className}
    >
      {children}
    </FadeContent>
  );
}
