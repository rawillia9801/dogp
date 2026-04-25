"use client";

import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  ArrowRight,
  Baby,
  BadgeCheck,
  Bell,
  Bot,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardSignature,
  CreditCard,
  Dog,
  FileText,
  Gauge,
  Globe2,
  HeartPulse,
  Home,
  LayoutDashboard,
  LogOut,
  MessageCircle,
  PawPrint,
  Route,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";

const assistantName = "BreederBuddy AI";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, active: true },
  { label: "Dogs", href: "/dashboard/dogs", icon: Dog },
  { label: "Breeding Program", href: "/dashboard/breeding-program", icon: HeartPulse },
  { label: "Litters", href: "/dashboard/litters", icon: Baby },
  { label: "Puppies", href: "/dashboard/puppies", icon: PawPrint },
  { label: "Buyers", href: "/dashboard/buyers", icon: Users },
  { label: "Payments", href: "/dashboard/payments", icon: CreditCard },
  { label: "Documents", href: "/dashboard/documents", icon: FileText },
  { label: "Transportation", href: "/dashboard/transportation", icon: Route },
  { label: "Website", href: "/dashboard/website", icon: Globe2 },
  { label: "Settings", href: "/settings", icon: Settings },
];

const metrics = [
  {
    label: "Available Puppies",
    value: "6",
    detail: "+2 this week",
    icon: PawPrint,
    tone: "good",
  },
  {
    label: "Active Buyers",
    value: "14",
    detail: "3 awaiting documents",
    icon: Users,
    tone: "info",
  },
  {
    label: "Open Balances",
    value: "$8,420",
    detail: "2 payments due soon",
    icon: CreditCard,
    tone: "warn",
  },
  {
    label: "Docs Pending",
    value: "5",
    detail: "2 unsigned agreements",
    icon: ClipboardSignature,
    tone: "danger",
  },
];

const programModules = [
  {
    title: "Dogs",
    subtitle: "Roster, dams, sires, lineage, health, genetics",
    value: "18 records",
    icon: Dog,
    href: "/dashboard/dogs",
    status: "Healthy",
  },
  {
    title: "Breeding Program",
    subtitle: "Pairing planner, breeding review, timeline",
    value: "3 active plans",
    icon: HeartPulse,
    href: "/dashboard/breeding-program",
    status: "Review",
  },
  {
    title: "Litters",
    subtitle: "Expected litters, whelping notes, puppies",
    value: "2 current",
    icon: Baby,
    href: "/dashboard/litters",
    status: "Active",
  },
  {
    title: "Puppies",
    subtitle: "Availability, buyer links, readiness gates",
    value: "9 tracked",
    icon: PawPrint,
    href: "/dashboard/puppies",
    status: "Live",
  },
  {
    title: "Buyers",
    subtitle: "Applications, assignments, activity timeline",
    value: "14 active",
    icon: Users,
    href: "/dashboard/buyers",
    status: "Needs attention",
  },
  {
    title: "Payments",
    subtitle: "Ledger, balances, due dates, plans",
    value: "$8,420 open",
    icon: CreditCard,
    href: "/dashboard/payments",
    status: "Due soon",
  },
];

const tasks = [
  {
    title: "Send deposit agreement reminders",
    detail: "3 buyers still need to sign before reservation is complete.",
    area: "Documents",
    urgency: "High",
    icon: ClipboardSignature,
  },
  {
    title: "Review payment due tomorrow",
    detail: "Megan H. has an installment due for Willow.",
    area: "Payments",
    urgency: "Medium",
    icon: CreditCard,
  },
  {
    title: "Add week-six puppy updates",
    detail: "Bella’s litter is ready for photos and weight notes.",
    area: "Puppies",
    urgency: "Today",
    icon: PawPrint,
  },
  {
    title: "Confirm transport window",
    detail: "Pickup/meeting details need confirmation for Saturday.",
    area: "Transport",
    urgency: "Today",
    icon: Route,
  },
];

