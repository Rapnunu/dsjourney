import Link from "next/link";
import { redirect } from "next/navigation";
import { DsjourneyLogo } from "@/components/brand/dsjourney-logo";
import {
  isDemoLoginConfigured,
  isDemoLoginEnvironment,
} from "@/lib/auth/demo-login";
import { auth } from "@/lib/auth/server";
import { AuthEntrance } from "./auth-entrance";
import { AuthForm } from "./auth-form";

interface AuthPageProps {
  searchParams: Promise<{
    error?: string;
    message?: string;
    mode?: string;
  }>;
}

export const dynamic = "force-dynamic";

export default async function AuthPage({ searchParams }: AuthPageProps) {
  const { data: session } = await auth.getSession();

  if (session?.user) {
    redirect("/today");
  }

  const params = await searchParams;
  const initialMode = params.mode === "signup" ? "sign_up" : "sign_in";

  return (
    <main className="public-page min-h-screen bg-black lg:grid lg:grid-cols-2">
      <section
        className="relative hidden overflow-hidden lg:flex lg:flex-col lg:justify-between"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-brand-navy via-[#071018] to-black" />
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_40%,rgba(20,184,166,0.15),transparent_55%)]"
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(59,130,246,0.12),transparent_50%)]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/20" />

        <div className="relative z-10 p-10">
          <Link
            href="/"
            className="focus-ring inline-block rounded-lg text-white"
          >
            <DsjourneyLogo
              variant="horizontal"
              tone="public"
              className="h-10 w-auto text-white"
            />
          </Link>
        </div>

        <AuthEntrance className="relative z-10 px-10 pb-16">
          <DsjourneyLogo
            variant="mark"
            tone="public"
            className="mb-8 h-28 w-28 opacity-95"
          />
          <h2 className="max-w-md text-4xl font-bold leading-tight text-white">
            Your Data Science Journey Starts Here
          </h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-white/65">
            Learn, track, and grow into a Data Scientist with roadmap mastery,
            study sessions, analytics, readiness, and portfolio tracking in one
            place.
          </p>
        </AuthEntrance>
      </section>

      <section className="relative flex min-h-screen items-center justify-center px-5 py-10 sm:px-8">
        <div className="pointer-events-none absolute inset-0 overflow-hidden lg:hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-navy via-[#071018] to-black" />
          <div
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(34,211,238,0.12),transparent_55%)]"
          />
        </div>

        <div className="relative z-10 w-full max-w-md">
          <div className="mb-6 flex justify-center lg:hidden">
            <Link href="/" className="focus-ring rounded-lg text-white">
              <DsjourneyLogo variant="icon" tone="public" className="h-14 w-14" />
            </Link>
          </div>

          <AuthEntrance delay={0.1}>
            <div className="w-full rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/30 backdrop-blur-md sm:p-8">
              <div className="mb-6 hidden text-center lg:block">
                <DsjourneyLogo
                  variant="icon"
                  tone="public"
                  className="mx-auto mb-4 h-12 w-12"
                />
              </div>

              <AuthForm
              initialError={params.error}
              initialMessage={params.message}
              initialMode={initialMode}
              showDemoSection={isDemoLoginEnvironment()}
              demoLoginAvailable={isDemoLoginConfigured()}
              />
            </div>
          </AuthEntrance>
        </div>
      </section>
    </main>
  );
}
