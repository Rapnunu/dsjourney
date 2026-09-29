import type { ReactNode } from "react";
import styles from "./legal-page.module.css";

interface LegalSectionProps {
  id: string;
  title: string;
  children: ReactNode;
}

function parseSectionTitle(title: string): { number: string; label: string } {
  const match = title.match(/^(\d+)\.\s*(.+)$/);

  if (!match) {
    return { number: "", label: title };
  }

  return {
    number: match[1].padStart(2, "0"),
    label: match[2],
  };
}

export function LegalSection({ id, title, children }: LegalSectionProps) {
  const { number, label } = parseSectionTitle(title);

  return (
    <section
      id={id}
      className={styles.section}
      aria-labelledby={`${id}-heading`}
    >
      <header className={styles.sectionHeader}>
        {number ? <span className={styles.sectionNumber}>{number}</span> : null}
        <h2 id={`${id}-heading`} className={styles.sectionTitle}>
          {label}
        </h2>
        <div className={styles.sectionDivider} aria-hidden="true" />
      </header>
      <div className={styles.sectionBody}>{children}</div>
    </section>
  );
}
