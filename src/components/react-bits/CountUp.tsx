"use client";

import { useInView, useMotionValue, useSpring } from "motion/react";
import { useCallback, useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

interface CountUpProps {
  to: number;
  from?: number;
  direction?: "up" | "down";
  delay?: number;
  duration?: number;
  decimals?: number;
  className?: string;
  startWhen?: boolean;
  suffix?: string;
}

export default function CountUp({
  to,
  from = 0,
  direction = "up",
  delay = 0,
  duration = 1,
  decimals = 0,
  className = "",
  startWhen = true,
  suffix = "",
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const hasAnimatedRef = useRef(false);
  const previousToRef = useRef(to);
  const motionValue = useMotionValue(direction === "down" ? to : from);

  const damping = 20 + 40 * (1 / duration);
  const stiffness = 100 * (1 / duration);

  const springValue = useSpring(motionValue, {
    damping,
    stiffness,
  });

  const isInView = useInView(ref, { once: true, margin: "0px" });

  const formatValue = useCallback(
    (latest: number) => {
      const formatted =
        decimals > 0 ? latest.toFixed(decimals) : String(Math.round(latest));
      return `${formatted}${suffix}`;
    },
    [suffix, decimals],
  );

  const initialDisplay = direction === "down" ? to : from;

  useEffect(() => {
    if (ref.current && !hasAnimatedRef.current) {
      ref.current.textContent = reducedMotion
        ? formatValue(to)
        : formatValue(initialDisplay);
    }
  }, [formatValue, initialDisplay, reducedMotion, to]);

  useEffect(() => {
    if (reducedMotion) {
      if (ref.current) {
        ref.current.textContent = formatValue(to);
      }
      previousToRef.current = to;
      return;
    }

    if (!isInView || !startWhen) return;

    if (!hasAnimatedRef.current) {
      const timeoutId = setTimeout(() => {
        hasAnimatedRef.current = true;
        motionValue.set(direction === "down" ? from : to);
        previousToRef.current = to;
      }, delay * 1000);

      return () => clearTimeout(timeoutId);
    }

    if (previousToRef.current !== to) {
      previousToRef.current = to;
      motionValue.set(to);
    }
  }, [
    isInView,
    startWhen,
    motionValue,
    direction,
    from,
    to,
    delay,
    reducedMotion,
    formatValue,
  ]);

  useEffect(() => {
    if (reducedMotion) return;

    const unsubscribe = springValue.on("change", (latest: number) => {
      if (ref.current) {
        ref.current.textContent = formatValue(latest);
      }
    });

    return () => unsubscribe();
  }, [springValue, formatValue, reducedMotion]);

  return <span ref={ref} className={className} />;
}
