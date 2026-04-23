"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState, type ComponentType } from "react";
import {
  BadgeDollarSign,
  BellRing,
  Car,
  ChevronRight,
  ClipboardCheck,
  CreditCard,
  FileText,
  FolderOpen,
  Globe2,
  Home,
  LockKeyhole,
  PawPrint,
  Route,
  Settings,
  ShieldCheck,
  Users,
} from "lucide-react";
import type { SubscriptionContext } from "@/lib/auth";
import type { FeatureKey } from "@/lib/upgrade";
import { getUpgradeCopy, hasFeatureAccess } from "@/lib/upgrade";
import { cn } from "@/lib/utils";
import { UpgradeModal } from "@/components/admin/upgrade-modal";
import { logUpgradeEvent } from "@/components/admin/upgrade-prompt";

type NavState = "available" | "locked";

type NavItem = {
  label: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
  description: string;
  featureKey: FeatureKey;
  state?: NavState;
};

type NavSection = {
  label: string;
  items: NavItem[];
};

const sections: NavSection[] = [
  {
    label: "Breeder Operations",
    items: [
      { label: "Dashboard", href: "/admin", icon: Home, description: "Kennel command", featureKey: "dashboard" },
      { label: "Dogs", href: "/admin/dogs", icon: PawPrint, description: "Program roster", featureKey: "dogs" },
      { label: "Breeding Program", href: "/admin/breeding-program", icon: Route, description: "Pairing engine", featureKey: "breeding_program" },
      { label: "Litters", href: "/admin/litters", icon: FolderOpen, description: "Litter control", featureKey: "litters" },
      { label: "Puppies", href: "/admin/puppies", icon: ShieldCheck, description: "Placement pipeline", featureKey: "puppies" },
    ],
  },
  {
    label: "Business Operations",
    items: [
      { label: "Buyers", href: "/admin/buyers", icon: Users, description: "Buyer files", featureKey: "buyers" },
      { label: "Applications", href: "/admin/applications", icon: ClipboardCheck, description: "Intake review", featureKey: "applications" },
      { label: "Payments", href: "/admin/payments", icon: BadgeDollarSign, description: "Account control", featureKey: "payments" },
      { label: "Documents", href: "/admin/documents", icon: FileText, description: "Contracts and files", featureKey: "documents" },
      { label: "Website Builder", href: "/admin/website-builder", icon: Globe2, description: "Breeder site copy", featureKey: "website_builder" },
      { label: "Transportation", href: "/admin/transportation", icon: Car, description: "Delivery logistics", featureKey: "transportation" },
      { label: "Automation", href: "/admin/automation", icon: BellRing, description: "Workflow notices", featureKey: "automation" },
    ],
  },
  {
    label: "System",
    items: [
      { label: "Settings", href: "/admin/settings", icon: Settings, description: "Workspace controls", featureKey: "settings" },
      { label: "Billing", href: "/admin/billing", icon: CreditCard, description: "Plan and invoices", featureKey: "billing" },
    ],
  },
];

