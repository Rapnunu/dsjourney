import { ContactContent } from "@/components/public/contact-content";
import contactStyles from "@/components/public/contact-page.module.css";
import { PublicPageShell } from "@/components/public/public-page-shell";
import shellStyles from "@/components/public/public-page-shell.module.css";
import { createPublicMetadata } from "@/lib/metadata";

export const metadata = createPublicMetadata({
  title: "Contact",
  description:
    "Contact DSJourney for account, privacy, technical, or general support questions.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <PublicPageShell activePage="contact">
      <main>
        <div className={`${shellStyles.container} ${contactStyles.contactHero}`}>
          <p className={contactStyles.eyebrow}>SUPPORT</p>
          <h1 className={contactStyles.title}>Contact DSJourney</h1>
          <p className={contactStyles.description}>
            Need help with your account, privacy, or the application?
          </p>
          <p className={contactStyles.subdescription}>
            We&apos;re here to point you in the right direction.
          </p>
        </div>

        <div className={`${shellStyles.container} ${contactStyles.contentArea}`}>
          <div className={contactStyles.contentWrap}>
            <ContactContent />
          </div>
        </div>
      </main>
    </PublicPageShell>
  );
}
