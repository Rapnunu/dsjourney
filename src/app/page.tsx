import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LandingPage } from "@/components/landing/landing-page";
import { auth } from "@/lib/auth/server";

export const metadata: Metadata = {
  title: "DSJourney",
  description:
    "Track your Data Science learning journey, study progress, portfolio, analytics, and career readiness.",
};

export const dynamic = "force-dynamic";

export default async function Home() {
  const { data: session } = await auth.getSession();

  if (session?.user) {
    redirect("/today");
  }

  return <LandingPage />;
}
