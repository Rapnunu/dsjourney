"use client";

import type { ReactNode } from "react";
import Magnet from "@/components/react-bits/Magnet";

interface DashboardMagnetProps {
  children: ReactNode;
  className?: string;
}

/** Subtle magnetic pull for primary dashboard CTAs only (max ~5px). */
export function DashboardMagnet({ children, className }: DashboardMagnetProps) {
  return (
    <Magnet magnetStrength={30} padding={64} wrapperClassName={className}>
      {children}
    </Magnet>
  );
}
