import { AuthForm } from "./auth-form";

interface AuthPageProps {
  searchParams: Promise<{
    error?: string;
    message?: string;
  }>;
}

export default async function AuthPage({ searchParams }: AuthPageProps) {
  const params = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-bg-primary px-5 py-10">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-18rem] h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" />
      </div>
      <div className="relative z-10 w-full max-w-md">
        <AuthForm
          initialError={params.error}
          initialMessage={params.message}
        />
      </div>
    </main>
  );
}
