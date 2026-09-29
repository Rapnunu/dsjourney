"use client";

import { AuthLegalLinks } from "@/components/auth/auth-legal-links";
import { AuthLegalModalProvider } from "@/components/auth/auth-legal-modal-provider";
import { AuthForm } from "@/app/auth/auth-form";
import styles from "@/app/auth/auth-page.module.css";

interface AuthLegalShellProps {
  initialError?: string;
  initialMessage?: string;
  initialMode?: "sign_in" | "sign_up";
  showDemoSection?: boolean;
  demoLoginAvailable?: boolean;
}

export function AuthLegalShell({
  initialError,
  initialMessage,
  initialMode,
  showDemoSection,
  demoLoginAvailable,
}: AuthLegalShellProps) {
  return (
    <AuthLegalModalProvider>
      <div className={styles.authCard}>
        <AuthForm
          initialError={initialError}
          initialMessage={initialMessage}
          initialMode={initialMode}
          showDemoSection={showDemoSection}
          demoLoginAvailable={demoLoginAvailable}
        />
      </div>
      <AuthLegalLinks />
    </AuthLegalModalProvider>
  );
}
