"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { DsjourneyLogo } from "@/components/brand/dsjourney-logo";
import { GlowCursor } from "@/components/react-bits/GlowCursor";
import { AuthEntrance } from "@/app/auth/auth-entrance";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import styles from "@/app/auth/auth-page.module.css";

const FINE_POINTER_QUERY = "(hover: hover) and (pointer: fine)";

export function AuthBrandPanel() {
  const reducedMotion = usePrefersReducedMotion();
  const [desktopBrandVisible, setDesktopBrandVisible] = useState(false);
  const [finePointer, setFinePointer] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const update = () => setDesktopBrandVisible(mediaQuery.matches);
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia(FINE_POINTER_QUERY);
    const update = () => setFinePointer(mediaQuery.matches);
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  const glowCursorDisabled =
    reducedMotion || !desktopBrandVisible || !finePointer;

  const brandContent = (
    <>
      <div className={styles.brandHeader}>
        <Link
          href="/"
          className={`focus-ring inline-block rounded-lg text-white ${styles.brandLogoLink}`}
        >
          <DsjourneyLogo
            variant="horizontal"
            tone="public"
            className="h-10 w-auto text-white"
          />
        </Link>
      </div>

      <AuthEntrance className={styles.brandFooter}>
        <div className={styles.brandContent}>
          <DsjourneyLogo
            variant="mark"
            tone="public"
            brightDsLetters
            className={styles.brandMark}
          />
          <h2 className={styles.brandHeadline}>
            Your Data Science Journey Starts Here
          </h2>
          <p className={styles.brandDescription}>
            Learn, track, and grow into a Data Scientist with roadmap mastery,
            study sessions, analytics, readiness, and portfolio tracking in one
            place.
          </p>
        </div>
      </AuthEntrance>
    </>
  );

  return (
    <section
      className={styles.brandPanel}
      data-auth-brand-panel
      aria-hidden="true"
    >
      <div className={styles.brandBackground}>
        <div className="absolute inset-0 bg-gradient-to-br from-brand-navy via-[#071018] to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_40%,rgba(20,184,166,0.15),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(59,130,246,0.12),transparent_50%)]" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/20" />
      </div>

      {glowCursorDisabled ? (
        <div className={styles.brandInteractiveLayer}>{brandContent}</div>
      ) : (
        <GlowCursor
          className={styles.brandGlowHost}
          color="#67E8F9"
          secondaryColor="#3578E5"
          trailLength={40}
          trailWidth={8}
          trailTaper={0.8}
          followSpeed={0.16}
          glowIntensity={1.9}
          glowSpread={1.2}
          hotspot={0.65}
          brightness={1.25}
          opacity={1}
          pulseSpeed={1.1}
          noiseStrength={0.035}
          idleFade
          idleTimeout={700}
          fadeDuration={900}
          blendMode="screen"
          aria-hidden="true"
        >
          <div className={styles.brandInteractiveLayer}>{brandContent}</div>
        </GlowCursor>
      )}
    </section>
  );
}
