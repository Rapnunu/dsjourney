"use client";

import { useState, useEffect } from "react";

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

export function WelcomeHeader() {
  const [mounted, setMounted] = useState(false);
  const [greeting, setGreeting] = useState("Welcome back");
  const [dateStr, setDateStr] = useState("");

  useEffect(() => {
    setGreeting(getGreeting());
    setDateStr(getFormattedDate());
    setMounted(true);
  }, []);

  return (
    <div className="mb-8">
      <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-text-primary">
        <span
          className={`inline-block transition-opacity duration-300 ${mounted ? "opacity-100" : "opacity-0"}`}
        >
          {greeting},{" "}
        </span>
        <span className="text-accent">Raphael</span>
      </h1>
      <p
        className={`mt-1 text-sm text-text-secondary transition-opacity duration-300 ${mounted ? "opacity-100" : "opacity-0"}`}
      >
        {dateStr || "\u00A0"}
      </p>
    </div>
  );
}

