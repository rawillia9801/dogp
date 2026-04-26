import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Baby,
  Bell,
  Bot,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardSignature,
  CreditCard,
  Dog,
  FileText,
  Globe2,
  HeartPulse,
  LayoutDashboard,
  PawPrint,
  Plus,
  Route,
  Search,
  Settings,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";

const metrics = [
  { label: "Available Puppies", value: "6", detail: "+2 this week", icon: PawPrint },
  { label: "Active Buyers", value: "14", detail: "3 awaiting documents", icon: Users },
  { label: "Open Balances", value: "$8,420", detail: "2 payments due soon", icon: CreditCard },
  { label: "Docs Pending", value: "5", detail: "2 unsigned agreements", icon: ClipboardSignature },
];

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, active: true },
  { label: "Dogs", href: "/dashboard/dogs", icon: Dog },
  { label: "Litters", href: "/dashboard/litters", icon: Baby },
  { label: "Puppies", href: "/dashboard/puppies", icon: PawPrint },
  { label: "Buyers", href: "/dashboard/buyers", icon: Users },
  { label: "Payments", href: "/dashboard/payments", icon: CreditCard },
  { label: "Documents", href: "/dashboard/documents", icon: FileText },
  { label: "Website", href: "/dashboard/website", icon: Globe2 },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

const modules = [
  { title: "Dogs", text: "Roster, health, genetics, and breeding status.", icon: Dog, href: "/dashboard/dogs", stat: "18 records" },
  { title: "Breeding Program", text: "Pairings, heat cycles, breeding plans, and timeline.", icon: HeartPulse, href: "/dashboard/breeding-program", stat: "3 plans" },
  { title: "Litters", text: "Whelping notes, puppy counts, and litter milestones.", icon: Baby, href: "/dashboard/litters", stat: "2 current" },
  { title: "Buyers", text: "Applications, approvals, messages, and buyer status.", icon: Users, href: "/dashboard/buyers", stat: "14 active" },
  { title: "Documents", text: "Contracts, guarantees, applications, and PDFs.", icon: FileText, href: "/dashboard/documents", stat: "5 pending" },
  { title: "Transportation", text: "Pickup windows, delivery routes, and coordination.", icon: Route, href: "/dashboard/transportation", stat: "2 trips" },
];

const tasks = [
  { title: "Send deposit agreement reminders", detail: "3 buyers still need signatures before reservation is complete.", tag: "Documents" },
  { title: "Review payment due tomorrow", detail: "Megan H. has an installment due for Willow.", tag: "Payments" },
  { title: "Add week-six puppy updates", detail: "Bella’s litter is ready for photos and weight notes.", tag: "Puppies" },
  { title: "Confirm transport window", detail: "Pickup details need confirmation for Saturday.", tag: "Transport" },
];

