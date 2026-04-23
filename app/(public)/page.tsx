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
  title: "mydogportal.site",
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

const systemSections = [
  "Dashboard",
  "Dogs",
  "Breeding Program",
  "Buyers",
  "Payments",
  "Documents",
];

export default function HomePage() {
  return (
    <main>
      <section className="mx-auto grid min-h-[calc(100vh-73px)] max-w-7xl items-center gap-12 px-5 py-16 lg:grid-cols-[1.02fr_0.98fr]">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-gold">
            Premium Breeder Operations
          </p>
          <h1 className="mt-5 text-5xl font-semibold leading-[1.02] tracking-tight text-stone-50 md:text-7xl">
            Run your breeding program in one place
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-200">
            Track your dogs, pairings, litters, buyers, and records without juggling spreadsheets and scattered tools.
          </p>
          <p className="mt-5 max-w-2xl text-base leading-8 text-stone-400">
            MyDogPortal.site helps breeders keep day-to-day work organized - from breeding plans and litter records to buyer details, documents, and delivery coordination.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <ButtonLink href="/sign-up">
              Start Trial
              <ArrowRight className="size-4" />
            </ButtonLink>
            <ButtonLink href="/features" variant="secondary">
              View Features
            </ButtonLink>
          </div>
        </div>

        <Surface className="overflow-hidden rounded-[26px] p-0">
          <div className="border-b border-white/[0.08] bg-[radial-gradient(circle_at_18%_10%,rgba(215,173,103,0.18),transparent_36%),linear-gradient(145deg,rgba(17,24,32,0.98),rgba(10,14,20,0.98))] px-5 py-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold">
                  Breeder Command Center
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-stone-50">
                  Operational workspace
                </h2>
              </div>
              <span className="inline-flex items-center rounded-full border border-gold/25 bg-gold/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-gold-soft">
                Active program
              </span>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <PreviewMetric label="Active Dogs" value="14" />
              <PreviewMetric label="Active Pairings" value="3" />
              <PreviewMetric label="Litters In Progress" value="2" />
            </div>
          </div>

          <div className="grid gap-0 border-t border-white/[0.04] lg:grid-cols-[250px_1fr]">
            <div className="border-b border-white/[0.06] bg-[#0e141b] p-4 lg:border-b-0 lg:border-r">
              <div className="space-y-2">
                {systemSections.map((section, index) => (
                  <div
                    key={section}
                    className={
                      index === 2
                        ? "rounded-2xl border border-gold/30 bg-[linear-gradient(135deg,rgba(215,173,103,0.18),rgba(215,173,103,0.06)_30%,rgba(255,255,255,0.04)_70%,rgba(15,22,28,0.94))] px-3 py-3"
                        : "rounded-2xl border border-white/[0.06] bg-white/[0.025] px-3 py-3"
                    }
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className={index === 2 ? "font-semibold text-stone-50" : "font-medium text-stone-200"}>
                        {section}
                      </p>
                      <span className={index === 2 ? "size-2 rounded-full bg-gold shadow-[0_0_14px_rgba(215,173,103,0.8)]" : "size-2 rounded-full bg-emerald-300"} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4">
              <div className="grid gap-4 xl:grid-cols-[1.08fr_0.92fr]">
                <div className="rounded-[22px] border border-white/[0.06] bg-[#0b1218] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04),inset_0_-18px_32px_rgba(0,0,0,0.18)] xl:col-span-2">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-500">
                        Breeding Program
                      </p>
                      <p className="mt-1 text-lg font-semibold text-stone-50">Breeding Pair Engine</p>
                    </div>
                    <span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1 text-xs text-stone-300">
                      Compatibility 91%
                    </span>
                  </div>

                  <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_240px_1fr] xl:items-center">
                    <PreviewDogCard label="Sire" name="Ridgefield Atlas" detail="Health clear / Proven" />
                    <div className="flex min-w-0 flex-col items-center justify-center rounded-[20px] border border-gold/20 bg-[radial-gradient(circle_at_50%_10%,rgba(215,173,103,0.18),transparent_52%),rgba(10,16,22,0.72)] px-4 py-6 text-center">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">Compatibility Score</p>
                      <p className="mt-3 text-5xl font-semibold tracking-tight text-stone-50">91%</p>
                      <p className="mt-2 text-sm font-medium text-emerald-200">Excellent Match</p>
                    </div>
                    <PreviewDogCard label="Dam" name="Stonehaven Ember" detail="Cycle ready / Clearances current" />
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <PreviewLine label="Heat" value="Logged" />
                    <PreviewLine label="Ovulation" value="Confirmed" />
                    <PreviewLine label="Breeding" value="In progress" />
                    <PreviewLine label="Whelping" value="Approaching" />
                  </div>

                  <div className="mt-4 flex flex-wrap content-start gap-2">
                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs whitespace-nowrap">
                      Pairing in progress
                    </span>
                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs whitespace-nowrap">
                      Whelping window approaching
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Surface>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-20">
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

function PreviewMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.045] px-4 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-stone-50">{value}</p>
    </div>
  );
}

function PreviewLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-xl border border-white/[0.06] bg-black/10 px-3 py-2.5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="min-w-0 text-sm text-stone-300">{label}</span>
        <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs whitespace-nowrap">
          {value}
        </span>
      </div>
    </div>
  );
}

function PreviewDogCard({
  label,
  name,
  detail,
}: {
  label: string;
  name: string;
  detail: string;
}) {
  return (
    <div className="min-w-0 rounded-[20px] border border-white/[0.06] bg-black/10 p-4">
      <div className="flex items-center gap-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-gold/20 bg-gold/10 text-sm font-semibold text-gold">
          {name.slice(0, 1)}
        </span>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">{label}</p>
          <p className="mt-1 truncate font-semibold text-stone-100">{name}</p>
        </div>
      </div>
      <div className="mt-4 rounded-xl border border-white/[0.06] bg-white/[0.025] px-3 py-2.5">
        <p className="text-sm text-stone-300">{detail}</p>
      </div>
    </div>
  );
}
