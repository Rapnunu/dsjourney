import Link from "next/link";
import { LegalCallout } from "@/components/legal/legal-callout";
import { LegalSection } from "@/components/legal/legal-section";
import { getSupportEmail, SITE_NAME } from "@/lib/site-config";
import styles from "@/components/legal/legal-page.module.css";

export function TermsContent() {
  const supportEmail = getSupportEmail();

  return (
    <>
      <LegalSection id="acceptance" title="1. Acceptance of Terms">
        <p>
          By accessing or using {SITE_NAME}, you agree to these Terms of
          Service. If you do not agree, do not use the service.
        </p>
      </LegalSection>

      <LegalSection id="about" title="2. About DSJourney">
        <p>
          {SITE_NAME} is a personal productivity and learning application for
          Data Science career preparation. It helps you track roadmap progress,
          log study sessions, review analytics, monitor readiness indicators,
          and manage portfolio projects.
        </p>
        <p>
          {SITE_NAME} is an educational and organizational tool. It does not
          provide guaranteed employment outcomes, internship placement, or
          professional certification.
        </p>
      </LegalSection>

      <LegalSection id="registration" title="3. Account Registration">
        <p>
          To use most features, you must create an account with a valid email
          address and password, or sign in with Google where that option is
          available. You agree to provide accurate information and to keep your
          account details up to date.
        </p>
        <p>
          You must be legally able to enter into these Terms before creating an
          account.
        </p>
      </LegalSection>

      <LegalSection id="security" title="4. Account Security">
        <p>
          You are responsible for maintaining the confidentiality of your login
          credentials and for activity that occurs under your account. Notify us
          promptly if you believe your account has been accessed without
          authorization.
        </p>
        <p>
          {SITE_NAME} provides self-service password recovery through email reset
          codes on the sign-in page.
        </p>
      </LegalSection>

      <LegalSection id="sign-in-methods" title="5. Email and Social Sign-In">
        <p>
          {SITE_NAME} supports email and password registration, email
          verification by one-time code, and optional Google Sign-In. When you
          use Google Sign-In, authentication is handled through Google and our
          authentication provider.
        </p>
        <p>
          Your use of Google services is also subject to Google&apos;s terms and
          policies.
        </p>
      </LegalSection>

      <LegalSection id="acceptable-use" title="6. Acceptable Use">
        <p>You agree not to misuse {SITE_NAME}. For example, you must not:</p>
        <ul>
          <li>Attempt to gain unauthorized access to accounts, data, or systems</li>
          <li>Interfere with or disrupt the service or its infrastructure</li>
          <li>Use the service for unlawful, harmful, or abusive purposes</li>
          <li>Upload or store content that violates applicable law or others&apos; rights</li>
          <li>Reverse engineer or scrape the service in a way that harms availability</li>
        </ul>
      </LegalSection>

      <LegalSection id="user-content" title="7. User Content and Data">
        <p>
          You may enter learning data such as study sessions, roadmap progress,
          notes, and portfolio project details. You retain responsibility for
          the content you submit and for ensuring you have the right to store
          and use it in {SITE_NAME}.
        </p>
        <p>
          You grant {SITE_NAME} the limited rights needed to store, process, and
          display your content solely to operate the service for you.
        </p>
      </LegalSection>

      <LegalSection id="disclaimer-education" title="8. Educational / Career Preparation Disclaimer">
        <LegalCallout>
          <p>
            Readiness scores, recommendations, analytics, and progress indicators
            in {SITE_NAME} are informational only. They are based on data you
            enter and on the application&apos;s internal calculations.
          </p>
          <p>
            These features do not guarantee interviews, internships, employment,
            admissions, or specific career outcomes. You are responsible for your
            own learning decisions and job search activities.
          </p>
        </LegalCallout>
      </LegalSection>

      <LegalSection id="availability" title="9. Service Availability">
        <p>
          We aim to keep {SITE_NAME} available and reliable, but the service may
          be interrupted for maintenance, updates, outages, or circumstances
          outside our reasonable control. Features may change over time.
        </p>
      </LegalSection>

      <LegalSection id="third-party" title="10. Third-Party Services">
        <p>
          {SITE_NAME} relies on third-party providers for core infrastructure,
          including authentication and database hosting (Neon), optional Google
          Sign-In (Google), and application hosting (Vercel). Those providers
          perform their own roles in delivering the service and are subject to
          their own terms and policies.
        </p>
        <p>
          Linking to or signing in through a third-party service does not mean
          that provider receives all of your {SITE_NAME} learning data.
        </p>
      </LegalSection>

      <LegalSection id="intellectual-property" title="11. Intellectual Property">
        <p>
          {SITE_NAME}, including its design, branding, software, and bundled
          learning structure, is owned by the service operator and protected by
          applicable intellectual property laws. These Terms do not grant you
          ownership of the service itself.
        </p>
      </LegalSection>

      <LegalSection id="suspension" title="12. Account Suspension or Termination">
        <p>
          We may suspend or terminate access to {SITE_NAME} if we reasonably
          believe you have violated these Terms, created security risk, or
          misused the service. You may stop using the service at any time by
          signing out and discontinuing use.
        </p>
      </LegalSection>

      <LegalSection id="deletion" title="13. Account Deletion">
        <LegalCallout>
          <p>
            You can delete your DSJourney account and associated application data
            at any time from Settings. Account deletion removes your authentication
            account, roadmap progress, study sessions, and portfolio projects tied
            to that account.
          </p>
        </LegalCallout>
        <p>
          Deletion is intended to remove active application records promptly.
          Residual copies may remain temporarily in system backups or logs while
          those systems complete their normal retention cycles.
        </p>
        <p>
          You can also delete individual study sessions, roadmap progress
          overrides, and portfolio projects within the app without deleting your
          authentication account.
        </p>
      </LegalSection>

      <LegalSection id="warranties" title="14. Disclaimer of Warranties">
        <p>
          {SITE_NAME} is provided on an &quot;as is&quot; and &quot;as
          available&quot; basis to the extent permitted by applicable law. We
          do not warrant that the service will be uninterrupted, error-free, or
          fit for any particular purpose.
        </p>
      </LegalSection>

      <LegalSection id="liability" title="15. Limitation of Liability">
        <p>
          To the extent permitted by applicable law, the service operator will
          not be liable for indirect, incidental, special, consequential, or
          punitive damages, or for loss of profits, data, or goodwill arising
          from your use of {SITE_NAME}.
        </p>
        <p>
          Our total liability for any claim relating to the service is limited
          to the amount you paid to use {SITE_NAME} during the twelve months
          before the event giving rise to the claim, or zero if the service was
          free.
        </p>
      </LegalSection>

      <LegalSection id="service-changes" title="16. Changes to the Service">
        <p>
          We may modify, add, or remove features over time. If a change
          materially affects how you use {SITE_NAME}, we will take reasonable
          steps to communicate it where appropriate.
        </p>
      </LegalSection>

      <LegalSection id="terms-changes" title="17. Changes to These Terms">
        <p>
          We may update these Terms from time to time. When we do, we will
          update the effective date at the top of this page. Continued use of
          {SITE_NAME} after changes become effective means you accept the
          updated Terms.
        </p>
      </LegalSection>

      <LegalSection id="governing-law" title="18. Governing / Applicable Law">
        <p>These Terms are governed by applicable law.</p>
        <p className={styles.reviewNote}>
          Operator note: confirm the governing jurisdiction with legal counsel
          before production launch.
        </p>
      </LegalSection>

      <LegalSection id="contact" title="19. Contact">
        {supportEmail ? (
          <p>
            Questions about these Terms may be sent to{" "}
            <a href={`mailto:${supportEmail}`}>{supportEmail}</a>.
          </p>
        ) : (
          <p>
            Questions about these Terms may be sent through our{" "}
            <Link href="/contact">Contact page</Link>.
          </p>
        )}
        <p>
          See also our <Link href="/privacy">Privacy Policy</Link>.
        </p>
      </LegalSection>
    </>
  );
}
