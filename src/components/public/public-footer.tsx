import Link from "next/link";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site-config";
import styles from "./public-footer.module.css";

export function PublicFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div>
          <p className={styles.footerBrand}>{SITE_NAME}</p>
          <p className={styles.footerTagline}>{SITE_TAGLINE}</p>
        </div>

        <nav className={styles.footerNav} aria-label="Legal and product links">
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/contact">Contact</Link>
        </nav>

        <p className={styles.copyright}>© 2026 {SITE_NAME}</p>
      </div>
    </footer>
  );
}
