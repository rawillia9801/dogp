import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase";

const APP_DOMAIN = "app.mydogportal.site";
const PUBLIC_ROOT_DOMAIN = "mydogportal.site";
const PUBLIC_WWW_DOMAIN = "www.mydogportal.site";
const DEFAULT_LOCAL_APP_URL = "http://localhost:3000";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const tokenHash = requestUrl.searchParams.get("token_hash");
  const type = requestUrl.searchParams.get("type") as EmailOtpType | null;
  const nextPath = sanitizeNextPath(requestUrl.searchParams.get("next")) ?? "/dashboard";
  const appBaseUrl = await getAppBaseUrl(request);

  const successUrl = new URL(nextPath, appBaseUrl);
  const failureUrl = new URL("/sign-in", appBaseUrl);
  failureUrl.searchParams.set("error", "confirm");
  failureUrl.searchParams.set("next", nextPath);

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    failureUrl.searchParams.set("error", "config");
    return NextResponse.redirect(failureUrl);
  }

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(successUrl);
    }

    console.error("Supabase auth code exchange failed", error);
    return NextResponse.redirect(failureUrl);
  }

  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type,
    });

    if (!error) {
      return NextResponse.redirect(successUrl);
    }

    console.error("Supabase auth OTP verification failed", error);
    return NextResponse.redirect(failureUrl);
  }

  return NextResponse.redirect(failureUrl);
}

function sanitizeNextPath(value: string | null) {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return null;
  }

  if (trimmed === `https://${APP_DOMAIN}` || trimmed === `https://${APP_DOMAIN}/`) {
    return "/dashboard";
  }

  if (trimmed.startsWith(`https://${APP_DOMAIN}/`)) {
    const url = new URL(trimmed);
    return `${url.pathname}${url.search}${url.hash}`;
  }

  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) {
    return null;
  }

  return trimmed;
}

async function getAppBaseUrl(request: NextRequest) {
  const envUrl = process.env.NEXT_PUBLIC_APP_URL?.trim() || process.env.APP_URL?.trim();

  if (envUrl) {
    return envUrl.replace(/\/+$/, "");
  }

  if (process.env.NODE_ENV !== "development") {
    return `https://${APP_DOMAIN}`;
  }

  const forwardedHost = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  const forwardedProtocol = request.headers.get("x-forwarded-proto") ?? "http";

  if (forwardedHost) {
    const host = forwardedHost.split(":")[0].toLowerCase();

    if (host === PUBLIC_ROOT_DOMAIN || host === PUBLIC_WWW_DOMAIN) {
      return `https://${APP_DOMAIN}`;
    }

    return `${forwardedProtocol}://${forwardedHost}`;
  }

  return DEFAULT_LOCAL_APP_URL;
}
