import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { OAuthConsentClient } from "@/components/auth/oauth-consent-client";
import { createSupabaseServerClient } from "@/lib/supabase";
import { Surface } from "@/components/ui/surface";

export const metadata: Metadata = {
  title: "Authorize App",
};

export default async function OAuthConsentPage({
  searchParams,
}: {
  searchParams: Promise<{ authorization_id?: string }>;
}) {
  const params = await searchParams;
  const authorizationId = typeof params.authorization_id === "string" ? params.authorization_id.trim() : "";

  if (!authorizationId) {
    return (
      <main className="grid min-h-screen place-items-center bg-app px-5 py-10 text-stone-100">
        <Surface className="w-full max-w-xl p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Authorization</p>
          <h1 className="mt-3 text-3xl font-semibold text-stone-50">Missing authorization request</h1>
          <p className="mt-4 text-sm leading-7 text-stone-400">
            The OAuth request is missing its authorization identifier, so we can&apos;t continue this sign-in flow yet.
          </p>
        </Surface>
      </main>
    );
  }

  const supabase = await createSupabaseServerClient();
  const userResponse = supabase ? await supabase.auth.getUser() : null;

  if (!userResponse?.data.user) {
    redirect(`/sign-in?next=${encodeURIComponent(`/oauth/consent?authorization_id=${authorizationId}`)}`);
  }

  return <OAuthConsentClient authorizationId={authorizationId} />;
}
