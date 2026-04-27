import Link from "next/link";
import type { ReactNode } from "react";
import { Baby, Bell, Bot, CreditCard, Dog, FileCheck2, FileText, Gauge, Globe2, HeartPulse, LogOut, PawPrint, Route, Search, Send, Settings, ShieldCheck, Users } from "lucide-react";
import { logoutAction, type OrganizationContext, type SubscriptionContext } from "@/lib/auth";

const navItems = [
  ["Command Center", "/dashboard", Gauge],
  ["Dogs", "/dashboard/dogs", Dog],
  ["Breeding Program", "/dashboard/breeding-program", HeartPulse],
  ["Litters", "/dashboard/litters", Baby],
  ["Puppies", "/dashboard/puppies", PawPrint],
  ["Applications", "/dashboard/applications", FileCheck2],
  ["Buyers", "/dashboard/buyers", Users],
  ["Payments", "/dashboard/payments", CreditCard],
  ["Documents", "/dashboard/documents", FileText],
  ["Transportation", "/dashboard/transportation", Route],
  ["Automation", "/dashboard/automation", Send],
  ["Website", "/dashboard/website", Globe2],
  ["Settings", "/dashboard/settings", Settings],
] as const;

export function SubscriberShell({ children, organization, subscription }: { children: ReactNode; organization: OrganizationContext; subscription: SubscriptionContext }) {
  const initials = organization.name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "MD";

  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#1C2B39]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[304px] px-4 py-4 xl:block">
        <div className="flex h-full flex-col overflow-hidden rounded-[30px] border border-[#DED6C7] bg-[#FBFAF6] shadow-[0_22px_60px_rgba(49,88,66,0.12)]">
          <div className="border-b border-[#E7DFD0] p-4">
            <Link href="/dashboard" className="block rounded-[24px] border border-[#DED6C7] bg-white p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#315842] text-white shadow-lg shadow-[#315842]/20">
                  <PawPrint className="h-7 w-7" />
                  <span className="absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-[#C7A866]" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#B08A46]">Breeder Operating System</p>
                  <p className="mt-1 truncate text-xl font-black tracking-tight text-[#1C2B39]">MyDogPortal</p>
                  <p className="mt-1 truncate text-sm font-semibold text-[#66757A]">{organization.name}</p>
                </div>
              </div>
            </Link>
          </div>

          <div className="px-4 py-4">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A8173]" />
              <input aria-label="Search workspace" placeholder="Search workspace" className="h-11 w-full rounded-2xl border border-[#DED6C7] bg-white pl-9 pr-3 text-sm font-semibold outline-none placeholder:text-[#A59D90] focus:border-[#C7A866]" />
            </div>
          </div>

          <nav className="min-h-0 flex-1 overflow-y-auto px-4 pb-4">
            <div className="space-y-1.5">
              {navItems.map(([label, href, Icon]) => (
                <Link key={label} href={href} className="group flex items-center justify-between rounded-2xl px-4 py-2.5 text-sm font-black text-[#52616B] transition hover:bg-white hover:text-[#315842] hover:shadow-sm">
                  <span className="flex items-center gap-3"><Icon className="h-4 w-4 text-[#8A8173] transition group-hover:text-[#B08A46]" />{label}</span>
                </Link>
              ))}
            </div>
          </nav>

          <div className="border-t border-[#E7DFD0] p-4">
            <div className="rounded-[24px] border border-[#DED6C7] bg-white p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#EEF4EC] text-sm font-black text-[#315842]">{initials}</div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-black text-[#1C2B39]">{organization.name}</p>
                  <p className="mt-1 text-xs font-bold text-[#66757A]">{subscription.planName} plan</p>
                  <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#EEF4EC] px-2.5 py-1 text-[11px] font-black text-[#315842]"><ShieldCheck className="h-3.5 w-3.5" />Protected</div>
                </div>
              </div>
              <form action={logoutAction} className="mt-4">
                <button className="flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-[#DED6C7] bg-[#FBFAF6] px-4 text-sm font-black text-[#315842] transition hover:bg-[#F3EFE5]"><LogOut className="h-4 w-4" />Sign out</button>
              </form>
            </div>
          </div>
        </div>
      </aside>

      <div className="xl:pl-[304px]">
        <header className="sticky top-0 z-30 border-b border-[#DED6C7] bg-[#F7F5EF]/92 px-4 py-3 backdrop-blur-xl md:px-7">
          <div className="mx-auto flex max-w-[1560px] items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#B08A46]">Subscriber Workspace</p>
              <p className="mt-1 text-lg font-black text-[#1C2B39]">{organization.name}</p>
            </div>
            <div className="hidden min-w-[360px] items-center gap-2 rounded-full border border-[#DED6C7] bg-white px-4 py-2.5 shadow-sm lg:flex">
              <Search className="h-4 w-4 text-[#8A8173]" />
              <input className="w-full bg-transparent text-sm font-semibold outline-none placeholder:text-[#A59D90]" placeholder="Search dogs, buyers, contracts, payments..." />
            </div>
            <div className="flex items-center gap-2">
              <Link href="/dashboard/automation" className="hidden items-center gap-2 rounded-2xl bg-[#315842] px-4 py-2.5 text-sm font-black text-white shadow-sm shadow-[#315842]/15 md:flex"><Bot className="h-4 w-4" />Breeder Buddy</Link>
              <Link href="/dashboard/settings" className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#DED6C7] bg-white text-[#315842] shadow-sm"><Settings className="h-5 w-5" /></Link>
              <button className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-[#DED6C7] bg-white text-[#315842] shadow-sm"><Bell className="h-5 w-5" /></button>
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-[1560px]">{children}</main>
      </div>
    </div>
  );
}
