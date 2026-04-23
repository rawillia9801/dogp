import type { Metadata } from "next";
import { Check } from "lucide-react";
import { getSubscription } from "@/lib/auth";
import { plans } from "@/lib/plans";
import { Surface } from "@/components/ui/surface";

export const metadata: Metadata = {
  title: "Billing",
};

export default async function BillingPage() {
  const subscription = await getSubscription();

  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-gold">Billing</p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight text-stone-50">
        Subscription
      </h1>
      <Surface className="mt-8 p-5">
        <p className="text-sm text-stone-400">Current plan</p>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <p className="text-2xl font-semibold text-stone-50">{subscription.planName}</p>
          <span className="rounded-full bg-gold/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-gold-soft">
            {subscription.status}
          </span>
        </div>
        <p className="mt-3 text-sm text-stone-500">
          Plan status and upgrade options are shown for account review.
        </p>
      </Surface>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        {plans.map((plan) => (
          <Surface key={plan.code} className={plan.popular ? "p-5 ring-1 ring-gold/45" : "p-5"}>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-stone-50">{plan.name}</h2>
              {plan.popular ? <span className="text-xs font-semibold text-gold-soft">Most popular</span> : null}
            </div>
            <p className="mt-4 text-4xl font-semibold text-stone-50">${plan.price}</p>
            <div className="mt-5 space-y-3">
              {plan.highlights.map((item) => (
                <p key={item} className="flex gap-3 text-sm text-stone-300">
                  <Check className="mt-0.5 size-4 text-gold" />
                  {item}
                </p>
              ))}
            </div>
            <button className="mt-6 h-10 w-full rounded-md border border-gold/25 text-sm font-semibold text-gold-soft">
              Upgrade
            </button>
          </Surface>
        ))}
      </div>
    </div>
  );
}