export function AdminNavigation({ subscription }: { subscription: SubscriptionContext }) {
  const pathname = usePathname();
  const [activeItem, setActiveItem] = useState<NavItem | null>(null);

  const modalCopy = useMemo(
    () => (activeItem ? getUpgradeCopy(activeItem.featureKey) : null),
    [activeItem],
  );

  return (
    <>
      <nav className="flex-1 space-y-5">
        {sections.map((section) => (
        <section key={section.label} className="space-y-2">
          <div className="flex items-center gap-3 px-2">
            <div className="h-px flex-1 bg-gradient-to-r from-white/[0.16] to-white/[0.02]" />
            <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-stone-500">
              {section.label}
            </p>
          </div>

          <div className="space-y-1.5">
            {section.items.map((item) => {
              const Icon = item.icon;
              const locked = item.state === "locked" || !hasFeatureAccess(subscription.planKey, item.featureKey);
              const active = !locked && isActive(pathname, item.href);

              const content = (
                <span
                  className={cn(
                    "group relative flex min-h-16 items-center gap-3 overflow-hidden rounded-2xl border px-3.5 py-3 text-left transition-all duration-200",
                    active &&
                      "border-gold/30 bg-[linear-gradient(135deg,rgba(215,173,103,0.18),rgba(215,173,103,0.06)_28%,rgba(255,255,255,0.04)_66%,rgba(14,20,26,0.92))] shadow-[0_18px_34px_rgba(0,0,0,0.28),0_0_0_1px_rgba(215,173,103,0.08)]",
                    !active &&
                      !locked &&
                      "border-white/[0.06] bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.018))] hover:border-white/[0.12] hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.025))] hover:shadow-[0_14px_30px_rgba(0,0,0,0.22)]",
                    locked &&
                      "cursor-not-allowed border-white/[0.05] bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.012))] opacity-70",
                  )}
                >
                  <span
                    className={cn(
                      "absolute inset-y-3 left-0 w-1 rounded-r-full transition-all",
                      active ? "bg-gold shadow-[0_0_18px_rgba(215,173,103,0.75)]" : "bg-transparent",
                    )}
                  />

                  <span
                    className={cn(
                      "relative flex size-10 shrink-0 items-center justify-center rounded-xl border transition-all",
                      active &&
                        "border-gold/30 bg-[radial-gradient(circle_at_30%_20%,rgba(241,201,121,0.28),rgba(215,173,103,0.12)_42%,rgba(10,16,22,0.92))] text-gold-soft shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_10px_24px_rgba(215,173,103,0.14)]",
                      !active &&
                        !locked &&
                        "border-white/[0.08] bg-[#101821] text-stone-300 group-hover:border-gold/18 group-hover:text-gold-soft",
                      locked && "border-white/[0.06] bg-[#0d1319] text-stone-600",
                    )}
                  >
                    <Icon className="size-[18px]" />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span
                      className={cn(
                        "block truncate text-sm font-semibold tracking-[0.01em]",
                        active ? "text-stone-50" : locked ? "text-stone-500" : "text-stone-200",
                      )}
                    >
                      {item.label}
                    </span>
                    <span
                      className={cn(
                        "mt-1 block truncate text-[11px]",
                        active ? "text-stone-300" : locked ? "text-stone-600" : "text-stone-500",
                      )}
                    >
                      {item.description}
                    </span>
                  </span>

                  {locked ? (
                    <LockKeyhole className="size-4 shrink-0 text-stone-600" aria-hidden="true" />
                  ) : (
                    <ChevronRight
                      className={cn(
                        "size-4 shrink-0 transition-all",
                        active ? "translate-x-0 text-gold-soft" : "text-stone-600 group-hover:translate-x-0.5 group-hover:text-stone-400",
                      )}
                      aria-hidden="true"
                    />
                  )}
                </span>
              );

              if (locked) {
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => {
                      logUpgradeEvent({
                        triggerType: "feature_lock_click",
                        currentPlan: subscription.planKey,
                        suggestedPlan: getUpgradeCopy(item.featureKey).suggestedPlan,
                        sourceArea: `admin-navigation:${item.href}`,
                        featureKey: item.featureKey,
                      });
                      setActiveItem(item);
                    }}
                    className="block w-full"
                  >
                    {content}
                  </button>
                );
              }

              return (
                <Link key={item.label} href={item.href} className="block">
                  {content}
                </Link>
              );
            })}
          </div>
        </section>
        ))}
      </nav>

      {activeItem && modalCopy ? (
        <UpgradeModal
          open
          onClose={() => setActiveItem(null)}
          title={modalCopy.title}
          body={modalCopy.body}
          primaryLabel={modalCopy.primaryLabel}
          secondaryLabel={modalCopy.secondaryLabel}
          suggestedPlan={modalCopy.suggestedPlan}
          currentPlan={subscription.planKey}
          sourceArea={`admin-navigation:${activeItem.href}`}
          featureKey={activeItem.featureKey}
          onOpen={() =>
            logUpgradeEvent({
              triggerType: "modal_open",
              currentPlan: subscription.planKey,
              suggestedPlan: modalCopy.suggestedPlan,
              sourceArea: `admin-navigation:${activeItem.href}`,
              featureKey: activeItem.featureKey,
            })
          }
          onPrimary={() =>
            logUpgradeEvent({
              triggerType: "upgrade_cta_click",
              currentPlan: subscription.planKey,
              suggestedPlan: modalCopy.suggestedPlan,
              sourceArea: `admin-navigation:${activeItem.href}`,
              featureKey: activeItem.featureKey,
            })
          }
          onDismiss={() =>
            logUpgradeEvent({
              triggerType: "dismissed_prompt",
              currentPlan: subscription.planKey,
              suggestedPlan: modalCopy.suggestedPlan,
              sourceArea: `admin-navigation:${activeItem.href}`,
              featureKey: activeItem.featureKey,
            })
          }
        />
      ) : null}
    </>
  );
}

function isActive(pathname: string, href: string) {
  if (href === "/admin") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}
