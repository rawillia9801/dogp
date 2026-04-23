"use client";

import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import { ArrowRight, LockKeyhole, Sparkles } from "lucide-react";
import type { PlanKey } from "@/lib/plans";
import type { FeatureKey, UpgradeEventTrigger } from "@/lib/upgrade";
import { displayPlanName, getBillingHref } from "@/lib/upgrade";

type UpgradePromptProps = {
  title: string;
  body: string;
  currentPlan: PlanKey;
  suggestedPlan: PlanKey;
  primaryLabel: string;
  secondaryLabel?: string;
  sourceArea: string;
  featureKey: FeatureKey;
  dismissible?: boolean;
  compact?: boolean;
};

export function UpgradePrompt({
  title,
  body,
  currentPlan,
  suggestedPlan,
  primaryLabel,
  secondaryLabel = "View Plans",
  sourceArea,
  featureKey,
  dismissible = false,
  compact = false,
}: UpgradePromptProps) {
  const [dismissed, setDismissed] = useState(false);
  const billingHref = useMemo(
    () => getBillingHref(suggestedPlan, featureKey, sourceArea),
    [featureKey, sourceArea, suggestedPlan],
  );

  if (dismissed) {
    return null;
  }

  return (
    <div className="rounded-[22px] border border-gold/20 bg-[radial-gradient(circle_at_16%_10%,rgba(215,173,103,0.15),transparent_34%),linear-gradient(135deg,rgba(215,173,103,0.08),rgba(255,255,255,0.03)_38%,rgba(12,18,24,0.94))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
      <div className={compact ? "flex items-start gap-3" : "flex items-start gap-4"}>
        <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-2xl border border-gold/25 bg-gold/10 text-gold">
          <LockKeyhole className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full border border-gold/25 bg-gold/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-gold-soft">
              {displayPlanName(suggestedPlan)}
            </span>
            <span className="inline-flex items-center rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-stone-300">
              {displayPlanName(currentPlan)}
            </span>
          </div>
          <p className="mt-3 font-semibold text-stone-100">{title}</p>
          <p className="mt-2 text-sm leading-6 text-stone-400">{body}</p>

          <div className="mt-4 flex flex-wrap gap-3">
            <TrackedLink
              href={billingHref}
              triggerType="upgrade_cta_click"
              currentPlan={currentPlan}
              suggestedPlan={suggestedPlan}
              sourceArea={sourceArea}
              featureKey={featureKey}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-gold/35 bg-gold px-4 text-sm font-semibold text-[#20160c] shadow-gold"
            >
              {primaryLabel}
              <ArrowRight className="size-4" />
            </TrackedLink>
            <TrackedLink
              href="/admin/billing"
              triggerType="feature_lock_click"
              currentPlan={currentPlan}
              suggestedPlan={suggestedPlan}
              sourceArea={sourceArea}
              featureKey={featureKey}
              className="inline-flex h-10 items-center rounded-xl border border-white/[0.12] bg-white/[0.04] px-4 text-sm font-semibold text-stone-100"
            >
              {secondaryLabel}
            </TrackedLink>
            {dismissible ? (
              <button
                type="button"
                onClick={() => {
                  logUpgradeEvent({
                    triggerType: "dismissed_prompt",
                    currentPlan,
                    suggestedPlan,
                    sourceArea,
                    featureKey,
                  });
                  setDismissed(true);
                }}
                className="inline-flex h-10 items-center rounded-xl border border-white/[0.08] bg-transparent px-4 text-sm font-semibold text-stone-400 transition hover:border-white/[0.12] hover:text-stone-200"
              >
                Not now
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export function logUpgradeEvent({
  triggerType,
  currentPlan,
  suggestedPlan,
  sourceArea,
  featureKey,
  metadata,
}: {
  triggerType: UpgradeEventTrigger;
  currentPlan: PlanKey;
  suggestedPlan: PlanKey;
  sourceArea: string;
  featureKey: FeatureKey;
  metadata?: Record<string, unknown>;
}) {
  void fetch("/api/admin/upgrade-events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      triggerType,
      sourceArea,
      currentPlan,
      suggestedPlan,
      metadata: {
        featureKey,
        ...metadata,
      },
    }),
  });
}

function TrackedLink({
  href,
  triggerType,
  currentPlan,
  suggestedPlan,
  sourceArea,
  featureKey,
  className,
  children,
}: {
  href: string;
  triggerType: UpgradeEventTrigger;
  currentPlan: PlanKey;
  suggestedPlan: PlanKey;
  sourceArea: string;
  featureKey: FeatureKey;
  className: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={() =>
        logUpgradeEvent({
          triggerType,
          currentPlan,
          suggestedPlan,
          sourceArea,
          featureKey,
        })
      }
      className={className}
    >
      {children}
    </Link>
  );
}

export function UpgradePromptBadge({ planKey }: { planKey: PlanKey }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-gold/25 bg-gold/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-gold-soft">
      <Sparkles className="size-3.5" />
      {displayPlanName(planKey)}
    </span>
  );
}
