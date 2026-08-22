import type { EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const tokenHash = request.nextUrl.searchParams.get("token_hash");
  const type = request.nextUrl.searchParams.get("type") as EmailOtpType | null;
  const code = request.nextUrl.searchParams.get("code");
  const supabase = await createClient();

  const result = tokenHash && type
    ? await supabase.auth.verifyOtp({ type, token_hash: tokenHash })
    : code
      ? await supabase.auth.exchangeCodeForSession(code)
      : { error: new Error("Confirmation link is missing required parameters.") };

  const redirectUrl = request.nextUrl.clone();
  redirectUrl.search = "";

  if (result.error) {
    redirectUrl.pathname = "/auth";
    redirectUrl.searchParams.set(
      "error",
      "The confirmation link is invalid or has expired. Please try signing up again.",
    );
    return NextResponse.redirect(redirectUrl);
  }

  redirectUrl.pathname = "/today";
  return NextResponse.redirect(redirectUrl);
}
