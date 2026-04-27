import Link from "next/link";
import type { ReactNode } from "react";
import { Baby, Bell, Bot, CircleDot, CreditCard, Dog, FileCheck2, FileText, Gauge, Globe2, HeartPulse, LogOut, PawPrint, Route, Search, Send, Settings, ShieldCheck, Users } from "lucide-react";
import { logoutAction, type OrganizationContext, type SubscriptionContext } from "@/lib/auth";

const navItems = [
  ["Dashboard", "Kennel command", "/dashboard", Gauge],
  ["Dogs", "Program roster", "/dashboard/dogs", Dog],
  ["Breeding Program", "Pairing engine", "/dashboard/breeding-program", HeartPulse],
  ["Litters", "Whelping board", "/dashboard/litters", Baby],
  ["Puppies", "Availability", "/dashboard/puppies", PawPrint],
  ["Applications", "Screening", "/dashboard/applications", FileCheck2],
  ["Buyers", "Client CRM", "/dashboard/buyers", Users],
  ["Payments", "Revenue", "/dashboard/payments", CreditCard],
  ["Documents", "Contracts", "/dashboard/documents", FileText],
  ["Transportation", "Delivery", "/dashboard/transportation", Route],
  ["Automation", "Email engine", "/dashboard/automation", Send],
  ["Website", "Public site", "/dashboard/website", Globe2],
  ["Settings", "Workspace", "/dashboard/settings", Settings],
] as const;

