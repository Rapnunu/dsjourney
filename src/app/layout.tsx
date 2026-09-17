import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SidebarProvider } from "@/components/layout/sidebar-context";
import { AppShell } from "@/components/layout/app-shell";
import { AppToaster } from "@/components/ui/app-toaster";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "DSJourney",
    template: "%s | DSJourney",
  },
  description:
    "Track your Data Science learning journey, study progress, portfolio, analytics, and career readiness.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} dark h-full antialiased`}>
      <body className="h-full">
        <SidebarProvider>
          <AppShell>{children}</AppShell>
          <AppToaster />
        </SidebarProvider>
      </body>
    </html>
  );
}
