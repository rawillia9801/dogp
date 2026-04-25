import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthCallbackFinalizer } from "./auth-callback-finalizer";

export const metadata: Metadata = {
  title: "Confirming Account",
};

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<AuthCallbackFallback />}>
      <AuthCallbackFinalizer />
    </Suspense>
  );
}

function AuthCallbackFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#08111C] text-white">
      <div className="rounded-3xl border border-white/10 bg-white/5 px-8 py-6 text-center">
        <p className="text-xl font-bold">Confirming your account…</p>
        <p className="mt-2 text-sm text-white/70">Please wait while we finish your secure sign in.</p>
      </div>
    </div>
  );
}
