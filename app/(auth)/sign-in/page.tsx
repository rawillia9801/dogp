import type { Metadata } from "next";
import Link from "next/link";
import { signInAction } from "@/lib/auth";
import { AuthShell } from "@/components/layout/auth-shell";
import { SubmitButton } from "@/components/ui/submit-button";

export const metadata: Metadata = {
  title: "Sign In",
};

export default function SignInPage() {
  return (
    <AuthShell title="Sign in" subtitle="Access your breeder workspace.">
      <form action={signInAction} className="space-y-4">
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
