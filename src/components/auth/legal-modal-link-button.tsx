"use client";

import type { ReactNode } from "react";
import { useAuthLegalModal } from "@/components/auth/auth-legal-modal-provider";
import type { LegalDocumentType } from "@/components/legal/legal-modal";
import styles from "./legal-modal-link-button.module.css";

interface LegalModalLinkButtonProps {
  type: LegalDocumentType;
  children: ReactNode;
  className?: string;
}

export function LegalModalLinkButton({
  type,
  children,
  className,
}: LegalModalLinkButtonProps) {
  const { openLegalModal } = useAuthLegalModal();

  return (
    <button
      type="button"
      className={[styles.button, className].filter(Boolean).join(" ")}
      onClick={() => openLegalModal(type)}
    >
      {children}
    </button>
  );
}
