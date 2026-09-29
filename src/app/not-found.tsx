import Link from "next/link";
import contactStyles from "@/components/public/contact-page.module.css";
import { PublicPageShell } from "@/components/public/public-page-shell";
import shellStyles from "@/components/public/public-page-shell.module.css";

export default function NotFound() {
  return (
    <PublicPageShell>
      <main>
        <div className={`${shellStyles.container} ${contactStyles.contactHero}`}>
          <p className={contactStyles.eyebrow}>404</p>
          <h1 className={contactStyles.title}>Lost on your journey?</h1>
          <p className={contactStyles.description}>
            The page you&apos;re looking for doesn&apos;t exist or may have moved.
          </p>
          <div className="mt-8">
            <Link
              href="/"
              className="focus-ring inline-flex min-h-11 items-center justify-center rounded-lg bg-brand-teal px-5 py-2.5 text-sm font-semibold text-[#071016] transition-colors hover:bg-brand-teal/90"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    </PublicPageShell>
  );
}
