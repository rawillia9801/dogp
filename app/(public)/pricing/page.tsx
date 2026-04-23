import type { Metadata } from "next";
import { Check } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { Surface } from "@/components/ui/surface";
import { plans, comparisonRows } from "@/lib/plans";

export const metadata: Metadata = {
  title: "Pricing",
};

export default function PricingPage() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-16">
      <p className="text-sm font-semibold uppercase tracking-[0.28em] text-gold">Pricing</p>
      <h1 className="mt-4 max-w-4xl text-5xl font-semibold tracking-tight text-stone-50">
        Simple pricing for running your breeding program at scale.
      </h1>

      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        {plans.map((plan) => (
          <Surface key={plan.code} className={plan.popular ? "p-5 ring-1 ring-gold/45" : "p-5"}>
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-2xl font-semibold text-stone-50">{plan.name}</h2>
              {plan.popular ? (
                <span className="rounded-full bg-gold/12 px-3 py-1 text-xs font-semibold text-gold-soft">
                  Most popular
                </span>
              ) : null}
            </div>
            <div className="mt-6 flex items-end gap-2">
              <p className="text-5xl font-semibold text-stone-50">${plan.price}</p>
              <p className="pb-2 text-sm text-stone-500">/month</p>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-2 text-center text-xs text-stone-400">
              <Limit label="Dogs" value={plan.limits.dogs} />
              <Limit label="Litters" value={plan.limits.litters} />
              <Limit label="Users" value={plan.limits.users} />
            </div>
            <div className="mt-6 space-y-3">
              {plan.highlights.map((feature) => (
                <p key={feature} className="flex gap-3 text-sm text-stone-300">
                  <Check className="mt-0.5 size-4 shrink-0 text-gold" />
                  {feature}
                </p>
              ))}
            </div>
            <ButtonLink href="/sign-up" className="mt-6 w-full">
              Start Trial
            </ButtonLink>
          </Surface>
        ))}
      </div>

      <Surface className="mt-10 overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[720px]">
            <div className="grid grid-cols-4 border-b border-white/[0.08] bg-white/[0.035] text-sm font-semibold text-stone-100">
              <div className="p-4">Feature</div>
              <div className="p-4">Starter</div>
              <div className="p-4">Pro</div>
              <div className="p-4">Elite</div>
            </div>
            {comparisonRows.map((row) => (
              <div key={row[0]} className="grid grid-cols-4 border-b border-white/[0.06] text-sm text-stone-400 last:border-b-0">
                {row.map((cell) => (
                  <div key={cell} className="p-4">
                    {cell}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </Surface>
    </main>
  );
}

function Limit({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-md border border-white/[0.07] bg-white/[0.035] p-3">
      <p className="uppercase tracking-[0.16em] text-stone-500">{label}</p>
      <p className="mt-1 font-mono text-sm text-gold-soft">{value}</p>
    </div>
  );
}
