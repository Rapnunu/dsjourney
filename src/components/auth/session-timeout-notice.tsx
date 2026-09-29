"use client";

import { useEffect } from "react";

interface SessionTimeoutNoticeProps {
  show: boolean;
}

export function SessionTimeoutNotice({ show }: SessionTimeoutNoticeProps) {
  useEffect(() => {
    if (!show || typeof window === "undefined") {
      return;
    }

    const url = new URL(window.location.href);

    if (url.searchParams.get("reason") === "timeout") {
      url.searchParams.delete("reason");
      const nextUrl = `${url.pathname}${url.search}${url.hash}`;
      window.history.replaceState({}, "", nextUrl);
    }
  }, [show]);

  if (!show) {
    return null;
  }

  return (
    <div
      role="status"
      className="mb-4 rounded-[9px] border border-brand-teal/30 bg-brand-teal/10 px-3 py-3 text-sm"
    >
      <p className="font-semibold text-text-primary">Session expired</p>
      <p className="mt-1 text-text-secondary">
        You were signed out after a period of inactivity. Sign in to continue.
      </p>
    </div>
  );
}
