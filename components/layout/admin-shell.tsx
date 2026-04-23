import Link from "next/link";
import type { ReactNode } from "react";
import {
  CircleDot,
  LogOut,
  PawPrint,
  Search,
  ShieldCheck,
} from "lucide-react";
import { logoutAction, type OrganizationContext } from "@/lib/auth";
import { AdminNavigation } from "@/components/layout/admin-navigation";
import { ChiChiAssistant } from "@/components/admin/chichi-assistant";

export function AdminShell({
  children,
  organization,
}: {
  children: ReactNode;
  organization: OrganizationContext;
}) {
  const initials = organization.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <div className="min-h-screen bg-app text-stone-100">
      <aside className="fixed inset-y-0 left-0 hidden w-[312px] px-4 py-4 lg:block">
        <div className="flex h-full flex-col overflow-hidden rounded-[28px] border border-white/[0.08] bg-[linear-gradient(180deg,rgba(14,19,25,0.98),rgba(9,13,18,0.96)_42%,rgba(8,11,16,0.98))] shadow-[0_26px_60px_rgba(0,0,0,0.34),inset_0_1px_0_rgba(255,255,255,0.05)]">
          <div className="border-b border-white/[0.07] px-5 py-5">
            <Link
              href="/admin"
              className="block rounded-[22px] border border-white/[0.08] bg-[radial-gradient(circle_at_18%_10%,rgba(215,173,103,0.2),transparent_38%),linear-gradient(145deg,rgba(20,27,35,0.98),rgba(11,16,22,0.96))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_16px_38px_rgba(0,0,0,0.22)]"
            >
              <div className="flex items-start gap-3">
                <div className="relative flex size-14 shrink-0 items-center justify-center rounded-2xl border border-gold/25 bg-[radial-gradient(circle_at_30%_20%,rgba(241,201,121,0.28),rgba(215,173,103,0.12)_42%,rgba(10,16,22,0.94))] shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_12px_28px_rgba(215,173,103,0.14)]">
                  <PawPrint className="size-7 fill-gold text-gold" />
                  <span className="absolute -right-1 -top-1 size-3 rounded-full border border-[#1b140b] bg-gold shadow-[0_0_18px_rgba(215,173,103,0.75)]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-gold-soft/90">
                    Breeder Operating System
                  </p>
                  <p className="mt-2 text-xl font-semibold tracking-[0.01em] text-stone-50">
                    mydogportal.site
                  </p>
                  <p className="mt-1 text-sm text-stone-400">
                    {organization.name}
                  </p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <BrandSignal label="Workspace" value={organization.role === "owner" ? "Owner" : "Staff"} />
                <BrandSignal label="Status" value="Operations live" />
              </div>
            </Link>
          </div>

          <div className="px-5 py-4">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-stone-500" />
              <input
                aria-label="Search navigation"
                placeholder="Search workspace"
                className="form-input h-11 rounded-xl border-white/[0.08] bg-white/[0.035] pl-9"
              />
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4">
            <AdminNavigation />
          </div>

          <div className="border-t border-white/[0.07] p-4">
            <div className="rounded-[22px] border border-white/[0.08] bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.018)),linear-gradient(145deg,rgba(14,20,26,0.96),rgba(10,14,20,0.96))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
              <div className="flex items-center gap-3">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-gold/20 bg-[radial-gradient(circle_at_30%_20%,rgba(215,173,103,0.24),rgba(215,173,103,0.1)_40%,rgba(12,16,22,0.94))] text-sm font-semibold text-gold-soft">
                  {initials || "MD"}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-stone-100">
                    {organization.name}
                  </p>
                  <div className="mt-1 flex items-center gap-2 text-[11px] text-stone-500">
                    <CircleDot className="size-3 fill-emerald-300 text-emerald-300" />
                    <span className="truncate">Protected breeder workspace</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <FooterMeta
                  icon={<ShieldCheck className="size-3.5" />}
                  label="Access"
                  value={organization.role === "owner" ? "Owner" : "Staff"}
                />
                <FooterMeta
                  icon={<PawPrint className="size-3.5" />}
                  label="Program"
                  value="Active"
                />
              </div>

              <form action={logoutAction} className="mt-4">
                <button className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 text-sm font-semibold text-stone-200 transition hover:border-gold/20 hover:bg-gold/10 hover:text-gold-soft">
                  <LogOut className="size-4" />
                  Log Out
                </button>
              </form>
            </div>
          </div>
        </div>
      </aside>

      <div className="lg:pl-[312px]">
        <header className="sticky top-0 z-20 border-b border-white/[0.08] bg-[#0b1016]/84 px-5 py-4 backdrop-blur-xl lg:px-8">
          <div className="mx-auto flex max-w-[1560px] items-center justify-between gap-5">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gold">
                Admin Command
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <p className="text-lg font-semibold text-stone-50">
                  {organization.name}
                </p>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-300">
                  <CircleDot className="size-3 fill-emerald-300 text-emerald-300" />
                  Owner Workspace
                </span>
              </div>
            </div>

            <div className="relative w-full max-w-md">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-stone-500" />
              <input
                aria-label="Search workspace"
                placeholder="Search dogs, pairings, buyers, and notices"
                className="form-input h-11 rounded-xl border-white/[0.08] bg-white/[0.04] pl-9"
              />
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1560px] px-5 py-8 lg:px-8">
          {children}
        </main>
      </div>

      <ChiChiAssistant />
    </div>
  );
}

function BrandSignal({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] px-3 py-2.5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-500">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-stone-100">{value}</p>
    </div>
  );
}

function FooterMeta({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2.5">
      <div className="flex items-center gap-2 text-stone-500">
        <span className="text-gold">{icon}</span>
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em]">
          {label}
        </p>
      </div>
      <p className="mt-1 text-sm font-semibold text-stone-100">{value}</p>
    </div>
  );
}
