"use client";

import type { ReactNode } from "react";
import AnimatedContent from "@/components/react-bits/AnimatedContent";
import { DASHBOARD_SCROLL_SELECTOR } from "./constants";

interface DashboardScrollRevealProps {
  children: ReactNode;
  className?: string;
  delayMs?: number;
}

export function DashboardScrollReveal({
  children,
  className = "",
  delayMs = 0,
}: DashboardScrollRevealProps) {
  return (
    <AnimatedContent
      className={className}
      container={DASHBOARD_SCROLL_SELECTOR}
      distance={12}
      duration={0.45}
      ease="power2.out"
      initialOpacity={0}
      animateOpacity
      threshold={0.1}
      delay={delayMs / 1000}
    >
      {children}
    </AnimatedContent>
  );
}
