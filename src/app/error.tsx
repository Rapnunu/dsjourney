"use client";

import { useEffect } from "react";
import { RouteError } from "@/components/ui/route-error";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return <RouteError reset={reset} />;
}
