"use client";

import type { ReactNode } from "react";
import FadeContent from "@/components/react-bits/FadeContent";

interface AuthEntranceProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function AuthEntrance({
  children,
  delay = 0,
  className = "",
}: AuthEntranceProps) {
  return (
    <FadeContent
      triggerOnMount
      delay={delay}
      duration={0.65}
      y={12}
      className={className}
    >
      {children}
    </FadeContent>
  );
}
