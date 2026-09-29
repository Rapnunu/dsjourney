import { redirect } from "next/navigation";
import { LandingPage } from "@/components/landing/landing-page";
import { auth } from "@/lib/auth/server";
import { createHomeMetadata } from "@/lib/metadata";

export const metadata = createHomeMetadata();

export const dynamic = "force-dynamic";

export default async function Home() {
  const { data: session } = await auth.getSession();

  if (session?.user) {
    redirect("/today");
  }

  return <LandingPage />;
}