const events = [
  {
    time: "9:00 AM",
    title: "Buyer application review",
    description: "Two new applications need approval or follow-up.",
  },
  {
    time: "12:30 PM",
    title: "Puppy weight check",
    description: "Week-six litter weights and photo notes.",
  },
  {
    time: "4:00 PM",
    title: "Transport confirmation",
    description: "Confirm mileage, fee, and meeting location.",
  },
];

const dueSoon = [
  { label: "Health Guarantee", owner: "Ruby / Sarah M.", date: "Today", type: "Document" },
  { label: "$425 installment", owner: "Willow / Megan H.", date: "Tomorrow", type: "Payment" },
  { label: "Go-home checklist", owner: "Theo / Pending Buyer", date: "Friday", type: "Puppy" },
  { label: "Delivery request", owner: "Nashville route", date: "Saturday", type: "Transport" },
];

const activity = [
  {
    title: "New application received",
    detail: "Emily R. submitted a Cavalier puppy application.",
    time: "12 min ago",
    icon: Users,
  },
  {
    title: "Payment logged",
    detail: "$500 deposit recorded for Ruby.",
    time: "1 hr ago",
    icon: CreditCard,
  },
  {
    title: "Document package created",
    detail: "Deposit Agreement + Health Guarantee ready for review.",
    time: "3 hrs ago",
    icon: FileText,
  },
];

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#0F1713] text-[#ECF3EE]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700;9..144,800&family=DM+Sans:wght@400;500;600;700;800;900&display=swap');

        * { box-sizing: border-box; }

        body {
          font-family: "DM Sans", sans-serif;
          background: #0F1713;
        }

        .font-display {
          font-family: "Fraunces", serif;
        }

        .lux-card {
          background:
            linear-gradient(145deg, rgba(255,255,255,0.095), rgba(255,255,255,0.035)),
            rgba(20, 31, 26, 0.94);
          border: 1px solid rgba(226, 214, 189, 0.14);
          box-shadow: 0 24px 80px rgba(0, 0, 0, 0.24);
        }

        .soft-card {
          background:
            linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.025)),
            rgba(18, 27, 23, 0.92);
          border: 1px solid rgba(226, 214, 189, 0.12);
        }

        .gold-line {
          background: linear-gradient(90deg, transparent, rgba(207, 177, 111, 0.55), transparent);
        }
      `}</style>

      <div className="flex min-h-screen">
        <aside className="hidden w-72 shrink-0 border-r border-white/10 bg-[#101A15]/95 px-5 py-5 xl:block">
          <a href="/" className="flex items-center gap-3 rounded-3xl border border-white/10 bg-white/[0.04] p-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D1B46F] text-[#102016] shadow-lg shadow-[#D1B46F]/20">
              <PawPrint className="h-6 w-6" />
            </div>
            <div>
              <p className="font-display text-xl font-black leading-tight">MyDogPortal</p>
              <p className="text-xs font-bold text-[#AEBBB3]">Breeder Operations OS</p>
            </div>
          </a>

          <div className="mt-6 rounded-3xl border border-[#D1B46F]/20 bg-[#D1B46F]/10 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#D1B46F] text-[#102016]">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-black text-white">Stage 2 Dashboard</p>
                <p className="mt-1 text-xs leading-5 text-[#D9E3DC]/70">
                  Compact breeder operations view. Keep docs and website-builder work separate until their stages.
                </p>
              </div>
            </div>
          </div>

          <nav className="mt-6 space-y-1.5">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-black transition ${
                  item.active
                    ? "bg-[#D1B46F] text-[#102016] shadow-lg shadow-[#D1B46F]/15"
                    : "text-[#B9C6BE] hover:bg-white/[0.055] hover:text-white"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </a>
            ))}
          </nav>

          <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.035] p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#244333] text-[#D1B46F]">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-black">{assistantName}</p>
                <p className="text-xs text-[#AEBBB3]">Assistant shell</p>
              </div>
            </div>
            <p className="mt-3 text-xs leading-5 text-[#AEBBB3]">
              AI wiring stays scaffolded here. Deeper automation comes after the core portal is stable.
            </p>
          </div>
        </aside>

        <section className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0F1713]/88 backdrop-blur-2xl">
            <div className="flex items-center justify-between gap-4 px-4 py-4 md:px-8">
              <div className="flex min-w-0 items-center gap-3">
                <a href="/" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#D1B46F] text-[#102016] xl:hidden">
                  <PawPrint className="h-5 w-5" />
                </a>
                <div className="min-w-0">
                  <p className="truncate text-xs font-black uppercase tracking-[0.2em] text-[#D1B46F]">
                    app.mydogportal.site/dashboard
                  </p>
                  <h1 className="font-display truncate text-2xl font-black tracking-tight md:text-3xl">
                    Breeder Dashboard
                  </h1>
                </div>
              </div>

              <div className="hidden min-w-[260px] items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.045] px-3 py-2 lg:flex">
                <Search className="h-4 w-4 text-[#AEBBB3]" />
                <input
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-[#AEBBB3]/70"
                  placeholder="Search buyers, puppies, documents..."
                />
              </div>

              <div className="flex items-center gap-2">
                <a
                  href="/dashboard/notifications"
                  className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.045] text-[#D9E3DC] transition hover:bg-white/[0.075]"
                  aria-label="Notifications"
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute right-2.5 top-2.5 h-2.5 w-2.5 rounded-full border-2 border-[#0F1713] bg-[#D1B46F]" />
                </a>
                <a
                  href="/settings"
                  className="hidden rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3 text-sm font-black text-[#D9E3DC] transition hover:bg-white/[0.075] sm:inline-flex"
                >
                  Settings
                </a>
                <a
                  href="/login"
                  className="hidden items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-black text-[#102016] transition hover:bg-[#F1E9D6] sm:inline-flex"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </a>
              </div>
            </div>
          </header>

          <div className="flex-1 px-4 py-6 md:px-8">
            <section className="grid gap-5 xl:grid-cols-[1fr_360px]">
              <div className="space-y-5">
                <div className="lux-card overflow-hidden rounded-[2rem] p-6 md:p-7">
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#D1B46F]/25 bg-[#D1B46F]/10 px-3 py-1.5 text-xs font-black uppercase tracking-[0.16em] text-[#D1B46F]">
                        <Gauge className="h-4 w-4" />
                        Active Program Overview
                      </div>
                      <h2 className="font-display text-3xl font-black leading-tight md:text-5xl">
                        Good morning, Sarah.
                      </h2>
                      <p className="mt-3 max-w-2xl text-sm leading-6 text-[#B9C6BE] md:text-base">
                        Here is the compact operating view for today: puppies, buyers, payments, documents,
                        upcoming work, and the breeder program areas that need attention.
                      </p>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-2 lg:w-[360px]">
                      <QuickAction href="/dashboard/puppies/new" label="Add Puppy" icon={PawPrint} />
                      <QuickAction href="/dashboard/buyers/new" label="Add Buyer" icon={Users} />
                      <QuickAction href="/dashboard/documents/new" label="Create Docs" icon={FileText} />
                      <QuickAction href="/dashboard/transportation/new" label="Plan Transport" icon={Route} />
                    </div>
                  </div>

                  <div className="gold-line my-7 h-px" />

                  <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-4">
                    {metrics.map((metric) => (
                      <MetricCard key={metric.label} {...metric} />
                    ))}
                  </div>
                </div>

                <div className="grid gap-5 2xl:grid-cols-[1fr_0.8fr]">
                  <div className="lux-card rounded-[2rem] p-5">
                    <SectionHeader
                      eyebrow="Core Operations"
                      title="Program modules"
                      description="Compact entry points for Stage 2 breeder operations."
                    />

                    <div className="mt-5 grid gap-3 md:grid-cols-2">
                      {programModules.map((module) => (
                        <a
                          key={module.title}
                          href={module.href}
                          className="group rounded-3xl border border-white/10 bg-white/[0.035] p-4 transition hover:-translate-y-0.5 hover:border-[#D1B46F]/35 hover:bg-white/[0.06]"
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#20382C] text-[#D1B46F]">
                              <module.icon className="h-5 w-5" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-3">
                                <p className="font-display text-lg font-black text-white">{module.title}</p>
                                <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-[#D1B46F] transition group-hover:translate-x-0.5" />
                              </div>
                              <p className="mt-1 text-xs leading-5 text-[#AEBBB3]">{module.subtitle}</p>
                              <div className="mt-4 flex items-center justify-between gap-3">
                                <span className="text-sm font-black text-white">{module.value}</span>
                                <span className="rounded-full border border-[#D1B46F]/25 bg-[#D1B46F]/10 px-2.5 py-1 text-[11px] font-black text-[#D1B46F]">
                                  {module.status}
                                </span>
                              </div>
                            </div>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>

                  <div className="lux-card rounded-[2rem] p-5">
                    <SectionHeader
                      eyebrow="Tasks"
                      title="Today’s work"
                      description="Action list without repeating giant cards."
                    />

                    <div className="mt-5 space-y-3">
                      {tasks.map((task) => (
                        <TaskRow key={task.title} {...task} />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid gap-5 lg:grid-cols-2">
                  <div className="lux-card rounded-[2rem] p-5">
                    <SectionHeader
                      eyebrow="Timeline"
                      title="Events"
                      description="Program events and daily work windows."
                    />

                    <div className="mt-5 space-y-3">
                      {events.map((event) => (
                        <div key={event.title} className="rounded-3xl border border-white/10 bg-white/[0.035] p-4">
                          <div className="flex items-start gap-4">
                            <div className="rounded-2xl bg-[#D1B46F]/12 px-3 py-2 text-xs font-black text-[#D1B46F]">
                              {event.time}
                            </div>
                            <div>
                              <p className="font-black text-white">{event.title}</p>
                              <p className="mt-1 text-sm leading-5 text-[#AEBBB3]">{event.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="lux-card rounded-[2rem] p-5">
                    <SectionHeader
                      eyebrow="Activity"
                      title="Recent movement"
                      description="Buyer, payment, document, and puppy updates."
                    />

                    <div className="mt-5 space-y-3">
                      {activity.map((item) => (
                        <div key={item.title} className="flex gap-3 rounded-3xl border border-white/10 bg-white/[0.035] p-4">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#20382C] text-[#D1B46F]">
                            <item.icon className="h-5 w-5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-3">
                              <p className="font-black text-white">{item.title}</p>
                              <span className="shrink-0 text-xs text-[#AEBBB3]">{item.time}</span>
                            </div>
                            <p className="mt-1 text-sm leading-5 text-[#AEBBB3]">{item.detail}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <aside className="space-y-5">
                <div className="lux-card rounded-[2rem] p-5">
                  <div className="flex items-center gap-3">
                    <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D1B46F] text-[#102016]">
                      <Bot className="h-6 w-6" />
                      <span className="absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full border-2 border-[#17231D] bg-[#39C46A]" />
                    </div>
                    <div>
                      <p className="font-display text-lg font-black">{assistantName}</p>
                      <p className="text-xs font-bold text-[#AEBBB3]">Dog Breeder Assistant AI</p>
                    </div>
                  </div>

                  <div className="mt-5 rounded-3xl border border-white/10 bg-white/[0.045] p-4">
                    <p className="text-sm leading-6 text-[#D9E3DC]">
                      Two buyers have unsigned deposit agreements, one transport request needs confirmation,
                      and one payment is due tomorrow.
                    </p>
                  </div>

                  <div className="mt-4 grid gap-2">
                    <button className="flex items-center justify-center gap-2 rounded-2xl bg-[#D1B46F] px-4 py-3 text-sm font-black text-[#102016] transition hover:bg-[#E5C67A]">
                      Prepare reminders
                      <ArrowRight className="h-4 w-4" />
                    </button>
                    <button className="rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3 text-sm font-black text-[#D9E3DC] transition hover:bg-white/[0.075]">
                      Open assistant
                    </button>
                  </div>
                </div>

                <div className="lux-card rounded-[2rem] p-5">
                  <SectionHeader
                    eyebrow="Due Soon"
                    title="Needs attention"
                    description="Payments, documents, go-home, and transport."
                  />

                  <div className="mt-5 space-y-3">
                    {dueSoon.map((item) => (
                      <div key={`${item.label}-${item.owner}`} className="rounded-3xl border border-white/10 bg-white/[0.035] p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-black text-white">{item.label}</p>
                            <p className="mt-1 text-sm text-[#AEBBB3]">{item.owner}</p>
                          </div>
                          <span className="rounded-full bg-[#D1B46F]/12 px-2.5 py-1 text-[11px] font-black text-[#D1B46F]">
                            {item.date}
                          </span>
                        </div>
                        <p className="mt-3 text-xs font-black uppercase tracking-[0.16em] text-[#7F9188]">
                          {item.type}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="soft-card rounded-[2rem] p-5">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="h-5 w-5 text-[#D1B46F]" />
                    <p className="font-black text-white">Boundary Check</p>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-[#AEBBB3]">
                    This dashboard stays inside DogBogPortal core operations. DogBreederDocs and DogBreederWeb
                    appear only as linked surfaces until their separate build stages.
                  </p>
                </div>
              </aside>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}

function MetricCard({
  label,
  value,
  detail,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
  tone: string;
}) {
  const toneClasses =
    tone === "good"
      ? "bg-emerald-400/10 text-emerald-200 border-emerald-300/15"
      : tone === "warn"
        ? "bg-[#D1B46F]/10 text-[#D1B46F] border-[#D1B46F]/20"
        : tone === "danger"
          ? "bg-rose-400/10 text-rose-200 border-rose-300/15"
          : "bg-sky-400/10 text-sky-200 border-sky-300/15";

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-4">
      <div className="flex items-center justify-between gap-3">
        <div className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${toneClasses}`}>
          <Icon className="h-5 w-5" />
        </div>
        <TrendingUp className="h-4 w-4 text-[#D1B46F]" />
      </div>
      <p className="mt-4 text-xs font-black uppercase tracking-[0.14em] text-[#AEBBB3]">{label}</p>
      <p className="mt-1 font-display text-3xl font-black text-white">{value}</p>
      <p className="mt-1 text-xs font-bold text-[#AEBBB3]">{detail}</p>
    </div>
  );
}

