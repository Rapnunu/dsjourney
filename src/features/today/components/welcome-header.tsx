"use client";

import { useSyncExternalStore } from "react";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function getFormattedDate(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function subscribeToClock(onStoreChange: () => void) {
  const intervalId = window.setInterval(onStoreChange, 60_000);
  return () => window.clearInterval(intervalId);
}

function getClientGreetingSnapshot(): string {
  return getGreeting();
}

function getServerGreetingSnapshot(): string {
  return "Welcome back";
}

function getClientDateSnapshot(): string {
  return getFormattedDate();
}

function getServerDateSnapshot(): string {
  return "";
}

export function WelcomeHeader() {
  const greeting = useSyncExternalStore(
    subscribeToClock,
    getClientGreetingSnapshot,
    getServerGreetingSnapshot,
  );
  const dateStr = useSyncExternalStore(
    subscribeToClock,
    getClientDateSnapshot,
    getServerDateSnapshot,
  );
  const mounted = dateStr.length > 0;

  return (
    <header className="mb-8">
      <h1 className="text-[1.75rem] font-semibold tracking-tight text-text-primary sm:text-[2rem]">
        <span
          className={`inline-block transition-opacity duration-300 ${mounted ? "opacity-100" : "opacity-0"}`}
        >
          {greeting},{" "}
        </span>
        <span className="text-brand-teal">Raphael</span>
      </h1>
      <p
        className={`mt-1 text-sm text-text-secondary transition-opacity duration-300 ${mounted ? "opacity-100" : "opacity-0"}`}
      >
        {dateStr || "\u00A0"}
      </p>
      <p className="mt-2 text-sm text-text-muted">
        Here&apos;s what to focus on and complete today.
      </p>
    </header>
  );
}
