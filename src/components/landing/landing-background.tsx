"use client";

import { useTheme } from "@/components/theme/theme-provider";
import { useMediaQuery } from "@/hooks/use-media-query";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { useScrollParallax } from "@/hooks/use-scroll-parallax";

function clamp(value: number, max: number): number {
  return Math.min(value, max);
}

export function LandingBackground() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const scrollY = useScrollParallax();
  const reducedMotion = usePrefersReducedMotion();
  const isMobile = useMediaQuery("(max-width: 767px)");
  const motionScale = reducedMotion ? 0 : isMobile ? 0.3 : 1;

  const baseY = clamp(scrollY * 0.06 * motionScale, 8);
  const gridY = clamp(scrollY * 0.1 * motionScale, 12);
  const fragmentY = clamp(scrollY * 0.14 * motionScale, 16);
  const accentY = clamp(scrollY * 0.18 * motionScale, 20);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0 will-change-transform motion-reduce:transform-none"
        style={{ transform: `translate3d(0, ${baseY}px, 0)` }}
      >
        {isLight ? (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-[#e8f4f8] via-bg-primary to-white" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(13,155,171,0.14),transparent_55%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(37,99,235,0.1),transparent_50%)]" />
            <div className="absolute inset-0 bg-gradient-to-r from-white/70 via-white/35 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-white/30" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-brand-navy via-[#071018] to-black" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(20,184,166,0.12),transparent_55%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(59,130,246,0.1),transparent_50%)]" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/40" />
            <div className="absolute inset-0 shadow-[inset_0_0_120px_rgba(0,0,0,0.65)]" />
          </>
        )}
      </div>

      <div
        className="absolute inset-0 opacity-[0.18] will-change-transform motion-reduce:transform-none"
        style={{ transform: `translate3d(0, ${gridY}px, 0)` }}
        aria-hidden="true"
      >
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="landing-grid"
              width="48"
              height="48"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 48 0 L 0 0 0 48"
                fill="none"
                stroke={isLight ? "rgba(13,155,171,0.22)" : "rgba(34,211,238,0.25)"}
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#landing-grid)" />
        </svg>
      </div>

      <div
        className="absolute inset-0 opacity-[0.18] will-change-transform motion-reduce:transform-none"
        style={{ transform: `translate3d(0, ${fragmentY}px, 0)` }}
        aria-hidden="true"
      >
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <circle
            cx="18%"
            cy="32%"
            r="3"
            fill={isLight ? "rgba(13,155,171,0.45)" : "rgba(45,212,191,0.5)"}
          />
          <circle
            cx="72%"
            cy="48%"
            r="2.5"
            fill={isLight ? "rgba(37,99,235,0.4)" : "rgba(56,189,248,0.45)"}
          />
          <circle
            cx="58%"
            cy="22%"
            r="2"
            fill={isLight ? "rgba(13,155,171,0.35)" : "rgba(34,211,238,0.4)"}
          />
        </svg>
      </div>

      <div
        className="absolute inset-0 opacity-[0.18] will-change-transform motion-reduce:transform-none"
        style={{ transform: `translate3d(0, ${accentY}px, 0)` }}
        aria-hidden="true"
      >
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M 120 180 Q 280 120 420 200 T 720 160"
            fill="none"
            stroke={isLight ? "rgba(13,155,171,0.35)" : "rgba(45,212,191,0.35)"}
            strokeWidth="1"
          />
          <path
            d="M 80 320 L 200 280 L 340 300 L 480 240"
            fill="none"
            stroke={isLight ? "rgba(37,99,235,0.25)" : "rgba(59,130,246,0.25)"}
            strokeWidth="1"
            strokeDasharray="4 8"
          />
        </svg>
      </div>
    </div>
  );
}