const activity = [
  { title: "New buyer application", detail: "Emily R. submitted a Cavalier puppy application.", time: "12 min ago" },
  { title: "Payment logged", detail: "$500 deposit recorded for Ruby.", time: "1 hr ago" },
  { title: "Document package created", detail: "Deposit Agreement + Health Guarantee ready for review.", time: "3 hrs ago" },
];

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#F8F7F3] text-[#1F2933]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700;9..144,800&family=DM+Sans:wght@400;500;600;700;800;900&display=swap');
        body { font-family: 'DM Sans', sans-serif; background: #F8F7F3; }
        .font-display { font-family: 'Fraunces', serif; }
      `}</style>

      <div className="flex min-h-screen">
        <aside className="hidden w-72 shrink-0 border-r border-[#E5DED2] bg-white/80 px-5 py-5 shadow-sm backdrop-blur-xl xl:block">
          <a href="/dashboard" className="flex items-center gap-3 rounded-3xl border border-[#E5DED2] bg-[#F8F7F3] p-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2F4F3E] text-white shadow-lg shadow-[#2F4F3E]/15">
              <PawPrint className="h-6 w-6" />
            </div>
            <div>
              <p className="font-display text-xl font-black leading-tight">MyDogPortal</p>
              <p className="text-xs font-bold text-[#5B6B73]">Breeder Workspace</p>
            </div>
          </a>

          <div className="mt-6 rounded-3xl border border-[#D8CCB7] bg-[#F4EFE6] p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#C6A96B]/25 text-[#2F4F3E]">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-black text-[#1F2933]">Workspace Ready</p>
                <p className="mt-1 text-xs leading-5 text-[#5B6B73]">
                  Your buyer, puppy, payment, document, and reminder hub is coming together.
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
                    ? "bg-[#2F4F3E] text-white shadow-lg shadow-[#2F4F3E]/15"
                    : "text-[#5B6B73] hover:bg-[#F4EFE6] hover:text-[#2F4F3E]"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </a>
            ))}
          </nav>
        </aside>

        <section className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-[#E5DED2] bg-[#F8F7F3]/88 backdrop-blur-2xl">
            <div className="flex items-center justify-between gap-4 px-4 py-4 md:px-8">
              <div className="flex min-w-0 items-center gap-3">
                <a href="/dashboard" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#2F4F3E] text-white xl:hidden">
                  <PawPrint className="h-5 w-5" />
                </a>
                <div className="min-w-0">
                  <p className="truncate text-xs font-black uppercase tracking-[0.2em] text-[#A07A35]">
                    app.mydogportal.site/dashboard
                  </p>
                  <h1 className="font-display truncate text-3xl font-black tracking-tight md:text-4xl">
                    Breeder Dashboard
                  </h1>
                </div>
              </div>

              <div className="hidden min-w-[280px] items-center gap-2 rounded-2xl border border-[#D8CCB7] bg-white px-3 py-2 lg:flex">
                <Search className="h-4 w-4 text-[#7A6A55]" />
                <input
                  className="w-full bg-transparent text-sm text-[#1F2933] outline-none placeholder:text-[#9A8F80]"
                  placeholder="Search buyers, puppies, documents..."
                />
              </div>

              <div className="flex items-center gap-2">
                <button className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-[#D8CCB7] bg-white text-[#2F4F3E] transition hover:bg-[#F4EFE6]" aria-label="Notifications">
                  <Bell className="h-5 w-5" />
                  <span className="absolute right-2.5 top-2.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#C6A96B]" />
                </button>
                <a href="/dashboard/settings" className="hidden rounded-2xl border border-[#D8CCB7] bg-white px-4 py-3 text-sm font-black text-[#2F4F3E] transition hover:bg-[#F4EFE6] sm:inline-flex">
                  Settings
                </a>
              </div>
            </div>
          </header>

          <div className="flex-1 px-4 py-6 md:px-8">
            <section className="grid gap-5 xl:grid-cols-[1fr_360px]">
              <div className="space-y-5">
                <div className="overflow-hidden rounded-[2rem] border border-[#E5DED2] bg-white p-6 shadow-xl shadow-[#2F4F3E]/8 md:p-7">
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#D8CCB7] bg-[#F4EFE6] px-3 py-1.5 text-xs font-black uppercase tracking-[0.16em] text-[#A07A35]">
                        <LayoutDashboard className="h-4 w-4" />
                        Today’s Program Overview
                      </div>
                      <h2 className="font-display max-w-3xl text-4xl font-black leading-tight md:text-6xl">
                        Welcome back to your breeder workspace.
                      </h2>
                      <p className="mt-4 max-w-2xl text-base leading-7 text-[#5B6B73]">
                        Track puppies, buyers, payments, documents, reminders, and your public breeder experience from one calm operating center.
                      </p>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-2 lg:w-[360px]">
                      <QuickAction href="/dashboard/puppies/new" label="Add Puppy" icon={PawPrint} />
                      <QuickAction href="/dashboard/buyers/new" label="Add Buyer" icon={Users} />
                      <QuickAction href="/dashboard/documents/new" label="Create Docs" icon={FileText} />
                      <QuickAction href="/dashboard/transportation/new" label="Plan Transport" icon={Route} />
                    </div>
                  </div>

                  <div className="my-7 h-px bg-gradient-to-r from-transparent via-[#D8CCB7] to-transparent" />

                  <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-4">
                    {metrics.map((metric) => (
                      <MetricCard key={metric.label} {...metric} />
                    ))}
                  </div>
                </div>

                <div className="grid gap-5 2xl:grid-cols-[1fr_0.8fr]">
                  <Card>
                    <SectionHeader eyebrow="Core Operations" title="Program modules" description="Jump into the pieces of the breeder workflow you manage most." />
                    <div className="mt-5 grid gap-3 md:grid-cols-2">
                      {modules.map((module) => (
                        <a key={module.title} href={module.href} className="group rounded-3xl border border-[#E5DED2] bg-[#F8F7F3] p-4 transition hover:-translate-y-0.5 hover:border-[#2F4F3E]/25 hover:bg-[#F4EFE6]">
                          <div className="flex items-start gap-3">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#E9F0E7] text-[#2F4F3E]">
                              <module.icon className="h-5 w-5" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-3">
                                <p className="font-display text-lg font-black text-[#1F2933]">{module.title}</p>
                                <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-[#A07A35] transition group-hover:translate-x-0.5" />
                              </div>
                              <p className="mt-1 text-xs leading-5 text-[#5B6B73]">{module.text}</p>
                              <p className="mt-4 text-sm font-black text-[#2F4F3E]">{module.stat}</p>
                            </div>
                          </div>
                        </a>
                      ))}
                    </div>
                  </Card>

                  <Card>
                    <SectionHeader eyebrow="Tasks" title="Today’s work" description="A focused list of the next best actions." />
                    <div className="mt-5 space-y-3">
                      {tasks.map((task) => (
                        <div key={task.title} className="rounded-3xl border border-[#E5DED2] bg-[#F8F7F3] p-4">
                          <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#2F4F3E] text-white">
                              <CheckCircle2 className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-black text-[#1F2933]">{task.title}</p>
                              <p className="mt-1 text-sm leading-5 text-[#5B6B73]">{task.detail}</p>
                              <p className="mt-3 text-xs font-black uppercase tracking-[0.16em] text-[#A07A35]">{task.tag}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </div>

              <aside className="space-y-5">
                <Card>
                  <div className="flex items-center gap-3">
                    <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2F4F3E] text-white">
                      <Bot className="h-6 w-6" />
                      <span className="absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-[#C6A96B]" />
                    </div>
                    <div>
                      <p className="font-display text-lg font-black">BreederBuddy AI</p>
                      <p className="text-xs font-bold text-[#5B6B73]">Dog breeder assistant</p>
                    </div>
                  </div>

                  <div className="mt-5 rounded-3xl border border-[#E5DED2] bg-[#F8F7F3] p-4">
                    <p className="text-sm leading-6 text-[#5B6B73]">
                      Two buyers have unsigned deposit agreements, one transport request needs confirmation, and one payment is due tomorrow.
                    </p>
                  </div>

                  <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#2F4F3E] px-4 py-3 text-sm font-black text-white transition hover:bg-[#253F32]">
                    Prepare reminders
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </Card>

                <Card>
                  <SectionHeader eyebrow="Calendar" title="Upcoming" description="Today’s important breeder work." />
                  <div className="mt-5 space-y-3">
                    {[
                      ["9:00 AM", "Buyer application review"],
                      ["12:30 PM", "Puppy weight check"],
                      ["4:00 PM", "Transport confirmation"],
                    ].map(([time, title]) => (
                      <div key={title} className="flex items-center gap-3 rounded-3xl border border-[#E5DED2] bg-[#F8F7F3] p-4">
                        <CalendarDays className="h-5 w-5 text-[#A07A35]" />
                        <div>
                          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#A07A35]">{time}</p>
                          <p className="text-sm font-black text-[#1F2933]">{title}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card>
                  <SectionHeader eyebrow="Activity" title="Recent movement" description="Latest buyer, payment, and document updates." />
                  <div className="mt-5 space-y-3">
                    {activity.map((item) => (
                      <div key={item.title} className="rounded-3xl border border-[#E5DED2] bg-[#F8F7F3] p-4">
                        <div className="flex items-start justify-between gap-3">
                          <p className="font-black text-[#1F2933]">{item.title}</p>
                          <span className="shrink-0 text-xs font-bold text-[#9A8F80]">{item.time}</span>
                        </div>
                        <p className="mt-1 text-sm leading-5 text-[#5B6B73]">{item.detail}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </aside>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-[2rem] border border-[#E5DED2] bg-white p-5 shadow-lg shadow-[#2F4F3E]/5">{children}</div>;
}

function MetricCard({ label, value, detail, icon: Icon }: { label: string; value: string; detail: string; icon: LucideIcon }) {
  return (
    <div className="rounded-3xl border border-[#E5DED2] bg-[#F8F7F3] p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#E9F0E7] text-[#2F4F3E]">
          <Icon className="h-5 w-5" />
        </div>
        <TrendingUp className="h-4 w-4 text-[#A07A35]" />
      </div>
      <p className="mt-4 text-xs font-black uppercase tracking-[0.14em] text-[#7A6A55]">{label}</p>
      <p className="mt-1 font-display text-3xl font-black text-[#1F2933]">{value}</p>
      <p className="mt-1 text-xs font-bold text-[#5B6B73]">{detail}</p>
    </div>
  );
}

function QuickAction({ href, label, icon: Icon }: { href: string; label: string; icon: LucideIcon }) {
  return (
    <a href={href} className="flex items-center justify-between gap-3 rounded-2xl border border-[#D8CCB7] bg-white px-4 py-3 text-sm font-black text-[#2F4F3E] transition hover:bg-[#F4EFE6]">
      <span className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-[#A07A35]" />
        {label}
      </span>
      <Plus className="h-4 w-4 text-[#7A6A55]" />
    </a>
  );
}

function SectionHeader({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div>
      <p className="text-xs font-black uppercase tracking-[0.18em] text-[#A07A35]">{eyebrow}</p>
      <h2 className="font-display mt-1 text-2xl font-black text-[#1F2933]">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-[#5B6B73]">{description}</p>
    </div>
  );
}
