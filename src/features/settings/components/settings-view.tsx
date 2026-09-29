"use client";

import { useState } from "react";
import Link from "next/link";
import { Settings } from "lucide-react";
import { SectionCard } from "@/components/dashboard/section-card";
import { PageHeader } from "@/components/ui/page-header";
import { getSupportEmail } from "@/lib/site-config";
import type { SettingsAccountData } from "@/app/settings/actions";
import { ChangePasswordForm } from "./change-password-form";
import { DeleteAccountDialog } from "./delete-account-dialog";
import { SettingsDataSummary } from "./settings-data-summary";

interface SettingsViewProps {
  account: SettingsAccountData;
}

function AccountField({
  label,
  value,
  children,
}: {
  label: string;
  value?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <dt className="text-xs font-medium uppercase tracking-wide text-text-muted">
        {label}
      </dt>
      <dd className="text-sm text-text-primary">{children ?? value ?? "—"}</dd>
    </div>
  );
}

function VerificationBadge({ verified }: { verified: boolean }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
        verified
          ? "bg-success/10 text-success"
          : "bg-warning/10 text-warning"
      }`}
    >
      {verified ? "Verified" : "Not verified"}
    </span>
  );
}

export function SettingsView({ account }: SettingsViewProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const supportEmail = getSupportEmail();

  return (
    <div>
      <PageHeader
        title="Settings"
        subtitle="Manage your DSJourney account and security."
        icon={<Settings size={22} />}
      />

      <div className="space-y-6">
        <SectionCard title="Account">
          <dl className="grid gap-5 sm:grid-cols-2">
            <AccountField label="Email" value={account.email || "—"} />
            <AccountField label="Display name" value={account.name || "—"} />
            <AccountField label="Status">
              <VerificationBadge verified={account.emailVerified} />
            </AccountField>
            <AccountField label="Sign-in methods">
              {account.providersUnavailable ? (
                <span className="text-text-secondary">
                  Sign-in methods are unavailable right now.
                </span>
              ) : account.signInMethodLabels.length > 0 ? (
                <span>{account.signInMethodLabels.join(" · ")}</span>
              ) : (
                <span className="text-text-secondary">—</span>
              )}
            </AccountField>
          </dl>
        </SectionCard>

        <SectionCard title="Security">
          {account.providersUnavailable ? (
            <p className="text-sm text-text-secondary">
              Security settings are temporarily unavailable. Refresh the page and
              try again.
            </p>
          ) : (
            <ChangePasswordForm enabled={account.hasCredentialAccount} />
          )}
        </SectionCard>

        <SectionCard title="Data & Privacy">
          <div className="space-y-4 text-sm leading-relaxed text-text-secondary">
            <p>
              DSJourney stores your learning data to power roadmap progress,
              study sessions, and portfolio projects tied to your signed-in
              account.
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>Roadmap progress</li>
              <li>Study sessions</li>
              <li>Portfolio projects</li>
            </ul>

            <SettingsDataSummary />

            <div className="flex flex-wrap gap-3 pt-1">
              <Link
                href="/privacy"
                className="focus-ring rounded-lg border border-border-strong bg-bg-elevated px-4 py-2.5 text-sm font-medium text-text-primary transition-colors hover:bg-bg-surface-hover"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="focus-ring rounded-lg border border-border-strong bg-bg-elevated px-4 py-2.5 text-sm font-medium text-text-primary transition-colors hover:bg-bg-surface-hover"
              >
                Terms of Service
              </Link>
            </div>

            {supportEmail && (
              <p>
                Questions about your data? Contact{" "}
                <a
                  href={`mailto:${supportEmail}`}
                  className="text-brand-teal underline-offset-2 hover:underline"
                >
                  {supportEmail}
                </a>
                .
              </p>
            )}
          </div>
        </SectionCard>

        <SectionCard
          title="Danger Zone"
          className="border-danger/30"
          bodyClassName="space-y-4"
        >
          <div>
            <h3 className="text-sm font-semibold text-text-primary">
              Delete Account
            </h3>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-secondary">
              Permanently delete your DSJourney account and associated learning
              data. This action cannot be undone.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setDeleteDialogOpen(true)}
            className="min-h-11 rounded-lg border border-danger/40 bg-danger/10 px-4 py-2.5 text-sm font-semibold text-danger transition-colors hover:bg-danger/15 focus-ring"
          >
            Delete Account
          </button>
        </SectionCard>
      </div>

      <DeleteAccountDialog
        open={deleteDialogOpen}
        hasCredentialAccount={
          !account.providersUnavailable && account.hasCredentialAccount
        }
        onOpenChange={setDeleteDialogOpen}
      />
    </div>
  );
}
