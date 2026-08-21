import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SidebarProvider } from "@/components/layout/sidebar-context";
import { SessionProvider } from "@/features/sessions/session-provider";
import { AppShell } from "@/components/layout/app-shell";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DS Prep Tracker",
  description: "Track your data science interview preparation progress",
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
          <SessionProvider>
            <AppShell>{children}</AppShell>
          </SessionProvider>
        </SidebarProvider>
      </body>
    </html>
  );
}

