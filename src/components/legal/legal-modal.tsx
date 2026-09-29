"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Link from "next/link";
import { X } from "lucide-react";
import { LEGAL_EFFECTIVE_DATE } from "@/lib/site-config";
import { PrivacyContent } from "@/components/legal/privacy-content";
import { TermsContent } from "@/components/legal/terms-content";
import pageStyles from "@/components/legal/legal-page.module.css";
import styles from "@/components/legal/legal-modal.module.css";

export type LegalDocumentType = "terms" | "privacy";

const LEGAL_DOCUMENTS: Record<
  LegalDocumentType,
  { title: string; href: string }
> = {
  terms: {
    title: "Terms of Service",
    href: "/terms",
  },
  privacy: {
    title: "Privacy Policy",
    href: "/privacy",
  },
};

interface LegalModalProps {
  type: LegalDocumentType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LegalModal({ type, open, onOpenChange }: LegalModalProps) {
  const document = LEGAL_DOCUMENTS[type];

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content
          className={styles.content}
          aria-describedby={undefined}
        >
          <header className={styles.header}>
            <div>
              <Dialog.Title className={styles.title}>
                {document.title}
              </Dialog.Title>
              <p className={styles.effectiveDate}>
                Effective {LEGAL_EFFECTIVE_DATE}
              </p>
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                className={`focus-ring ${styles.closeButton}`}
                aria-label="Close"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </Dialog.Close>
          </header>

          <div className={`${pageStyles.contentModal} ${styles.body}`}>
            {type === "terms" ? <TermsContent /> : <PrivacyContent />}
          </div>

          <footer className={styles.footer}>
            <Link href={document.href} className={styles.fullPageLink}>
              Open full page →
            </Link>
            <Dialog.Close asChild>
              <button type="button" className={`focus-ring ${styles.closeAction}`}>
                Close
              </button>
            </Dialog.Close>
          </footer>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
