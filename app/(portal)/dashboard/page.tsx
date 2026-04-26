import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  ArrowRight,
  Baby,
  BadgeCheck,
  Bell,
  Bot,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  ClipboardSignature,
  CreditCard,
  Dog,
  FileCheck2,
  FileText,
  Gauge,
  Globe2,
  HeartPulse,
  LineChart,
  MessageSquareText,
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

const lifecycle = [
  { label: "Dogs", href: "/dashboard/dogs", icon: Dog, detail: "Foundation records", value: "18" },
  { label: "Breedings", href: "/dashboard/breeding-program", icon: HeartPulse, detail: "Plans + pregnancies", value: "3" },
  { label: "Litters", href: "/dashboard/litters", icon: Baby, detail: "Whelping pipeline", value: "2" },
  { label: "Puppies", href: "/dashboard/puppies", icon: PawPrint, detail: "Live inventory", value: "6" },
  { label: "Buyers", href: "/dashboard/buyers", icon: Users, detail: "CRM + notes", value: "14" },
  { label: "Payments", href: "/dashboard/payments", icon: CreditCard, detail: "Balances + due dates", value: "$8.4k" },
  { label: "Delivery", href: "/dashboard/transportation", icon: Truck, detail: "Pickup + transport", value: "2" },
];

const navItems = [
  { label: "Command Center", href: "/dashboard", icon: Gauge, active: true },
  { label: "Dogs", href: "/dashboard/dogs", icon: Dog },
  { label: "Breeding Program", href: "/dashboard/breeding-program", icon: HeartPulse },
  { label: "Litters", href: "/dashboard/litters", icon: Baby },
  { label: "Puppies", href: "/dashboard/puppies", icon: PawPrint },
  { label: "Applications", href: "/dashboard/applications", icon: ClipboardCheck },
  { label: "Buyers", href: "/dashboard/buyers", icon: Users },
  { label: "Payments", href: "/dashboard/payments", icon: CreditCard },
  { label: "Documents", href: "/dashboard/documents", icon: FileText },
  { label: "Transportation", href: "/dashboard/transportation", icon: Route },
  { label: "Automation", href: "/dashboard/automation", icon: Send },
  { label: "Website", href: "/dashboard/website", icon: Globe2 },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

const healthCards = [
  { label: "Active breedings", value: "3", detail: "1 confirmed pregnancy · 2 planned pairings", icon: HeartPulse, tone: "green" },
  { label: "Puppies available", value: "6 / 11", detail: "5 reserved · 2 ready soon", icon: PawPrint, tone: "gold" },
  { label: "Buyer balances", value: "$8,420", detail: "2 due this week · 1 overdue", icon: CreditCard, tone: "red" },
  { label: "Missing documents", value: "5", detail: "2 deposits · 3 health guarantees", icon: ClipboardSignature, tone: "blue" },
];

const priorities = [
  { title: "Overdue buyer payment", detail: "Megan H. has a balance payment due from yesterday.", tag: "Payments", severity: "High", icon: AlertTriangle },
  { title: "Unsigned deposit agreements", detail: "Three reservations need signed deposit agreements before placement is locked.", tag: "Documents", severity: "High", icon: FileCheck2 },
  { title: "Pregnancy follow-up", detail: "Schedule ultrasound follow-up for Bella x Finn pairing.", tag: "Breeding", severity: "Normal", icon: HeartPulse },
  { title: "Saturday transport confirmation", detail: "Confirm meeting point, fee, and pickup window for two buyers.", tag: "Delivery", severity: "Normal", icon: Truck },
];

const feed = [
  { title: "Payment recorded", detail: "$500 deposit logged for Ruby reservation.", time: "12 min ago", icon: CreditCard },
  { title: "Document signed", detail: "Health Guarantee completed by Emily R.", time: "41 min ago", icon: FileCheck2 },
  { title: "Puppy reserved", detail: "Blue collar male moved from Available to Reserved.", time: "2 hr ago", icon: PawPrint },
  { title: "Buyer note added", detail: "Preference notes saved for a small female puppy.", time: "Yesterday", icon: MessageSquareText },
];

const quickActions = [
  { label: "Add Dog", href: "/dashboard/dogs/new", icon: Dog },
  { label: "Start Breeding Plan", href: "/dashboard/breeding-program/new", icon: HeartPulse },
  { label: "Create Litter", href: "/dashboard/litters/new", icon: Baby },
  { label: "Add Puppy", href: "/dashboard/puppies/new", icon: PawPrint },
  { label: "Add Buyer", href: "/dashboard/buyers/new", icon: Users },
  { label: "Log Payment", href: "/dashboard/payments/new", icon: CreditCard },
  { label: "Generate Contract", href: "/dashboard/documents/new", icon: FileText },
  { label: "Schedule Pickup", href: "/dashboard/transportation/new", icon: Route },
];

const modules = [
  { title: "Dogs", table: "breeding_dogs", text: "Identity, registry, lineage, photos, health, genetic eligibility, and breeding pool readiness.", href: "/dashboard/dogs", icon: Dog },
  { title: "Breeding Program", table: "breeding_pairings · breeding_pregnancies", text: "Sire and dam pairings, planned dates, pregnancy tracking, projected litter size, and breeder goals.", href: "/dashboard/breeding-program", icon: HeartPulse },
  { title: "Litters", table: "litters · breeding_whelping_events", text: "Birth records, expected size, whelp notes, complications, reservation goals, and linked puppies.", href: "/dashboard/litters", icon: Baby },
  { title: "Puppies", table: "puppies", text: "Live puppy inventory with status, buyer assignment, pricing, deposit, balance, photos, and portal visibility.", href: "/dashboard/puppies", icon: PawPrint },
  { title: "Buyers + Applications", table: "buyers · buyer_applications · applications", text: "CRM, applications, contact info, buyer notes, approvals, source tracking, and puppy assignment.", href: "/dashboard/buyers", icon: Users },
  { title: "Payments", table: "buyer_payment_accounts · buyer_payments · payment_plans", text: "Deposits, balances, payment plans, due dates, late flags, and recorded payment history.", href: "/dashboard/payments", icon: CreditCard },
  { title: "Documents", table: "buyer_documents · contracts · documents", text: "Deposit agreements, health guarantees, bills of sale, uploaded files, generated documents, and signed status.", href: "/dashboard/documents", icon: FileText },
  { title: "Transportation", table: "transportation · buyer_transportation_requests", text: "Pickup or delivery requests, date, location, mileage, fee, notes, and delivery status.", href: "/dashboard/transportation", icon: Truck },
];

const onboarding = [
  { label: "Add at least 1 dog", done: true },
  { label: "Create 1 breeding", done: true },
  { label: "Add 1 puppy", done: true },
  { label: "Add 1 buyer", done: false },
  { label: "Log 1 payment", done: false },
];

const automations = [
  { title: "Payment due reminder", detail: "Send 3 days before balance due date.", status: "Ready" },
  { title: "Overdue notice", detail: "Follow up automatically when payments are late.", status: "Draft" },
  { title: "Pickup reminder", detail: "Send delivery details before go-home day.", status: "Ready" },
];

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#F6F2EA] text-[#162333]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700;9..144,800&family=DM+Sans:wght@400;500;600;700;800;900&display=swap');
        body { font-family: 'DM Sans', sans-serif; background: #F6F2EA; }
        .font-display { font-family: 'Fraunces', serif; }
      `}</style>

      <div className="flex min-h-screen">
        <aside className="hidden w-[300px] shrink-0 border-r border-[#E3D6C1] bg-[#FBF8F1]/95 px-5 py-5 shadow-[12px_0_40px_rgba(47,79,62,0.05)] backdrop-blur-xl xl:block">
          <a href="/dashboard" className="flex items-center gap-3 rounded-[1.75rem] border border-[#E3D6C1] bg-white p-3 shadow-sm">
            <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2F4F3E] text-white shadow-lg shadow-[#2F4F3E]/15">
              <PawPrint className="h-6 w-6" />
              <span className="absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-[#C6A96B]" />
            </div>
            <div>
              <p className="font-display text-xl font-black leading-tight tracking-tight">MyDogPortal</p>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#7A6A55]">Command Center</p>
            </div>
          </a>

          <div className="mt-5 overflow-hidden rounded-[1.75rem] border border-[#D8C8AC] bg-[#EFE6D7] p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-[#2F4F3E] shadow-sm">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-black text-[#162333]">Morning command check</p>
                <p className="mt-1 text-xs leading-5 text-[#5B6B73]">Fix red flags first, then move through today’s tasks.</p>
              </div>
            </div>
          </div>

          <nav className="mt-5 space-y-1.5">
            {navItems.map((item) => (
              <a key={item.label} href={item.href} className={`group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-black transition ${item.active ? "bg-[#2F4F3E] text-white shadow-lg shadow-[#2F4F3E]/15" : "text-[#52616B] hover:bg-white hover:text-[#2F4F3E] hover:shadow-sm"}`}>
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </a>
            ))}
          </nav>
        </aside>

        <section className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-[#E3D6C1] bg-[#F6F2EA]/88 backdrop-blur-2xl">
            <div className="flex items-center justify-between gap-4 px-4 py-4 md:px-8">
              <div className="flex min-w-0 items-center gap-3">
                <a href="/dashboard" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#2F4F3E] text-white xl:hidden"><PawPrint className="h-5 w-5" /></a>
                <div className="min-w-0">
                  <p className="truncate text-xs font-black uppercase tracking-[0.24em] text-[#A07A35]">Daily breeder command center</p>
                  <h1 className="font-display truncate text-3xl font-black tracking-tight md:text-5xl">Dashboard</h1>
                </div>
              </div>

              <div className="hidden min-w-[330px] items-center gap-2 rounded-full border border-[#D8C8AC] bg-white px-4 py-3 shadow-sm lg:flex">
                <Search className="h-4 w-4 text-[#7A6A55]" />
                <input className="w-full bg-transparent text-sm text-[#162333] outline-none placeholder:text-[#9A8F80]" placeholder="Search dogs, buyers, puppies, documents..." />
              </div>

              <div className="flex items-center gap-2">
                <button className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-[#D8C8AC] bg-white text-[#2F4F3E] shadow-sm transition hover:bg-[#EFE6D7]" aria-label="Notifications">
                  <Bell className="h-5 w-5" />
                  <span className="absolute right-2.5 top-2.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#C24B3A]" />
                </button>
                <a href="/dashboard/settings" className="hidden rounded-2xl border border-[#D8C8AC] bg-white px-5 py-3 text-sm font-black text-[#2F4F3E] shadow-sm transition hover:bg-[#EFE6D7] sm:inline-flex">Settings</a>
              </div>
            </div>
          </header>

          <div className="flex-1 px-4 py-6 md:px-8">
            <section className="grid gap-6 2xl:grid-cols-[minmax(0,1fr)_390px]">
              <div className="space-y-6">
                <HeroCommand />
                <LifecycleMap />
                <ProgramHealth />
                <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]"><TasksPanel /><OperationalFeed /></div>
                <ModuleGrid />
              </div>
              <aside className="space-y-6"><ChichiPanel /><AutomationPanel /><ActivationPanel /><CalendarPanel /></aside>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}

function HeroCommand() {
  return (
    <section className="relative overflow-hidden rounded-[2.25rem] border border-[#E3D6C1] bg-white p-6 shadow-xl shadow-[#2F4F3E]/8 md:p-8">
      <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#C6A96B]/18 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-7rem] left-[24%] h-72 w-72 rounded-full bg-[#2F4F3E]/10 blur-3xl" />
      <div className="relative grid gap-8 xl:grid-cols-[1fr_420px] xl:items-end">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#D8C8AC] bg-[#F7F1E6] px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#A07A35]"><Gauge className="h-4 w-4" />Open every morning</div>
          <h2 className="font-display max-w-4xl text-5xl font-black leading-[1.03] tracking-tight md:text-7xl">Your daily control panel for the full breeder lifecycle.</h2>
          <p className="mt-5 max-w-3xl text-base leading-8 text-[#52616B] md:text-lg">Start with red flags, review what changed, then move through tasks across dogs, breedings, litters, puppies, buyers, payments, and delivery.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {quickActions.map((action) => (
            <a key={action.label} href={action.href} className="group flex items-center justify-between rounded-2xl border border-[#D8C8AC] bg-[#FBF8F1] px-4 py-4 text-sm font-black text-[#2F4F3E] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#EFE6D7] hover:shadow-md">
              <span className="flex items-center gap-2"><action.icon className="h-4 w-4 text-[#A07A35]" />{action.label}</span>
              <Plus className="h-4 w-4 transition group-hover:rotate-90" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function LifecycleMap() {
  return (
    <section className="rounded-[2rem] border border-[#E3D6C1] bg-[#162333] p-5 text-white shadow-xl shadow-[#162333]/10">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div><p className="text-xs font-black uppercase tracking-[0.22em] text-[#D7B46A]">Operating lifecycle</p><h2 className="font-display mt-1 text-3xl font-black">Dogs → Breedings → Litters → Puppies → Buyers → Payments → Delivery</h2></div>
        <p className="max-w-lg text-sm leading-6 text-white/68">Every module supports the real breeder workflow instead of generic software logic.</p>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-7">
        {lifecycle.map((step, index) => (
          <a key={step.label} href={step.href} className="group rounded-3xl border border-white/10 bg-white/[0.06] p-4 transition hover:-translate-y-1 hover:bg-white/[0.1]">
            <div className="mb-4 flex items-center justify-between"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#2F4F3E]"><step.icon className="h-5 w-5" /></div><span className="font-display text-3xl font-black text-[#D7B46A]">{String(index + 1).padStart(2, "0")}</span></div>
            <p className="font-black">{step.label}</p><p className="mt-1 text-xs leading-5 text-white/58">{step.detail}</p><p className="mt-3 text-lg font-black text-[#D7B46A]">{step.value}</p>
          </a>
        ))}
      </div>
    </section>
  );
}

function ProgramHealth() {
  return <section className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">{healthCards.map((card) => <div key={card.label} className="overflow-hidden rounded-[1.75rem] border border-[#E3D6C1] bg-white p-5 shadow-lg shadow-[#2F4F3E]/5"><div className="flex items-start justify-between gap-3"><div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${toneClass(card.tone)}`}><card.icon className="h-5 w-5" /></div>{card.tone === "red" ? <span className="rounded-full bg-[#FBE7E2] px-3 py-1 text-xs font-black text-[#A03625]">Needs attention</span> : <LineChart className="h-4 w-4 text-[#A07A35]" />}</div><p className="mt-5 text-xs font-black uppercase tracking-[0.18em] text-[#7A6A55]">{card.label}</p><p className="font-display mt-1 text-4xl font-black">{card.value}</p><p className="mt-1 text-sm font-bold leading-6 text-[#52616B]">{card.detail}</p></div>)}</section>;
}

