import type { Metadata } from "next";
import Link from "next/link";
import { signUpAction } from "@/lib/auth";
import { AuthShell } from "@/components/layout/auth-shell";
import { SubmitButton } from "@/components/ui/submit-button";

export const metadata: Metadata = {
  title: "Sign Up",
};

export default function SignUpPage() {
  return (
    <AuthShell title="Start trial" subtitle="Create your owner account and breeder organization.">
      <form action={signUpAction} className="space-y-4">
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
