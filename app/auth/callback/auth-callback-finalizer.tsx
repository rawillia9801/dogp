"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createSupabaseClient } from "@/lib/supabase-client";

export function AuthCallbackFinalizer() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const finalize = async () => {
      const supabase = createSupabaseClient();

      if (!supabase) {
        router.replace("/sign-in?error=config");
        return;
      }

      const code = searchParams.get("code");
      const tokenHash = searchParams.get("token_hash");
      const type = searchParams.get("type");
      const next = sanitizeNext(searchParams.get("next")) ?? "/dashboard";

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error) {
          router.replace(next);
          return;
        }
      }

      if (tokenHash && type) {
        const { error } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: type as any,
        });

        if (!error) {
          router.replace(next);
          return;
        }
      }

      router.replace(`/sign-in?error=confirm&next=${encodeURIComponent(next)}`);
    };

    finalize();
  }, [router, searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#08111C] text-white">
      <div className="rounded-3xl border border-white/10 bg-white/5 px-8 py-6 text-center">
        <p className="text-xl font-bold">Confirming your account…</p>
        <p className="mt-2 text-sm text-white/70">Please wait while we finish your secure sign in.</p>
      </div>
    </div>
  );
}

function sanitizeNext(value: string | null) {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();

  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) {
    return null;
  }

  return trimmed;
}
