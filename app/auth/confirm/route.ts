import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const tokenHash = requestUrl.searchParams.get("token_hash");
  const type = requestUrl.searchParams.get("type") as EmailOtpType | null;
  const nextPath = sanitizeNextPath(requestUrl.searchParams.get("next")) ?? "/admin";

  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname = nextPath;
  redirectUrl.searchParams.delete("token_hash");
  redirectUrl.searchParams.delete("type");
  redirectUrl.searchParams.delete("next");

  if (tokenHash && type) {
    const supabase = await createSupabaseServerClient();

    if (supabase) {
      const { error } = await supabase.auth.verifyOtp({
        token_hash: tokenHash,
        type,
      });

      if (!error) {
        return NextResponse.redirect(redirectUrl);
      }
    }
  }

  const fallbackUrl = request.nextUrl.clone();
  fallbackUrl.pathname = "/sign-in";
  fallbackUrl.searchParams.set("error", "confirm");

  return NextResponse.redirect(fallbackUrl);
}

function sanitizeNextPath(value: string | null) {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();

  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) {
    return null;
  }

  return trimmed;
}
