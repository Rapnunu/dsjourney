import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SidebarProvider } from "@/components/layout/sidebar-context";
import { AppShell } from "@/components/layout/app-shell";
import { AppToaster } from "@/components/ui/app-toaster";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { createRootMetadata } from "@/lib/metadata";
import { THEME_COLOR } from "@/lib/site-config";
import { THEME_STORAGE_KEY } from "@/lib/theme";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const themeInitScript = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");var theme=t==="light"?"light":"dark";var r=document.documentElement;r.classList.add(theme);r.style.colorScheme=theme;}catch(e){document.documentElement.classList.add("dark");document.documentElement.style.colorScheme="dark";}})();`;

export const metadata: Metadata = createRootMetadata();

export const viewport: Viewport = {
  themeColor: THEME_COLOR,
  colorScheme: "dark light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="h-full">
        <ThemeProvider>
          <SidebarProvider>
            <AppShell>{children}</AppShell>
            <AppToaster />
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