function QuickAction({
  href,
  label,
  icon: Icon,
}: {
  href: string;
  label: string;
  icon: LucideIcon;
}) {
  return (
    <a
      href={href}
      className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3 text-sm font-black text-[#ECF3EE] transition hover:border-[#D1B46F]/35 hover:bg-white/[0.075]"
    >
      <span className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-[#D1B46F]" />
        {label}
      </span>
      <ChevronRight className="h-4 w-4 text-[#7F9188]" />
    </a>
  );
}

function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div>
      <p className="text-xs font-black uppercase tracking-[0.18em] text-[#D1B46F]">{eyebrow}</p>
      <h2 className="font-display mt-1 text-2xl font-black text-white">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-[#AEBBB3]">{description}</p>
    </div>
  );
}

function TaskRow({
  title,
  detail,
  area,
  urgency,
  icon: Icon,
}: {
  title: string;
  detail: string;
  area: string;
  urgency: string;
  icon: LucideIcon;
}) {
  const isHigh = urgency === "High";

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-4">
      <div className="flex items-start gap-3">
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${isHigh ? "bg-rose-400/10 text-rose-200" : "bg-[#20382C] text-[#D1B46F]"}`}>
          {isHigh ? <AlertTriangle className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <p className="font-black text-white">{title}</p>
            <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-black ${isHigh ? "bg-rose-400/10 text-rose-200" : "bg-[#D1B46F]/10 text-[#D1B46F]"}`}>
              {urgency}
            </span>
          </div>
          <p className="mt-1 text-sm leading-5 text-[#AEBBB3]">{detail}</p>
          <div className="mt-3 flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[#7F9188]">
            <CheckCircle2 className="h-3.5 w-3.5 text-[#D1B46F]" />
            {area}
          </div>
        </div>
      </div>
    </div>
  );
}
