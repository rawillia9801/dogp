import type { Metadata } from "next";
import {
  ArrowRight,
  BellRing,
  CreditCard,
  PawPrint,
  ShieldCheck,
  Truck,
  Users,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { Surface } from "@/components/ui/surface";

export const metadata: Metadata = {
  title: "Features",
};

const features = [
  {
    title: "Breeding Program",
    body: "Plan pairings, track breeding dates, and keep litter records organized.",
    icon: PawPrint,
  },
  {
    title: "Dogs & Records",
    body: "Keep pedigree, health, and breeding records for every dog in one place.",
    icon: ShieldCheck,
  },
  {
    title: "Buyer Management",
    body: "Review applications, manage buyers, and keep their records organized.",
    icon: Users,
  },
  {
    title: "Payments & Documents",
    body: "Track deposits, balances, contracts, and signed records in one place.",
    icon: CreditCard,
  },
  {
    title: "Operations & Logistics",
    body: "Coordinate pickup, delivery, scheduling, and go-home details.",
    icon: Truck,
  },
  {
    title: "Automation",
    body: "Send reminders, notices, and updates automatically with built-in workflows.",
    icon: BellRing,
  },
];

const workflowSignals = [
  { label: "Active Dogs", value: "14" },
  { label: "Pairings", value: "3" },
  { label: "Litters", value: "2" },
  { label: "Buyer Records", value: "11" },
];

export default function FeaturesPage() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-16">
      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-gold">
            Premium Breeder Operations
          </p>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight text-stone-50">
            Built for real breeding operations
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-300">
            MyDogPortal.site gives breeding programs one place to manage breeding work, buyer records, payments,
            documents, transport, and daily follow-through.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/sign-up">
              Start Trial
              <ArrowRight className="size-4" />
            </ButtonLink>
            <ButtonLink href="/pricing" variant="secondary">
              View Pricing
            </ButtonLink>
          </div>
        </div>

        <Surface className="rounded-[24px] p-0 overflow-hidden">
          <div className="border-b border-white/[0.08] bg-[radial-gradient(circle_at_12%_10%,rgba(215,173,103,0.16),transparent_34%),linear-gradient(145deg,rgba(15,21,29,0.98),rgba(8,12,18,0.98))] px-5 py-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">Breeder Command Center</p>
            <h2 className="mt-2 text-2xl font-semibold text-stone-50">Operational visibility</h2>
            <p className="mt-2 text-sm leading-6 text-stone-400">
              Breeding schedules, buyer records, and financial follow-through stay connected inside one system.
            </p>
          </div>

          <div className="grid gap-0 lg:grid-cols-[1fr_1.1fr]">
            <div className="border-b border-white/[0.06] bg-[#0d1319] p-4 lg:border-b-0 lg:border-r">
              <div className="space-y-2">
                {workflowSignals.map((signal) => (
                  <div
                    key={signal.label}
                    className="rounded-2xl border border-white/[0.06] bg-white/[0.03] px-4 py-3"
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500">
                      {signal.label}
                    </p>
                    <p className="mt-1 text-2xl font-semibold text-stone-50">{signal.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#0a1016] p-4">
              <div className="rounded-[22px] border border-white/[0.06] bg-black/15 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
                      Daily Execution
                    </p>
                    <p className="mt-1 text-lg font-semibold text-stone-50">Breeding and buyer workflow</p>
                  </div>
                  <span className="rounded-full border border-gold/25 bg-gold/10 px-3 py-1 text-xs font-semibold text-gold-soft">
                    Active
                  </span>
                </div>

                <div className="mt-4 space-y-3">
                  {[
                    "Pairing review prepared for weekend timing",
                    "Litter records connected to buyer follow-up",
                    "Documents and deposits tracked in the same file",
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-3 text-sm text-stone-300"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Surface>
      </section>

      <section className="mt-12">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-gold">
            Built for real breeding operations
          </p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-stone-50">
            Built for real breeding operations
          </h2>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <Surface key={feature.title} className="rounded-[22px] p-6">
                <div className="flex items-start gap-4">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-gold/20 bg-gold/10 text-gold">
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <h3 className="text-xl font-semibold text-stone-50">{feature.title}</h3>
                    <p className="mt-3 leading-7 text-stone-400">{feature.body}</p>
                  </div>
                </div>
              </Surface>
            );
          })}
        </div>
      </section>
    </main>
  );
}
