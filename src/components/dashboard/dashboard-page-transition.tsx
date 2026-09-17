"use client";

import type { ReactNode } from "react";
import FadeContent from "@/components/react-bits/FadeContent";
import { DASHBOARD_SCROLL_SELECTOR } from "./constants";

interface DashboardPageTransitionProps {
  children: ReactNode;
}

export function DashboardPageTransition({ children }: DashboardPageTransitionProps) {
  return (
    <FadeContent
      triggerOnMount
      duration={0.4}
      y={10}
      container={DASHBOARD_SCROLL_SELECTOR}
    >
      {children}
    </FadeContent>
  );
}
