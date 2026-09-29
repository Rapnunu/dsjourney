"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useId, useState, type ReactNode } from "react";
import styles from "./faq-section.module.css";

export interface FaqItem {
  id: string;
  question: string;
  answer: ReactNode;
}

interface FaqAccordionProps {
  items: FaqItem[];
}

export function FaqAccordion({ items }: FaqAccordionProps) {
  const baseId = useId();
  const [openId, setOpenId] = useState<string | null>(null);

  function toggleItem(id: string) {
    setOpenId((current) => (current === id ? null : id));
  }

  return (
    <div className={styles.accordion}>
      {items.map((item) => {
        const isOpen = openId === item.id;
        const triggerId = `${baseId}-${item.id}-trigger`;
        const panelId = `${baseId}-${item.id}-panel`;

        return (
          <article key={item.id} className={styles.item}>
            <h3 className={styles.questionHeading}>
              <button
                type="button"
                id={triggerId}
                className={styles.trigger}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggleItem(item.id)}
              >
                <span className={styles.questionText}>{item.question}</span>
                <span
                  className={`${styles.iconWrap} ${isOpen ? styles.iconWrapOpen : ""}`}
                  aria-hidden="true"
                >
                  <ChevronDown size={20} strokeWidth={1.75} />
                </span>
              </button>
            </h3>

            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              aria-hidden={!isOpen}
              className={`${styles.panel} ${isOpen ? styles.panelOpen : ""}`}
            >
              <div className={styles.panelInner}>
                <div className={styles.answer}>{item.answer}</div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: "what-is-dsjourney",
    question: "What is DSJourney?",
    answer: (
      <p>
        DSJourney is a Data Science learning tracker that helps you organize your
        roadmap, log study sessions, understand your progress, measure internship
        readiness, and build your portfolio in one place.
      </p>
    ),
  },
  {
    id: "roadmap-vs-readiness",
    question:
      "What is the difference between Roadmap Progress and Internship Readiness?",
    answer: (
      <>
        <p>
          Roadmap Progress measures your learning progress across the topics in your
          Data Science roadmap.
        </p>
        <p>
          Internship Readiness is a broader indicator that considers progress across
          learning categories together with portfolio development.
        </p>
        <p>
          They are related metrics, but they intentionally use different
          calculations.
        </p>
      </>
    ),
  },
  {
    id: "readiness-calculated",
    question: "How is Internship Readiness calculated?",
    answer: (
      <>
        <p>
          DSJourney uses your progress across the learning categories in your roadmap
          together with your portfolio development to create an overall readiness
          indicator.
        </p>
        <p>
          The score is designed to help you identify areas that may need more
          attention. It is informational and does not guarantee an internship,
          interview, or job offer.
        </p>
      </>
    ),
  },
  {
    id: "google-sign-in",
    question: "Can I sign in with Google?",
    answer: (
      <>
        <p>
          Yes. DSJourney supports Google Sign-In as well as email and password
          authentication.
        </p>
        <p>
          Users who register with email and password must verify their email before
          using the account.
        </p>
      </>
    ),
  },
  {
    id: "forgot-password",
    question: "What happens if I forget my password?",
    answer: (
      <>
        <p>You can use the Forgot Password option on the Sign In page.</p>
        <p>
          DSJourney will send a verification code to your email address so you can
          create a new password securely.
        </p>
      </>
    ),
  },
  {
    id: "data-stored",
    question: "What data does DSJourney store?",
    answer: (
      <>
        <p>
          Depending on the features you use, DSJourney may store your account
          information, roadmap progress, study sessions, study notes, portfolio
          project information, and related learning progress data.
        </p>
        <p>
          For complete details, review the{" "}
          <Link href="/privacy" className={styles.inlineLink}>
            Privacy Policy
          </Link>
          .
        </p>
      </>
    ),
  },
  {
    id: "delete-account",
    question: "Can I delete my account and data?",
    answer: (
      <>
        <p>Yes.</p>
        <p>You can permanently delete your account from Settings → Danger Zone.</p>
        <p>
          Deleting your account removes your DSJourney account and associated
          application data such as roadmap progress, study sessions, and portfolio
          projects.
        </p>
        <p>This action cannot be undone.</p>
      </>
    ),
  },
  {
    id: "readiness-guarantee",
    question: "Is my Internship Readiness score a guarantee?",
    answer: (
      <>
        <p>No.</p>
        <p>
          DSJourney readiness scores, recommendations, and analytics are learning
          and career-preparation indicators only.
        </p>
        <p>
          They do not guarantee internships, interviews, employment, admissions, or
          professional certification.
        </p>
      </>
    ),
  },
];
