import { redirect } from "next/navigation";
import { SettingsView } from "@/features/settings/components/settings-view";
import { createPrivateMetadata } from "@/lib/metadata";
import { getSettingsAccountData } from "./actions";

export const metadata = createPrivateMetadata({ title: "Settings" });

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const account = await getSettingsAccountData();

  if (!account) {
    redirect("/auth");
  }

  return <SettingsView account={account} />;
}
