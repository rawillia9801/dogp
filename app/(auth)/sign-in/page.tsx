import type { Metadata } from "next";
import Link from "next/link";
import { signInAction } from "@/lib/auth";
import { AuthShell } from "@/components/layout/auth-shell";
import { SubmitButton } from "@/components/ui/submit-button";

export const metadata: Metadata = {
  title: "Sign In",
};

const errorMessages: Record<string, string> = {
  config: "Authentication is not fully configured yet. Add the missing server settings and try again.",
  signin: "We couldn't sign you in with those credentials. Double-check your email and password.",
};

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const params = await searchParams;
  const nextPath = typeof params.next === "string" ? params.next : "";
  const errorMessage = params.error ? errorMessages[params.error] : null;

  return (
    <AuthShell title="Sign in" subtitle="Access your breeder workspace.">
      <form action={signInAction} className="space-y-4">
        {errorMessage ? (
          <div className="rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
            {errorMessage}
          </div>
        ) : null}
        <input type="hidden" name="next" value={nextPath} />
        <label className="block">
          <span className="text-xs uppercase tracking-[0.18em] text-stone-500">Email</span>
          <input name="email" type="email" required className="form-input mt-2" />
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-[0.18em] text-stone-500">Password</span>
          <input name="password" type="password" required className="form-input mt-2" />
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
