import type { ReactNode } from "react";
import type { LegalSectionItem } from "@/components/legal/legal-sections";
import { LegalTableOfContents } from "@/components/legal/legal-table-of-contents";
import { PublicPageShell } from "@/components/public/public-page-shell";
import type { PublicNavPage } from "@/components/public/public-header";
import { LEGAL_EFFECTIVE_DATE } from "@/lib/site-config";
import shellStyles from "@/components/public/public-page-shell.module.css";
import styles from "./legal-page.module.css";

interface LegalPageLayoutProps {
  activePage: Extract<PublicNavPage, "terms" | "privacy">;
  eyebrow: string;
  title: string;
  description: string;
  sections: LegalSectionItem[];
  children: ReactNode;
}

export function LegalPageLayout({
  activePage,
  eyebrow,
  title,
  description,
  sections,
  children,
}: LegalPageLayoutProps) {
  return (
    <PublicPageShell activePage={activePage}>
      <main className={styles.main} id="top">
        <div className={`${shellStyles.container} ${styles.hero}`}>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h1 className={styles.heroTitle}>{title}</h1>
          <p className={styles.heroDescription}>{description}</p>
          <p className={styles.effectiveBadge}>Effective {LEGAL_EFFECTIVE_DATE}</p>
        </div>

        <div className={`${shellStyles.container} ${styles.documentArea}`}>
          <div className={styles.documentGrid}>
            <LegalTableOfContents sections={sections} />
            <article className={styles.document}>
              <div className={styles.documentBody}>{children}</div>
              <p className={styles.backToTop}>
                <a href="#top" className={styles.backToTopLink}>
                  Back to top ↑
                </a>
              </p>
            </article>
          </div>
        </div>
      </main>
    </PublicPageShell>
  );
}
