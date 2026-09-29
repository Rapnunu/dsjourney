import type { ReactNode } from "react";
import { PublicFooter } from "@/components/public/public-footer";
import {
  PublicHeader,
  type PublicNavPage,
} from "@/components/public/public-header";
import styles from "./public-page-shell.module.css";

interface PublicPageShellProps {
  activePage?: PublicNavPage;
  children: ReactNode;
}

export function PublicPageShell({ activePage, children }: PublicPageShellProps) {
  return (
    <div className={`public-page ${styles.shell}`}>
      <PublicHeader activePage={activePage} />
      {children}
      <PublicFooter />
    </div>
  );
}
