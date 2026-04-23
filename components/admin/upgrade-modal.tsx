"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { LockKeyhole, Sparkles, X } from "lucide-react";
import type { PlanKey } from "@/lib/plans";
import type { FeatureKey } from "@/lib/upgrade";
import { displayPlanName, getBillingHref } from "@/lib/upgrade";
import { logUpgradeEvent } from "@/components/admin/upgrade-prompt";

type UpgradeModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  body: string;
  primaryLabel: string;
  secondaryLabel: string;
  suggestedPlan: PlanKey;
  currentPlan: PlanKey;
  sourceArea: string;
  featureKey: FeatureKey;
  onOpen?: () => void;
  onPrimary?: () => void;
  onSecondary?: () => void;
  onDismiss?: () => void;
};

export function UpgradeModal({
  open,
  onClose,
  title,
  body,
  primaryLabel,
  secondaryLabel,
  suggestedPlan,
  currentPlan,
  sourceArea,
  featureKey,
  onOpen,
  onPrimary,
  onSecondary,
  onDismiss,
}: UpgradeModalProps) {
  useEffect(() => {
    if (open) {
      onOpen?.();
    }
  }, [open, onOpen]);

  if (!open) {
    return null;
  }

  const billingHref = getBillingHref(suggestedPlan, featureKey, sourceArea);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/72 px-4 py-8 backdrop-blur-md">
      <div className="w-full max-w-lg overflow-hidden rounded-[28px] border border-white/[0.08] bg-[radial-gradient(circle_at_14%_12%,rgba(215,173,103,0.18),transparent_32%),linear-gradient(180deg,rgba(15,21,29,0.98),rgba(8,12,18,0.98))] shadow-[0_32px_90px_rgba(0,0,0,0.48),inset_0_1px_0_rgba(255,255,255,0.05)]">
        <div className="flex items-start justify-between border-b border-white/[0.08] px-6 py-5">
          <div className="flex items-start gap-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-gold/25 bg-gold/10 text-gold">
              <LockKeyhole className="size-5" />
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center rounded-full border border-gold/25 bg-gold/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-gold-soft">
                  {displayPlanName(suggestedPlan)}
                </span>
                <span className="inline-flex items-center rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-stone-300">
                  Current: {displayPlanName(currentPlan)}
                </span>
              </div>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-50">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-stone-400">{body}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              onDismiss?.();
              onClose();
            }}
            className="rounded-full border border-white/[0.08] bg-white/[0.04] p-2 text-stone-300 transition hover:border-white/[0.14] hover:text-stone-100"
            aria-label="Close upgrade prompt"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="px-6 py-5">
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4">
            <div className="flex items-center gap-2 text-gold">
              <Sparkles className="size-4" />
              <p className="text-xs font-semibold uppercase tracking-[0.18em]">Upgrade path</p>
            </div>
            <p className="mt-3 text-sm leading-6 text-stone-300">
              Unlock the next layer of breeder operations without changing the way your current workspace works.
            </p>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href={billingHref}
              onClick={onPrimary}
              className="inline-flex h-11 items-center justify-center rounded-xl border border-gold/35 bg-gold px-5 text-sm font-semibold text-[#20160c] shadow-gold"
            >
              {primaryLabel}
            </Link>
            <Link
              href="/admin/billing"
              onClick={onSecondary}
              className="inline-flex h-11 items-center justify-center rounded-xl border border-white/[0.12] bg-white/[0.04] px-5 text-sm font-semibold text-stone-100"
            >
              {secondaryLabel}
            </Link>
            <button
              type="button"
              onClick={() => {
                onDismiss?.();
                onClose();
              }}
              className="inline-flex h-11 items-center justify-center rounded-xl border border-white/[0.08] bg-transparent px-5 text-sm font-semibold text-stone-400 transition hover:border-white/[0.12] hover:text-stone-200"
            >
              Not now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function UpgradeActionButton({
  locked,
  title,
  body,
  primaryLabel,
  secondaryLabel,
  currentPlan,
  suggestedPlan,
  sourceArea,
  featureKey,
  href,
  className,
  children,
}: {
  locked: boolean;
  title: string;
  body: string;
  primaryLabel: string;
  secondaryLabel: string;
  currentPlan: PlanKey;
  suggestedPlan: PlanKey;
  sourceArea: string;
  featureKey: FeatureKey;
  href: string;
  className: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  if (!locked) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          logUpgradeEvent({
            triggerType: "feature_lock_click",
            currentPlan,
            suggestedPlan,
            sourceArea,
            featureKey,
          });
          setOpen(true);
        }}
        className={className}
      >
        {children}
      </button>

      <UpgradeModal
        open={open}
        onClose={() => setOpen(false)}
        title={title}
        body={body}
        primaryLabel={primaryLabel}
        secondaryLabel={secondaryLabel}
        suggestedPlan={suggestedPlan}
        currentPlan={currentPlan}
        sourceArea={sourceArea}
        featureKey={featureKey}
        onOpen={() =>
          logUpgradeEvent({
            triggerType: "modal_open",
            currentPlan,
            suggestedPlan,
            sourceArea,
            featureKey,
          })
        }
        onPrimary={() =>
          logUpgradeEvent({
            triggerType: "upgrade_cta_click",
            currentPlan,
            suggestedPlan,
            sourceArea,
            featureKey,
          })
        }
        onDismiss={() =>
          logUpgradeEvent({
            triggerType: "dismissed_prompt",
            currentPlan,
            suggestedPlan,
            sourceArea,
            featureKey,
          })
        }
      />
    </>
  );
}
