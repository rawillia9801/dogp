import { NextResponse, type NextRequest } from "next/server";

const APP_DOMAIN = "app.mydogportal.site";
const PUBLIC_ROOT_DOMAIN = "mydogportal.site";
const PUBLIC_WWW_DOMAIN = "www.mydogportal.site";
const DEFAULT_LOCAL_APP_URL = "http://localhost:3000";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const appBaseUrl = getAppBaseUrl(request);
  const callbackUrl = new URL("/auth/callback", appBaseUrl);
  const nextPath = sanitizeNextPath(requestUrl.searchParams.get("next")) ?? "/dashboard";

  callbackUrl.searchParams.set("next", nextPath);

  requestUrl.searchParams.forEach((value, key) => {
    if (key !== "next") {
      callbackUrl.searchParams.set(key, value);
    }
  });

  return NextResponse.redirect(callbackUrl);
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

function getAppBaseUrl(request: NextRequest) {
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
