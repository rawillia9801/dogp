import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { PricingSection } from "@/lib/public-marketing";

export const metadata: Metadata = {
  title: "Pricing",
};

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-[#F8F7F3] text-[#1F2933]">
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-[#C6A96B]">Pricing</p>
          <h1 className="mt-3 text-5xl font-black tracking-tight md:text-6xl">
            Start simple. Upgrade only when it makes sense.
          </h1>
          <p className="mt-6 text-lg leading-8 text-[#5B6B73]">
            No contracts. Cancel anytime. All plans include onboarding support.
          </p>
          <div className="mt-8 flex justify-center">
            <a
              href="/sign-up"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#2F4F3E] px-7 py-4 text-base font-bold text-white shadow-lg shadow-[#2F4F3E]/15 transition hover:bg-[#253F32]"
            >
              Start your Trial
              <ArrowRight className="h-5 w-5" />
            </a>
          </div>
        </div>
      </section>

      <PricingSection />
    </main>
  );
}
