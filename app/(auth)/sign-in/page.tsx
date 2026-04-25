import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { signInAction } from "@/lib/auth";
import { AuthShell } from "@/components/layout/auth-shell";
import { SubmitButton } from "@/components/ui/submit-button";

export const metadata: Metadata = {
  title: "Sign In",
};

const APP_DASHBOARD_URL = "https://app.mydogportal.site/dashboard";
const APP_DOMAIN = "app.mydogportal.site";
const PUBLIC_ROOT_DOMAIN = "mydogportal.site";
const PUBLIC_WWW_DOMAIN = "www.mydogportal.site";

const errorMessages: Record<string, string> = {
  config: "Authentication is not fully configured yet. Add the missing server settings and try again.",
  confirm:
    "We couldn't finish email confirmation from that link. Please request a fresh confirmation email and try again.",
  signin:
    "We couldn't sign you in with those credentials. Double-check your email, password, and email confirmation status.",
};

const noticeMessages: Record<string, string> = {
  check_email: "Account created. Check your email and click the confirmation link to finish setup.",
  confirmed: "Email confirmed. You can sign in now.",
};

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string; notice?: string }>;
}) {
  const params = await searchParams;

  await redirectPublicAuthPageToAppDomain("/sign-in", {
    error: params.error,
    next: params.next,
    notice: params.notice,
  });

  const nextPath =
    typeof params.next === "string" && params.next.trim().length > 0
      ? params.next
      : APP_DASHBOARD_URL;

  const errorMessage = params.error ? errorMessages[params.error] : null;
  const noticeMessage = params.notice ? noticeMessages[params.notice] : null;

  return (
    <AuthShell title="Sign in" subtitle="Access your breeder workspace.">
      <form action={signInAction} className="space-y-4">
        {errorMessage ? (
          <div className="rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
            {errorMessage}
          </div>
        ) : null}

        {noticeMessage ? (
          <div className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
            {noticeMessage}
          </div>
        ) : null}

        <input type="hidden" name="next" value={nextPath} />

        <label className="block">
          <span className="text-xs uppercase tracking-[0.18em] text-stone-500">
            Email
          </span>
          <input name="email" type="email" required className="form-input mt-2" />
        </label>

        <label className="block">
          <span className="text-xs uppercase tracking-[0.18em] text-stone-500">
            Password
          </span>
          <input
            name="password"
            type="password"
            required
            className="form-input mt-2"
          />
        </label>

        <SubmitButton>Sign In</SubmitButton>
      </form>

      <p className="mt-5 text-center text-sm text-stone-400">
        New to mydogportal.site?{" "}
        <Link href="/sign-up" className="text-gold-soft">
          Create an account
        </Link>
      </p>
    </AuthShell>
  );
}

async function redirectPublicAuthPageToAppDomain(
  pathname: "/sign-in",
  params: Record<string, string | undefined>,
) {
  if (process.env.NODE_ENV === "development") {
    return;
  }

  const headerStore = await headers();
  const host = (headerStore.get("x-forwarded-host") ?? headerStore.get("host") ?? "")
    .split(":")[0]
    .toLowerCase();

  if (host !== PUBLIC_ROOT_DOMAIN && host !== PUBLIC_WWW_DOMAIN) {
    return;
  }

  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      query.set(key, value);
    }
  });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim() || process.env.APP_URL?.trim() || `https://${APP_DOMAIN}`;
  redirect(`${appUrl.replace(/\/+$/, "")}${pathname}${query.size ? `?${query.toString()}` : ""}`);
}