export function SubscriberShell({ children, organization, subscription }: { children: ReactNode; organization: OrganizationContext; subscription: SubscriptionContext }) {
  const initials = organization.name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "MD";

  return (
    <div className="min-h-screen bg-[#F4F0E7] text-[#172638]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[312px] px-4 py-4 xl:block">
        <div className="grid h-full grid-rows-[auto_auto_auto_minmax(0,1fr)_auto] overflow-hidden rounded-[28px] border border-[#D8CFBF] bg-[#FBFAF6] shadow-[0_26px_60px_rgba(49,88,66,0.16)]">
          <div className="border-b border-[#E2D8C8] px-4 py-4">
            <Link href="/dashboard" className="block rounded-[22px] border border-[#D8CFBF] bg-[radial-gradient(circle_at_18%_10%,rgba(199,168,102,0.22),transparent_40%),linear-gradient(145deg,#ffffff,#F4F0E7)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_16px_38px_rgba(49,88,66,0.10)]">
              <div className="flex items-start gap-3">
                <div className="relative flex size-14 shrink-0 items-center justify-center rounded-2xl border border-[#C7A866]/35 bg-[#315842] text-white shadow-[0_12px_28px_rgba(49,88,66,0.22)]">
                  <PawPrint className="size-7" />
                  <span className="absolute -right-1 -top-1 size-3 rounded-full border border-white bg-[#C7A866] shadow-[0_0_18px_rgba(199,168,102,0.75)]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#B08A46]">Breeder Operating System</p>
                  <p className="mt-2 text-xl font-black tracking-tight text-[#172638]">MyDogPortal</p>
                  <p className="mt-1 truncate text-sm font-semibold text-[#5C6872]">{organization.name}</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <BrandSignal label="Workspace" value={organization.role === "owner" ? "Owner" : "Staff"} />
                <BrandSignal label="Status" value="Live" />
              </div>
            </Link>
          </div>

          <div className="px-4 py-4">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#8A8173]" />
              <input aria-label="Search workspace" placeholder="Search workspace" className="h-11 w-full rounded-xl border border-[#D8CFBF] bg-white pl-9 pr-3 text-sm font-semibold outline-none placeholder:text-[#A59D90] focus:border-[#C7A866]" />
            </div>
          </div>

          <div className="shrink-0 px-4 pb-2">
            <div className="flex items-center gap-3 border-t border-[#E2D8C8] pt-3">
              <div className="h-px flex-1 bg-[#E2D8C8]" />
              <p className="text-[10px] font-black uppercase tracking-[0.26em] text-[#A88652]">Breeder Operations</p>
              <div className="h-px flex-1 bg-[#E2D8C8]" />
            </div>
          </div>

          <nav className="min-h-0 overflow-y-auto overscroll-contain px-3 pb-4">
            <div className="space-y-2">
              {navItems.map(([label, sublabel, href, Icon], index) => (
                <Link key={label} href={href} className={`group flex items-center justify-between rounded-[18px] border px-3 py-3 transition ${index === 0 ? "border-[#C7A866]/65 bg-[#315842] text-white shadow-[0_12px_30px_rgba(49,88,66,0.18)]" : "border-[#E2D8C8] bg-white/55 text-[#334554] hover:border-[#C7A866]/50 hover:bg-white hover:shadow-sm"}`}>
                  <span className="flex items-center gap-3">
                    <span className={`flex size-9 items-center justify-center rounded-2xl border ${index === 0 ? "border-white/15 bg-white/12 text-[#F4D68C]" : "border-[#D8CFBF] bg-[#F8F5EE] text-[#315842]"}`}><Icon className="size-4" /></span>
                    <span><span className="block text-sm font-black leading-tight">{label}</span><span className={`mt-1 block text-[11px] font-semibold leading-tight ${index === 0 ? "text-white/75" : "text-[#7B756A]"}`}>{sublabel}</span></span>
                  </span>
                  <span className={index === 0 ? "text-[#F4D68C]" : "text-[#B08A46]"}>›</span>
                </Link>
              ))}
            </div>
          </nav>

          <div className="border-t border-[#E2D8C8] p-4">
            <div className="rounded-[22px] border border-[#D8CFBF] bg-white p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
              <div className="flex items-start gap-3">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-[#D8CFBF] bg-[#F4F0E7] text-sm font-black text-[#315842]">{initials}</div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-black text-[#172638]">{organization.name}</p>
                  <div className="mt-1 flex items-center gap-2 text-[11px] font-semibold text-[#66757A]"><CircleDot className="size-3 fill-emerald-400 text-emerald-400" />Protected breeder workspace</div>
                  <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-[#C7A866]/35 bg-[#FFF7E6] px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] text-[#8A6422]"><PawPrint className="size-3" />{subscription.planName}</div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <FooterMeta icon={<ShieldCheck className="size-3.5" />} label="Access" value={organization.role === "owner" ? "Owner" : "Staff"} />
                <FooterMeta icon={<PawPrint className="size-3.5" />} label="Plan" value={subscription.planName} />
              </div>
              <form action={logoutAction} className="mt-4">
                <button className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#D8CFBF] bg-[#F8F5EE] px-4 text-sm font-black text-[#315842] transition hover:border-[#C7A866]/60 hover:bg-[#FFF7E6]"><LogOut className="size-4" />Log Out</button>
              </form>
            </div>
          </div>
        </div>
      </aside>

      <div className="xl:pl-[312px]">
        <header className="sticky top-0 z-30 border-b border-[#D8CFBF] bg-[#F4F0E7]/92 px-5 py-4 backdrop-blur-xl lg:px-8">
          <div className="mx-auto flex max-w-[1560px] items-center justify-between gap-5">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#B08A46]">Subscriber Command</p>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <p className="text-lg font-black text-[#172638]">{organization.name}</p>
                <span className="inline-flex items-center gap-2 rounded-full border border-[#D8CFBF] bg-white px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em] text-[#315842]"><CircleDot className="size-3 fill-emerald-400 text-emerald-400" />Owner Workspace</span>
                <span className="inline-flex items-center gap-2 rounded-full border border-[#C7A866]/40 bg-[#FFF7E6] px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em] text-[#8A6422]">{subscription.planName}</span>
              </div>
            </div>
            <div className="relative hidden w-full max-w-md lg:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#8A8173]" />
              <input aria-label="Search workspace" placeholder="Search dogs, pairings, buyers, and notices" className="h-11 w-full rounded-xl border border-[#D8CFBF] bg-white pl-9 pr-3 text-sm font-semibold outline-none placeholder:text-[#A59D90] focus:border-[#C7A866]" />
            </div>
            <div className="flex items-center gap-2">
              <Link href="/dashboard/automation" className="hidden items-center gap-2 rounded-xl bg-[#315842] px-4 py-2.5 text-sm font-black text-white shadow-sm shadow-[#315842]/15 md:flex"><Bot className="size-4" />Breeder Buddy</Link>
              <Link href="/dashboard/settings" className="flex size-11 items-center justify-center rounded-xl border border-[#D8CFBF] bg-white text-[#315842] shadow-sm"><Settings className="size-5" /></Link>
              <button className="relative flex size-11 items-center justify-center rounded-xl border border-[#D8CFBF] bg-white text-[#315842] shadow-sm"><Bell className="size-5" /></button>
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-[1560px]">{children}</main>
      </div>
    </div>
  );
}

function BrandSignal({ label, value }: { label: string; value: string }) { return <div className="rounded-2xl border border-[#E2D8C8] bg-white/70 px-3 py-2.5"><p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#9A875D]">{label}</p><p className="mt-1 text-sm font-black text-[#172638]">{value}</p></div>; }
function FooterMeta({ icon, label, value }: { icon: ReactNode; label: string; value: string }) { return <div className="rounded-xl border border-[#E2D8C8] bg-[#FBFAF6] px-3 py-2.5"><div className="flex items-center gap-2 text-[#8A8173]"><span className="text-[#B08A46]">{icon}</span><p className="text-[10px] font-black uppercase tracking-[0.2em]">{label}</p></div><p className="mt-1 text-sm font-black text-[#172638]">{value}</p></div>; }
