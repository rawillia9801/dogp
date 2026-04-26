import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { SignInForm } from "./sign-in-form";

export const dynamic = "force-dynamic";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const supabase = await createSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const nextRaw = typeof params.next === "string" ? params.next : "/dashboard";

  if (session) {
    redirect(nextRaw || "/dashboard");
  }

  const initialEmail = typeof params.email === "string" ? params.email : "";
  const initialError = typeof params.error === "string" ? params.error : undefined;
  const initialNotice = typeof params.notice === "string" ? params.notice : undefined;

  return (
    <main className="min-h-screen bg-gradient-to-r from-[#E7E8E1] via-[#F5F2EA] to-[#EFE9DC] px-6 py-10 text-ink">
      <div className="mx-auto grid min-h-[88vh] max-w-6xl items-center gap-14 lg:grid-cols-[1.2fr_0.9fr]">
        <section className="space-y-8">
          <div className="flex flex-wrap gap-3 text-sm font-semibold text-forest">
            <Link href="/" className="rounded-full border border-[#D8CCB8] bg-white px-5 py-2 shadow-sm">
              ← Back to MyDogPortal
            </Link>
            <span className="rounded-full border border-[#D8CCB8] bg-white px-5 py-2 shadow-sm">
              ✨ Built for real dog breeders
            </span>
          </div>

          <div className="space-y-5">
            <h1 className="max-w-xl font-display text-5xl leading-tight text-ink md:text-7xl">
              Welcome to your calm, organized breeder workspace.
            </h1>
            <p className="max-w-2xl text-xl leading-10 text-slate-600">
              Manage puppies, buyers, payments, documents, reminders, and your public breeder experience from one polished system.
            </p>
          </div>

          <div className="grid max-w-2xl gap-4 sm:grid-cols-3">
            {[
              ["Portal", "Buyer ready"],
              ["Docs", "Contracts"],
              ["Payments", "Balances"],
            ].map(([title, subtitle]) => (
              <div key={title} className="rounded-3xl border border-[#E0D6C5] bg-white/80 p-6 shadow-sm">
                <div className="mb-4 text-xl">◉</div>
                <div className="font-semibold">{title}</div>
                <div className="text-sm text-slate-500">{subtitle}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-[#DED4C3] bg-white/85 p-8 shadow-[0_20px_60px_rgba(40,32,20,0.08)] backdrop-blur">
          <div className="mb-8 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-forest text-2xl text-white shadow-md">
              ⦿
            </div>
            <div>
              <div className="font-display text-3xl text-ink">MyDogPortal</div>
              <div className="text-sm font-semibold text-slate-500">Access your breeder workspace.</div>
            </div>
          </div>

          <h2 className="mb-6 font-display text-5xl text-ink">Sign in</h2>

          <SignInForm
            initialEmail={initialEmail}
            initialError={initialError}
            initialNotice={initialNotice}
            nextPath={nextRaw}
          />
        </section>
      </div>
    </main>
  );
}
