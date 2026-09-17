"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { DASHBOARD_SCROLL_ID } from "@/components/dashboard/constants";
import { SessionProvider } from "@/features/sessions/session-provider";
import { RoadmapProvider } from "@/features/roadmap/roadmap-provider";
import { PortfolioProvider } from "@/features/portfolio/portfolio-provider";
import { Sidebar } from "./sidebar";
import { MobileNavTrigger } from "./mobile-nav-trigger";

function AuthenticatedShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-bg-primary">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <MobileNavTrigger />
        <main id={DASHBOARD_SCROLL_ID} className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1480px] px-5 py-5 sm:px-8 sm:py-6 lg:px-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/" || pathname.startsWith("/auth")) {
    return <>{children}</>;
  }

  return (
    <SessionProvider>
      <RoadmapProvider>
        <PortfolioProvider>
          <AuthenticatedShell>{children}</AuthenticatedShell>
        </PortfolioProvider>
      </RoadmapProvider>
    </SessionProvider>
  );
}
