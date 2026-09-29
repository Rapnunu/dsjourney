import Link from "next/link";
import {
  MessageSquare,
  Shield,
  UserRound,
  Wrench,
} from "lucide-react";
import { getSupportEmail } from "@/lib/site-config";
import styles from "./contact-content.module.css";

const CONTACT_CATEGORIES = [
  {
    icon: UserRound,
    title: "Account Access",
    description: "Sign-in, verification, password reset, or account issues.",
  },
  {
    icon: Shield,
    title: "Privacy & Data",
    description: "Questions about stored data, privacy, or account deletion.",
  },
  {
    icon: Wrench,
    title: "Technical Support",
    description: "Problems using the dashboard, roadmap, sessions, or portfolio.",
  },
  {
    icon: MessageSquare,
    title: "Product Feedback",
    description: "Suggestions or feedback about DSJourney.",
  },
] as const;

export function ContactContent() {
  const supportEmail = getSupportEmail();

  return (
    <div className={styles.content}>
      <section className={styles.supportPanel} aria-labelledby="support-panel-heading">
        {supportEmail ? (
          <>
            <h2 id="support-panel-heading" className={styles.panelTitle}>
              Email Support
            </h2>
            <p className={styles.panelEmail}>
              <a href={`mailto:${supportEmail}`} className={styles.emailAddress}>
                {supportEmail}
              </a>
            </p>
            <p className={styles.panelCopy}>
              For account access, privacy questions, technical issues, and general
              product feedback.
            </p>
            <a
              href={`mailto:${supportEmail}`}
              className={`focus-ring ${styles.emailButton}`}
            >
              Email DSJourney
            </a>
          </>
        ) : (
          <>
            <h2 id="support-panel-heading" className={styles.panelTitle}>
              Support contact coming soon
            </h2>
            <p className={styles.panelCopy}>
              Support contact information will be available when DSJourney launches.
            </p>
          </>
        )}
      </section>

      <section aria-labelledby="help-categories-heading">
        <h2 id="help-categories-heading" className={styles.sectionHeading}>
          What can we help with?
        </h2>
        <ul className={styles.categoryGrid}>
          {CONTACT_CATEGORIES.map((category) => {
            const Icon = category.icon;

            return (
              <li key={category.title} className={styles.categoryCard}>
                <div className={styles.categoryIconWrap} aria-hidden="true">
                  <Icon size={18} />
                </div>
                <h3 className={styles.categoryTitle}>{category.title}</h3>
                <p className={styles.categoryDescription}>{category.description}</p>
              </li>
            );
          })}
        </ul>
      </section>

      <section className={styles.relatedSection} aria-labelledby="related-links-heading">
        <h2 id="related-links-heading" className={styles.sectionHeading}>
          Related information
        </h2>
        <div className={styles.relatedLinks}>
          <Link href="/privacy" className={`focus-ring ${styles.relatedLink}`}>
            Privacy Policy
          </Link>
          <Link href="/terms" className={`focus-ring ${styles.relatedLink}`}>
            Terms of Service
          </Link>
        </div>
      </section>
    </div>
  );
}
