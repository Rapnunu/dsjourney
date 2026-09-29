import { redirect } from "next/navigation";
import { DsjourneyLogo } from "@/components/brand/dsjourney-logo";
import { mapOAuthQueryError } from "@/lib/auth/auth-errors";
import { auth } from "@/lib/auth/server";
import { createAuthMetadata } from "@/lib/metadata";
import Link from "next/link";
import { SessionTimeoutNotice } from "@/components/auth/session-timeout-notice";
import { AuthBrandPanel } from "./auth-brand-panel";
import { AuthEntrance } from "./auth-entrance";
import { AuthLegalShell } from "./auth-legal-shell";
import styles from "./auth-page.module.css";

interface AuthPageProps {
  searchParams: Promise<{
    error?: string;
    message?: string;
    mode?: string;
    account?: string;
    reason?: string;
  }>;
}

const ACCOUNT_DELETED_MESSAGE =
  "Account deleted\n\nYour DSJourney account and associated application data have been deleted.";

export const metadata = createAuthMetadata("Sign In");

export const dynamic = "force-dynamic";

export default async function AuthPage({ searchParams }: AuthPageProps) {
  const { data: session } = await auth.getSession();

  if (session?.user) {
    redirect("/today");
  }

  const params = await searchParams;
  const initialMode = params.mode === "signup" ? "sign_up" : "sign_in";
  const initialError = mapOAuthQueryError(params.error);
  const showTimeoutNotice = params.reason === "timeout";
  const initialMessage =
    params.account === "deleted"
      ? ACCOUNT_DELETED_MESSAGE
      : params.message;

  return (
    <main className={`public-page ${styles.authLayout}`}>
      <AuthBrandPanel />

      <section className={styles.authPanel}>
        <div className={`${styles.mobileBackdrop} lg:hidden`}>
          <div className={styles.mobileBackdropGradient} />
        </div>

        <div className={styles.authPanelInner}>
          <div className={styles.mobileLogoWrap}>
            <Link href="/" className="focus-ring rounded-lg text-white">
              <DsjourneyLogo variant="horizontal" tone="public" className="h-8 w-auto" />
            </Link>
          </div>

          <AuthEntrance delay={0.08}>
            <SessionTimeoutNotice show={showTimeoutNotice} />
            <AuthLegalShell
              initialError={initialError}
              initialMessage={initialMessage}
              initialMode={initialMode}
            />
          </AuthEntrance>
        </div>
      </section>
    </main>
  );
}
