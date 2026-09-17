"use client";

import type { ReactNode } from "react";
import AnimatedContent from "@/components/react-bits/AnimatedContent";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delayMs?: number;
}

export function ScrollReveal({
  children,
  className = "",
  delayMs = 0,
}: ScrollRevealProps) {
  return (
    <AnimatedContent
      className={className}
      distance={14}
      duration={0.7}
      ease="power3.out"
      initialOpacity={0}
      animateOpacity
      threshold={0.12}
      delay={delayMs / 1000}
    >
      {children}
    </AnimatedContent>
  );
}