function TasksPanel() {
  return <Card><SectionHeader eyebrow="Tasks & priorities" title="Fix these first" description="Overdue payments, missing documents, delivery work, and breeding follow-ups." /><div className="mt-5 space-y-3">{priorities.map((task) => <div key={task.title} className="rounded-3xl border border-[#E3D6C1] bg-[#FBF8F1] p-4 transition hover:bg-[#F7F1E6]"><div className="flex items-start gap-3"><div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${task.severity === "High" ? "bg-[#FBE7E2] text-[#A03625]" : "bg-[#E9F0E7] text-[#2F4F3E]"}`}><task.icon className="h-5 w-5" /></div><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-3"><p className="font-black text-[#162333]">{task.title}</p><span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-black uppercase tracking-[0.12em] text-[#A07A35]">{task.tag}</span></div><p className="mt-1 text-sm leading-6 text-[#52616B]">{task.detail}</p></div></div></div>)}</div></Card>;
}

function OperationalFeed() {
  return <Card><SectionHeader eyebrow="Operational feed" title="What just happened" description="Payments, documents, reservations, notes, and buyer movement." /><div className="mt-5 space-y-4">{feed.map((item, index) => <div key={item.title} className="flex gap-4"><div className="flex flex-col items-center"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#162333] text-white"><item.icon className="h-5 w-5" /></div>{index < feed.length - 1 ? <div className="mt-2 h-full min-h-8 w-px bg-[#E3D6C1]" /> : null}</div><div className="min-w-0 flex-1 rounded-3xl border border-[#E3D6C1] bg-[#FBF8F1] p-4"><div className="flex items-start justify-between gap-3"><p className="font-black text-[#162333]">{item.title}</p><span className="shrink-0 text-xs font-bold text-[#9A8F80]">{item.time}</span></div><p className="mt-1 text-sm leading-6 text-[#52616B]">{item.detail}</p></div></div>)}</div></Card>;
}

function ModuleGrid() {
  return <Card><SectionHeader eyebrow="System modules" title="Built from your real tables" description="Each workspace maps to actual database tables, not placeholder product cards." /><div className="mt-5 grid gap-4 lg:grid-cols-2">{modules.map((module) => <a key={module.title} href={module.href} className="group rounded-[1.75rem] border border-[#E3D6C1] bg-[#FBF8F1] p-5 transition hover:-translate-y-1 hover:bg-white hover:shadow-lg hover:shadow-[#2F4F3E]/8"><div className="flex items-start gap-4"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#E9F0E7] text-[#2F4F3E]"><module.icon className="h-6 w-6" /></div><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-3"><h3 className="font-display text-2xl font-black text-[#162333]">{module.title}</h3><ChevronRight className="mt-1 h-5 w-5 shrink-0 text-[#A07A35] transition group-hover:translate-x-1" /></div><p className="mt-1 text-[11px] font-black uppercase tracking-[0.16em] text-[#A07A35]">{module.table}</p><p className="mt-3 text-sm leading-6 text-[#52616B]">{module.text}</p></div></div></a>)}</div></Card>;
}

function ChichiPanel() {
  return <Card><div className="flex items-center gap-3"><div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2F4F3E] text-white"><Bot className="h-6 w-6" /><span className="absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-[#C6A96B]" /></div><div><p className="font-display text-2xl font-black">Chichi AI</p><p className="text-xs font-black uppercase tracking-[0.16em] text-[#7A6A55]">Data-aware assistant</p></div></div><div className="mt-5 rounded-[1.5rem] border border-[#E3D6C1] bg-[#FBF8F1] p-4"><p className="text-sm font-bold leading-7 text-[#52616B]">Ask Chichi: “Who is overdue?”, “How much does this buyer owe?”, or “Create a health guarantee for this puppy.”</p></div><button className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#2F4F3E] px-4 py-3 text-sm font-black text-white transition hover:bg-[#253F32]">Open Chichi<WandSparkles className="h-4 w-4" /></button></Card>;
}

function AutomationPanel() {
  return <Card><SectionHeader eyebrow="Automation" title="Follow-up engine" description="Professional reminders without manual chasing." /><div className="mt-5 space-y-3">{automations.map((item) => <div key={item.title} className="rounded-3xl border border-[#E3D6C1] bg-[#FBF8F1] p-4"><div className="flex items-start justify-between gap-3"><div><p className="font-black text-[#162333]">{item.title}</p><p className="mt-1 text-sm leading-6 text-[#52616B]">{item.detail}</p></div><span className={`rounded-full px-3 py-1 text-xs font-black ${item.status === "Ready" ? "bg-[#E9F0E7] text-[#2F4F3E]" : "bg-[#F7F1E6] text-[#A07A35]"}`}>{item.status}</span></div></div>)}</div></Card>;
}

function ActivationPanel() {
  const completed = onboarding.filter((item) => item.done).length;
  return <Card><SectionHeader eyebrow="Onboarding" title="Activation goal" description="A breeder is activated when these core records exist." /><div className="mt-5 rounded-[1.5rem] border border-[#E3D6C1] bg-[#162333] p-4 text-white"><div className="flex items-end justify-between"><div><p className="text-xs font-black uppercase tracking-[0.18em] text-[#D7B46A]">Progress</p><p className="font-display text-4xl font-black">{completed}/{onboarding.length}</p></div><BadgeCheck className="h-9 w-9 text-[#D7B46A]" /></div><div className="mt-4 h-3 overflow-hidden rounded-full bg-white/12"><div className="h-full rounded-full bg-[#D7B46A]" style={{ width: `${(completed / onboarding.length) * 100}%` }} /></div></div><div className="mt-4 space-y-2">{onboarding.map((item) => <div key={item.label} className="flex items-center gap-3 rounded-2xl border border-[#E3D6C1] bg-[#FBF8F1] px-4 py-3">{item.done ? <CheckCircle2 className="h-5 w-5 text-[#2F4F3E]" /> : <TimerReset className="h-5 w-5 text-[#A07A35]" />}<span className="text-sm font-black text-[#162333]">{item.label}</span></div>)}</div></Card>;
}

function CalendarPanel() {
  return <Card><SectionHeader eyebrow="Calendar" title="Upcoming" description="Breeding, puppy, buyer, and delivery events." /><div className="mt-5 space-y-3">{[["Today", "Buyer application review", "Applications"], ["Tomorrow", "Puppy weight check", "Puppies"], ["Saturday", "Transport confirmation", "Delivery"]].map(([time, title, tag]) => <div key={title} className="rounded-3xl border border-[#E3D6C1] bg-[#FBF8F1] p-4"><div className="flex items-center gap-3"><CalendarClock className="h-5 w-5 text-[#A07A35]" /><div><p className="text-xs font-black uppercase tracking-[0.14em] text-[#A07A35]">{time} · {tag}</p><p className="text-sm font-black text-[#162333]">{title}</p></div></div></div>)}</div></Card>;
}

function Card({ children }: { children: ReactNode }) {
  return <div className="rounded-[2rem] border border-[#E3D6C1] bg-white p-5 shadow-lg shadow-[#2F4F3E]/5">{children}</div>;
}

function SectionHeader({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <div><p className="text-xs font-black uppercase tracking-[0.2em] text-[#A07A35]">{eyebrow}</p><h2 className="font-display mt-1 text-3xl font-black text-[#162333]">{title}</h2><p className="mt-2 text-sm leading-6 text-[#52616B]">{description}</p></div>;
}

function toneClass(tone: string) {
  if (tone === "red") return "bg-[#FBE7E2] text-[#A03625]";
  if (tone === "gold") return "bg-[#F7F1E6] text-[#A07A35]";
  if (tone === "blue") return "bg-[#E9EEF6] text-[#334F7D]";
  return "bg-[#E9F0E7] text-[#2F4F3E]";
}
