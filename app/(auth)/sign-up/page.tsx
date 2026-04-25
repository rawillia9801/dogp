import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/layout/auth-shell";
import { SubmitButton } from "@/components/ui/submit-button";
import { signUpWithPlanAction } from "@/lib/signup-actions";

export const metadata: Metadata = {
  title: "Sign Up",
};

const APP_DOMAIN = "app.mydogportal.site";
const PUBLIC_ROOT_DOMAIN = "mydogportal.site";
const PUBLIC_WWW_DOMAIN = "www.mydogportal.site";

const errorMessages: Record<string, string> = {
  config: "Authentication is not fully configured yet. Add the missing server settings and try again.",
  signup: "We couldn't create your account yet. Please review your details and try again.",
  organization: "Your account was created, but we couldn't finish the breeder workspace setup.",
};

const signupPlans = [
  { value: "starter", label: "Documents — $29/mo" },
  { value: "pro", label: "Breeder OS — $59/mo" },
  { value: "elite", label: "Full System — $99/mo" },
];

const pricingPlanToSignupPlan: Record<string, string> = {
  documents: "starter",
  starter: "starter",
  "breeder-os": "pro",
  breeder_os: "pro",
  pro: "pro",
  professional: "pro",
  "full-system": "elite",
  full_system: "elite",
  elite: "elite",
  premium: "elite",
};

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string; plan?: string }>;
}) {
  const params = await searchParams;
  const selectedPlan = normalizeSignupPlan(params.plan);

  await redirectPublicAuthPageToAppDomain("/sign-up", {
    error: params.error,
    next: params.next,
    plan: selectedPlan,
  });

  const nextPath = typeof params.next === "string" ? params.next : "";
  const errorMessage = params.error ? errorMessages[params.error] : null;

  return (
    <AuthShell title="Start trial" subtitle="Create your owner account and breeder organization.">
      <form action={signUpWithPlanAction} className="space-y-4">
        {errorMessage ? (
          <div className="rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
            {errorMessage}
          </div>
        ) : null}
        <input type="hidden" name="next" value={nextPath} />
        <label className="block">
          <span className="text-xs uppercase tracking-[0.18em] text-stone-500">Selected plan</span>
          <select name="plan" defaultValue={selectedPlan} className="form-input mt-2">
            {signupPlans.map((plan) => (
              <option key={plan.value} value={plan.value}>
                {plan.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-[0.18em] text-stone-500">Business name</span>
          <input name="organizationName" required className="form-input mt-2" />
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-[0.18em] text-stone-500">Email</span>
          <input name="email" type="email" required className="form-input mt-2" />
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-[0.18em] text-stone-500">Password</span>
          <input name="password" type="password" minLength={8} required className="form-input mt-2" />
        </label>
        <SubmitButton>Create Account</SubmitButton>
      </form>
      <p className="mt-5 text-center text-sm text-stone-400">
        Already have an account?{" "}
        <Link href="/sign-in" className="text-gold-soft">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}

function normalizeSignupPlan(value: string | undefined) {
  if (!value) {
    return "starter";
  }

  return pricingPlanToSignupPlan[value.trim().toLowerCase()] ?? "starter";
}

async function redirectPublicAuthPageToAppDomain(
  pathname: "/sign-up",
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
