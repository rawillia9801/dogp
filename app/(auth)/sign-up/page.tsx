import type { Metadata } from "next";
import Link from "next/link";
import { signUpAction } from "@/lib/auth";
import { AuthShell } from "@/components/layout/auth-shell";
import { SubmitButton } from "@/components/ui/submit-button";

export const metadata: Metadata = {
  title: "Sign Up",
};

const errorMessages: Record<string, string> = {
  config: "Authentication is not fully configured yet. Add the missing server settings and try again.",
  signup: "We couldn't create your account yet. Please review your details and try again.",
  organization: "Your account was created, but we couldn't finish the breeder workspace setup.",
};

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const params = await searchParams;
  const nextPath = typeof params.next === "string" ? params.next : "";
  const errorMessage = params.error ? errorMessages[params.error] : null;

  return (
    <AuthShell title="Start trial" subtitle="Create your owner account and breeder organization.">
      <form action={signUpAction} className="space-y-4">
        {errorMessage ? (
          <div className="rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
            {errorMessage}
          </div>
        ) : null}
        <input type="hidden" name="next" value={nextPath} />
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
