"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { createSupabaseClient } from "@/lib/supabase-client";

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
  verified: "Email verified. Sign in to open your breeder dashboard.",
};

export function SignInForm({
  initialEmail = "",
  initialError,
  initialNotice,
  nextPath = "/dashboard",
}: {
  initialEmail?: string;
  initialError?: string;
  initialNotice?: string;
  nextPath?: string;
}) {
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(initialError ? errorMessages[initialError] : "");
  const [pending, setPending] = useState(false);

  const notice = useMemo(() => {
    return initialNotice ? noticeMessages[initialNotice] : "";
  }, [initialNotice]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");

    const supabase = createSupabaseClient();

    if (!supabase) {
      setError(errorMessages.config);
      setPending(false);
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError) {
      setError(signInError.message || errorMessages.signin);
      setPending(false);
      return;
    }

    window.location.assign(normalizeNext(nextPath));
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold leading-6 text-red-800">
            {error}
          </div>
        ) : null}

        {!error && notice ? (
          <div className="rounded-2xl border border-[#B7D8C2] bg-[#E9F8EF] px-4 py-3 text-sm font-bold leading-6 text-[#24543A]">
            {notice}
          </div>
        ) : null}

        <label className="block">
          <span className="text-xs uppercase tracking-[0.18em] text-stone-500">Email</span>
          <input
            name="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="form-input mt-2"
          />
        </label>

        <label className="block">
          <span className="text-xs uppercase tracking-[0.18em] text-stone-500">Password</span>
          <input
            name="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            className="form-input mt-2"
          />
        </label>

        <button
          type="submit"
          disabled={pending}
          className="inline-flex min-h-10 w-full items-center justify-center rounded-md bg-gold px-4 text-sm font-semibold text-[#15100a] transition hover:bg-gold-soft disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-[#7A6A55]">
        New to mydogportal.site?{" "}
        <Link href="/sign-up" className="text-gold-soft">
          Create an account
        </Link>
      </p>
    </>
  );
}

function normalizeNext(value: string) {
  if (!value || value === "/" || value === "//" || value.startsWith("//")) {
    return "/dashboard";
  }

  if (value === "https://app.mydogportal.site" || value === "https://app.mydogportal.site/") {
    return "/dashboard";
  }

  if (value.startsWith("https://app.mydogportal.site/")) {
    const url = new URL(value);
    return `${url.pathname}${url.search}${url.hash}`;
  }

  if (!value.startsWith("/")) {
    return "/dashboard";
  }

  return value;
}
