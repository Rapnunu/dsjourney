"use client";

import { LegalModalLinkButton } from "@/components/auth/legal-modal-link-button";
import styles from "./auth-legal-links.module.css";

export function AuthLegalLinks() {
  return (
    <nav className={styles.links} aria-label="Legal">
      <LegalModalLinkButton type="terms" className={`focus-ring ${styles.link}`}>
        Terms
      </LegalModalLinkButton>
      <span className={styles.separator} aria-hidden="true">
        ·
      </span>
      <LegalModalLinkButton
        type="privacy"
        className={`focus-ring ${styles.link}`}
      >
        Privacy
      </LegalModalLinkButton>
    </nav>
  );
}
