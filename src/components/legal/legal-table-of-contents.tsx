import type { LegalSectionItem } from "@/components/legal/legal-sections";
import styles from "./legal-table-of-contents.module.css";

interface LegalTableOfContentsProps {
  sections: LegalSectionItem[];
}

function formatSectionNumber(index: number): string {
  return String(index + 1).padStart(2, "0");
}

function TocLinks({ sections }: LegalTableOfContentsProps) {
  return (
    <ol className={styles.list}>
      {sections.map((section, index) => (
        <li key={section.id}>
          <a href={`#${section.id}`} className={styles.link}>
            <span className={styles.linkNumber}>{formatSectionNumber(index)}</span>
            <span className={styles.linkLabel}>{section.label}</span>
          </a>
        </li>
      ))}
    </ol>
  );
}

export function LegalTableOfContents({ sections }: LegalTableOfContentsProps) {
  return (
    <>
      <details className={styles.mobileToc}>
        <summary className={styles.mobileSummary}>On this page</summary>
        <nav className={styles.mobileNav} aria-label="On this page">
          <TocLinks sections={sections} />
        </nav>
      </details>

      <aside className={styles.desktopToc} aria-label="On this page">
        <p className={styles.desktopLabel}>On this page</p>
        <nav>
          <TocLinks sections={sections} />
        </nav>
      </aside>
    </>
  );
}
