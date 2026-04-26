import type { ReactNode } from "react";
import {
  AlertTriangle,
  Baby,
  BadgeCheck,
  Bell,
  Bot,
  CalendarClock,
  CheckCircle2,
  ClipboardSignature,
  CreditCard,
  Dog,
  FileCheck2,
  FileText,
  Gauge,
  Globe2,
  HeartPulse,
  LineChart,
  PawPrint,
  Plus,
  Route,
  Search,
  Send,
  Settings,
  ShieldCheck,
  TimerReset,
  Truck,
  Users,
  WandSparkles,
} from "lucide-react";
import { getDashboardData } from "@/lib/dashboard-data";

const navItems = [
  ["Command Center", "/dashboard", Gauge, true],
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

const quickActions = [
  ["Add Dog", "/dashboard/dogs/new", Dog],
  ["Start Breeding Plan", "/dashboard/breeding-program/new", HeartPulse],
  ["Create Litter", "/dashboard/litters/new", Baby],
  ["Add Puppy", "/dashboard/puppies/new", PawPrint],
  ["Add Buyer", "/dashboard/buyers/new", Users],
  ["Log Payment", "/dashboard/payments/new", CreditCard],
  ["Generate Contract", "/dashboard/documents/new", FileText],
  ["Schedule Pickup", "/dashboard/transportation/new", Route],
] as const;

export default async function DashboardPage() {
  const live = await getDashboardData();

  const lifecycle = [
    ["Dogs", "/dashboard/dogs", Dog, "Foundation records", live.counts.dogs],
    ["Breedings", "/dashboard/breeding-program", HeartPulse, "Plans + pregnancies", live.counts.breedings + live.counts.pregnancies],
    ["Litters", "/dashboard/litters", Baby, "Whelping pipeline", live.counts.litters],
    ["Puppies", "/dashboard/puppies", PawPrint, "Live inventory", live.counts.puppies],
    ["Buyers", "/dashboard/buyers", Users, "CRM + approvals", live.counts.buyers],
    ["Payments", "/dashboard/payments", CreditCard, "Balances + due dates", `$${live.money.openBalances.toLocaleString()}`],
    ["Delivery", "/dashboard/transportation", Truck, "Pickup + transport", live.counts.transportation],
  ] as const;

  const healthCards = [
    ["Active breedings", String(live.counts.breedings + live.counts.pregnancies), `${live.counts.pregnancies} pregnancies in progress`, HeartPulse, "green"],
    ["Puppies available", `${live.counts.availablePuppies} / ${live.counts.puppies}`, `${live.counts.reservedPuppies} reserved or sold`, PawPrint, "gold"],
    ["Buyer balances", `$${live.money.openBalances.toLocaleString()}`, `${live.money.dueSoon} due soon · ${live.money.overdue} overdue`, CreditCard, "red"],
    ["Open alerts", String(live.counts.alertsOpen), `${live.counts.documentsPending} pending docs · ${live.counts.applications} pending applications`, AlertTriangle, "blue"],
  ] as const;

  const onboarding = [
    ["Add at least 1 dog", live.activation.hasDog],
    ["Create 1 breeding", live.activation.hasBreeding],
    ["Add 1 puppy", live.activation.hasPuppy],
    ["Add 1 buyer", live.activation.hasBuyer],
    ["Log 1 payment", live.activation.hasPayment],
  ] as const;

  const completed = onboarding.filter((x) => x[1]).length;

  return (
    <main className="min-h-screen bg-[#F7F5EF] text-[#1C2B39]">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700;9..144,800&family=DM+Sans:wght@400;500;700;800&display=swap'); body{font-family:'DM Sans',sans-serif;background:#F7F5EF}.font-display{font-family:'Fraunces',serif}`}</style>
      <div className="flex min-h-screen">
        <aside className="hidden w-[300px] shrink-0 border-r border-[#DDD6C8] bg-[#FBFAF6] px-5 py-5 xl:block">
          <a href="/dashboard" className="flex items-center gap-3 rounded-[1.75rem] border border-[#DDD6C8] bg-white p-3 shadow-sm"><div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-[#315842] text-white"><PawPrint className="h-6 w-6" /><span className="absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-[#C7A866]" /></div><div><p className="font-display text-xl font-black">MyDogPortal</p><p className="text-xs font-black uppercase tracking-[0.16em] text-[#7B756A]">Command Center</p></div></a>
          <div className="mt-5 rounded-[1.75rem] border border-[#DDD6C8] bg-[#ECEBE3] p-4"><div className="flex gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-[#315842]"><ShieldCheck className="h-5 w-5" /></div><div><p className="text-sm font-black">Morning command check</p><p className="mt-1 text-xs leading-5 text-[#5C6C72]">{live.organizationName}</p></div></div></div>
          <nav className="mt-5 space-y-1.5">{navItems.map(([label, href, Icon, active]) => <a key={label} href={href} className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-black ${active ? "bg-[#315842] text-white" : "text-[#52616B] hover:bg-white"}`}><Icon className="h-5 w-5" />{label}</a>)}</nav>
        </aside>
        <section className="flex-1">
          <header className="sticky top-0 z-30 border-b border-[#DDD6C8] bg-[#F7F5EF]/90 backdrop-blur-xl"><div className="flex items-center justify-between gap-4 px-4 py-4 md:px-8"><div><p className="text-xs font-black uppercase tracking-[0.24em] text-[#B08A46]">Daily breeder command center</p><h1 className="font-display text-5xl font-black">Dashboard</h1></div><div className="hidden min-w-[330px] items-center gap-2 rounded-full border border-[#DDD6C8] bg-white px-4 py-3 lg:flex"><Search className="h-4 w-4 text-[#7A6A55]" /><input className="w-full bg-transparent text-sm outline-none" placeholder="Search dogs, buyers, puppies, documents..." /></div><div className="flex items-center gap-2"><button className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-[#DDD6C8] bg-white"><Bell className="h-5 w-5 text-[#315842]" /></button><a href="/dashboard/settings" className="rounded-2xl border border-[#DDD6C8] bg-white px-5 py-3 text-sm font-black text-[#315842]">Settings</a></div></div></header>
          <div className="px-4 py-6 md:px-8 space-y-6">
            <section className="rounded-[2.25rem] border border-[#DDD6C8] bg-white p-8"><div className="grid gap-8 xl:grid-cols-[1fr_420px]"><div><div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#DDD6C8] bg-[#F3EFE5] px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#B08A46]"><Gauge className="h-4 w-4" />Open every morning</div><h2 className="font-display text-6xl font-black leading-[1.02]">Your daily control panel for the full breeder lifecycle.</h2><p className="mt-5 max-w-3xl text-lg leading-8 text-[#52616B]">Start with red flags, review what changed, then move through tasks across dogs, breedings, litters, puppies, buyers, payments, and delivery.</p></div><div className="grid gap-3 sm:grid-cols-2">{quickActions.map(([label, href, Icon]) => <a key={label} href={href} className="flex items-center justify-between rounded-2xl border border-[#DDD6C8] bg-[#FBFAF6] px-4 py-4 text-sm font-black text-[#315842]"><span className="flex items-center gap-2"><Icon className="h-4 w-4 text-[#B08A46]" />{label}</span><Plus className="h-4 w-4" /></a>)}</div></div></section>
            <section className="rounded-[2rem] border border-[#DDD6C8] bg-[#F9F8F4] p-5"><div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between"><div><p className="text-xs font-black uppercase tracking-[0.22em] text-[#B08A46]">Operating lifecycle</p><h2 className="font-display mt-1 text-3xl font-black">Dogs → Breedings → Litters → Puppies → Buyers → Payments → Delivery</h2></div><p className="max-w-lg text-sm leading-6 text-[#52616B]">Every module supports the real breeder workflow instead of generic software logic.</p></div><div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-7">{lifecycle.map(([label, href, Icon, detail, value], index) => <a key={label} href={href} className="rounded-3xl border border-[#DDD6C8] bg-white p-4"><div className="mb-4 flex items-center justify-between"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EEF1E8] text-[#315842]"><Icon className="h-5 w-5" /></div><span className="font-display text-3xl font-black text-[#C7A866]">{String(index + 1).padStart(2, "0")}</span></div><p className="font-black">{label}</p><p className="mt-1 text-xs leading-5 text-[#66757A]">{detail}</p><p className="mt-3 text-lg font-black text-[#315842]">{value}</p></a>)}</div></section>
            <section className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">{healthCards.map(([label, value, detail, Icon, tone]) => <div key={label} className="rounded-[1.75rem] border border-[#DDD6C8] bg-white p-5"><div className="flex items-start justify-between"><div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${toneClass(tone)}`}><Icon className="h-5 w-5" /></div>{tone === "red" ? <span className="rounded-full bg-[#FBE7E2] px-3 py-1 text-xs font-black text-[#A03625]">Needs attention</span> : <LineChart className="h-4 w-4 text-[#B08A46]" />}</div><p className="mt-5 text-xs font-black uppercase tracking-[0.18em] text-[#7A6A55]">{label}</p><p className="font-display mt-1 text-4xl font-black">{value}</p><p className="mt-1 text-sm font-bold text-[#52616B]">{detail}</p></div>)}</section>
            <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
              <div className="space-y-6">
                <Card><SectionHeader eyebrow="Tasks & priorities" title="Fix these first" description="Merged live tasks from breeder_tasks + breeding_tasks." />{(live.tasks.length ? live.tasks : [{ title: "No urgent tasks", detail: "Your command center is clear.", tag: "System", priority: "normal" }]).map((task) => <div key={task.title} className="mt-4 rounded-3xl border border-[#DDD6C8] bg-[#FBFAF6] p-4"><p className="font-black">{task.title}</p><p className="mt-1 text-sm text-[#52616B]">{task.detail}</p></div>)}</Card>
                <Card><SectionHeader eyebrow="Live alert engine" title="Program red flags" description="Pulled from breeding_alerts and overdue financial/doc states." />{(live.alerts.length ? live.alerts : [{ title: "No active breeder alerts", detail: "No open operational warnings.", severity: "info" }]).map((alert) => <div key={alert.title} className="mt-4 rounded-3xl border border-[#DDD6C8] bg-[#FBFAF6] p-4"><p className="font-black">{alert.title}</p><p className="mt-1 text-sm text-[#52616B]">{alert.detail}</p></div>)}</Card>
                <Card><SectionHeader eyebrow="Activation" title="Workspace completion" description="Breeder is considered activated when core operational records exist." /><div className="mt-5 rounded-[1.5rem] bg-[#315842] p-4 text-white"><div className="flex items-end justify-between"><div><p className="text-xs font-black uppercase tracking-[0.18em] text-[#D9BC7B]">Progress</p><p className="font-display text-4xl font-black">{completed}/{onboarding.length}</p></div><BadgeCheck className="h-9 w-9 text-[#D9BC7B]" /></div><div className="mt-4 h-3 rounded-full bg-white/15"><div className="h-full rounded-full bg-[#D9BC7B]" style={{ width: `${(completed / onboarding.length) * 100}%` }} /></div></div><div className="mt-4 space-y-2">{onboarding.map(([label, done]) => <div key={label} className="flex items-center gap-3 rounded-2xl border border-[#DDD6C8] bg-white px-4 py-3">{done ? <CheckCircle2 className="h-5 w-5 text-[#315842]" /> : <TimerReset className="h-5 w-5 text-[#B08A46]" />}<span className="text-sm font-black">{label}</span></div>)}</div></Card>
              </div>
              <aside className="space-y-6">
                <Card><div className="flex items-center gap-3"><div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-[#315842] text-white"><Bot className="h-6 w-6" /></div><div><p className="font-display text-2xl font-black">Breeder Buddy AI</p><p className="text-xs font-black uppercase tracking-[0.16em] text-[#7A6A55]">Data-aware assistant</p></div></div><div className="mt-5 rounded-[1.5rem] border border-[#DDD6C8] bg-[#FBFAF6] p-4"><p className="text-sm font-bold leading-7 text-[#52616B]">Ask Breeder Buddy AI who owes balances, which agreements are unsigned, which puppies are due, or what buyer actions need attention.</p></div><button className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#315842] px-4 py-3 text-sm font-black text-white">Open Breeder Buddy AI<WandSparkles className="h-4 w-4" /></button></Card>
                <Card><SectionHeader eyebrow="Calendar" title="Upcoming" description="Merged breeder_events + breeding_calendar_events." />{(live.events.length ? live.events : [{ title: "No upcoming events", date: "Upcoming", tag: "Calendar" }]).map((event) => <div key={event.title} className="mt-4 rounded-3xl border border-[#DDD6C8] bg-[#FBFAF6] p-4"><div className="flex items-center gap-3"><CalendarClock className="h-5 w-5 text-[#B08A46]" /><div><p className="text-xs font-black uppercase tracking-[0.14em] text-[#B08A46]">{event.date} · {event.tag}</p><p className="text-sm font-black">{event.title}</p></div></div></div>)}</Card>
              </aside>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function Card({ children }: { children: ReactNode }) { return <div className="rounded-[2rem] border border-[#DDD6C8] bg-white p-5">{children}</div>; }
function SectionHeader({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) { return <div><p className="text-xs font-black uppercase tracking-[0.2em] text-[#B08A46]">{eyebrow}</p><h2 className="font-display mt-1 text-3xl font-black">{title}</h2><p className="mt-2 text-sm text-[#52616B]">{description}</p></div>; }
function toneClass(tone: string) { if (tone === "red") return "bg-[#FBE7E2] text-[#A03625]"; if (tone === "gold") return "bg-[#F6F1E2] text-[#B08A46]"; if (tone === "blue") return "bg-[#E8EEE8] text-[#315842]"; return "bg-[#E8EEE8] text-[#315842]"; }
