import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import {
  ChiChiSection,
  DemoCard,
  DemoSection,
  FeatureModulesSection,
  FeaturesChecklistSection,
} from "@/lib/public-marketing";

export const metadata: Metadata = {
  title: "Features",
};

export default function FeaturesPage() {
  return (
    <main className="min-h-screen bg-[#F8F7F3] text-[#1F2933]">
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-[1fr_0.95fr]">
        <div className="max-w-3xl">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-[#C6A96B]">Features</p>
          <h1 className="mt-3 text-5xl font-black tracking-tight md:text-6xl">
            Everything you need to look organized, professional, and trustworthy.
          </h1>
          <p className="mt-6 text-lg leading-8 text-[#5B6B73]">
            This is not a generic CRM with dog words added later. It is structured around the work you do every day: puppies, buyers, deposits, contracts, updates, and go-home preparation.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="/sign-up"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#2F4F3E] px-7 py-4 text-base font-bold text-white shadow-lg shadow-[#2F4F3E]/15 transition hover:bg-[#253F32]"
            >
              Start your Trial
              <ArrowRight className="h-5 w-5" />
            </a>
            <a
              href="/pricing"
              className="inline-flex items-center justify-center rounded-2xl border border-[#D8CCB7] bg-white px-7 py-4 text-base font-bold text-[#2F4F3E] shadow-sm transition hover:bg-[#F4EFE6]"
            >
              View Pricing
            </a>
          </div>
        </div>

        <DemoCard />
      </section>

      <FeatureModulesSection />
      <FeaturesChecklistSection />
      <ChiChiSection />
      <DemoSection />
    </main>
  );
}
