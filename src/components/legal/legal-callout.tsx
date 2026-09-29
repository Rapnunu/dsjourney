import type { ReactNode } from "react";
import styles from "./legal-page.module.css";

interface LegalCalloutProps {
  children: ReactNode;
}

export function LegalCallout({ children }: LegalCalloutProps) {
  return <div className={styles.callout}>{children}</div>;
}
