"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

gsap.registerPlugin(ScrollTrigger);

interface FadeContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  container?: Element | string | null;
  duration?: number;
  ease?: string;
  delay?: number;
  threshold?: number;
  initialOpacity?: number;
  y?: number;
  triggerOnMount?: boolean;
}

const FadeContent: React.FC<FadeContentProps> = ({
  children,
  container,
  duration = 0.7,
  ease = "power2.out",
  delay = 0,
  threshold = 0.1,
  initialOpacity = 0,
  y = 14,
  triggerOnMount = false,
  className = "",
  ...props
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion) return;

    let scrollerTarget: Element | string | null =
      container || document.getElementById("snap-main-container") || null;

    if (typeof scrollerTarget === "string") {
      scrollerTarget = document.querySelector(scrollerTarget);
    }

    const startPct = (1 - threshold) * 100;

    gsap.set(el, {
      autoAlpha: initialOpacity,
      y,
      willChange: "opacity, transform",
    });

    const tl = gsap.timeline({
      paused: true,
      delay,
      onComplete: () => {
        gsap.set(el, { clearProps: "transform" });
      },
    });

    tl.to(el, {
      autoAlpha: 1,
      y: 0,
      duration,
      ease,
    });

    if (triggerOnMount) {
      tl.play();
      return () => {
        tl.kill();
      };
    }

    const st = ScrollTrigger.create({
      trigger: el,
      scroller: scrollerTarget || window,
      start: `top ${startPct}%`,
      once: true,
      onEnter: () => tl.play(),
    });

    return () => {
      st.kill();
      tl.kill();
      gsap.killTweensOf(el);
    };
  }, [
    container,
    duration,
    ease,
    delay,
    threshold,
    initialOpacity,
    y,
    triggerOnMount,
    reducedMotion,
  ]);

  return (
    <div ref={ref} className={className} {...props}>
      {children}
    </div>
  );
};

export default FadeContent;
