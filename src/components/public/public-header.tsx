"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DsjourneyLogo } from "@/components/brand/dsjourney-logo";
import { ThemeToggleCompact } from "@/components/theme/theme-toggle";
import { useTheme } from "@/components/theme/theme-provider";
import styles from "./public-header.module.css";

export type PublicNavPage = "home" | "terms" | "privacy" | "contact";

interface PublicHeaderProps {
  activePage?: PublicNavPage;
}

const NAV_ITEMS: { page: PublicNavPage; label: string; href: string }[] = [
  { page: "home", label: "Home", href: "/" },
  { page: "terms", label: "Terms", href: "/terms" },
  { page: "privacy", label: "Privacy", href: "/privacy" },
  { page: "contact", label: "Contact", href: "/contact" },
];

export function PublicHeader({ activePage }: PublicHeaderProps) {
  const pathname = usePathname();
  const { theme } = useTheme();

  function isActive(page: PublicNavPage, href: string): boolean {
    if (activePage) {
      return activePage === page;
    }

    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={`focus-ring ${styles.logoLink}`} aria-label="DSJourney home">
          <DsjourneyLogo
            variant="horizontal"
            tone={theme === "dark" ? "public" : "default"}
            className="h-8 w-auto text-text-primary sm:h-9"
          />
        </Link>

        <div className={styles.actions}>
          <ThemeToggleCompact className={styles.themeToggle} />
          <nav className={styles.nav} aria-label="Public site">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.page, item.href);

            return (
              <Link
                key={item.page}
                href={item.href}
                className={`focus-ring ${styles.navLink} ${active ? styles.navLinkActive : ""}`}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
          </nav>
        </div>
      </div>
    </header>
  );
}
