import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SidebarProvider } from "@/components/layout/sidebar-context";
import { AppShell } from "@/components/layout/app-shell";
import { AppToaster } from "@/components/ui/app-toaster";
import { createRootMetadata } from "@/lib/metadata";
import { THEME_COLOR } from "@/lib/site-config";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = createRootMetadata();

export const viewport: Viewport = {
  themeColor: THEME_COLOR,
  colorScheme: "dark",
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
