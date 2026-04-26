import type { ReactNode } from "react";
import {
  AlertTriangle,
  Baby,
  BadgeCheck,
  Bell,
  Bot,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  ClipboardSignature,
  CreditCard,
  Dog,
  FileCheck2,
  FileText,
  Gauge,
  Globe2,
  HeartPulse,
  PawPrint,
  Plus,
  Route,
  Search,
  Send,
  Settings,
  ShieldCheck,
  Sparkles,
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
  ["Breeding Plan", "/dashboard/breeding-program/new", HeartPulse],
  ["Create Litter", "/dashboard/litters/new", Baby],
  ["Add Puppy", "/dashboard/puppies/new", PawPrint],
  ["Add Buyer", "/dashboard/buyers/new", Users],
  ["Log Payment", "/dashboard/payments/new", CreditCard],
] as const;

export default async function DashboardPage() {
  const live = await getDashboardData();

  const primaryMetrics = [
    ["Available puppies", `${live.counts.availablePuppies}/${live.counts.puppies}`, "ready or coming soon", PawPrint, "gold"],
    ["Buyer pipeline", String(live.counts.buyers), `${live.counts.applications} pending apps`, Users, "green"],
    ["Open balances", `$${live.money.openBalances.toLocaleString()}`, `${live.money.dueSoon} due · ${live.money.overdue} overdue`, CreditCard, "rose"],
    ["Program alerts", String(live.counts.alertsOpen), `${live.counts.documentsPending} document flags`, AlertTriangle, "sage"],
  ] as const;

  const lifecycle = [
    ["Dogs", "/dashboard/dogs", Dog, "Foundation", live.counts.dogs, "Manage parents, health, genetics"],
    ["Breedings", "/dashboard/breeding-program", HeartPulse, "Plans", live.counts.breedings + live.counts.pregnancies, "Pairings and pregnancies"],
    ["Litters", "/dashboard/litters", Baby, "Whelping", live.counts.litters, "Birth records and milestones"],
    ["Puppies", "/dashboard/puppies", PawPrint, "Inventory", live.counts.puppies, "Availability and reservations"],
    ["Buyers", "/dashboard/buyers", Users, "CRM", live.counts.buyers, "Applications and approvals"],
    ["Payments", "/dashboard/payments", CreditCard, "Money", `$${live.money.openBalances.toLocaleString()}`, "Deposits and balances"],
    ["Delivery", "/dashboard/transportation", Truck, "Transport", live.counts.transportation, "Pickup and delivery plans"],
  ] as const;

  const onboarding = [
    ["Dog", live.activation.hasDog],
    ["Breeding", live.activation.hasBreeding],
    ["Puppy", live.activation.hasPuppy],
    ["Buyer", live.activation.hasBuyer],
    ["Payment", live.activation.hasPayment],
  ] as const;

  const completed = onboarding.filter((item) => item[1]).length;
  const taskPreview = live.tasks.length ? live.tasks.slice(0, 3) : [{ title: "Build your first workflow", detail: "Add a dog record to unlock live program intelligence.", tag: "Setup", priority: "normal" }];
  const alertPreview = live.alerts.length ? live.alerts.slice(0, 2) : [{ title: "No active red flags", detail: "Alerts will appear here when payments, documents, or breeding tasks need attention.", severity: "info" }];
  const eventPreview = live.events.length ? live.events.slice(0, 3) : [{ title: "No upcoming events", date: "Upcoming", tag: "Calendar" }];

  return (
    <main className="min-h-screen bg-[#F7F5EF] text-[#1C2B39]">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700;9..144,800&family=DM+Sans:wght@400;500;700;800&display=swap'); body{font-family:'DM Sans',sans-serif;background:#F7F5EF}.font-display{font-family:'Fraunces',serif}`}</style>
      <div className="flex min-h-screen">
        <aside className="hidden w-[292px] shrink-0 border-r border-[#DDD6C8] bg-[#FBFAF6] px-4 py-4 xl:block">
          <a href="/dashboard" className="flex items-center gap-3 rounded-[1.5rem] border border-[#DDD6C8] bg-white p-3 shadow-sm shadow-[#315842]/5">
            <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-[#315842] text-white shadow-lg shadow-[#315842]/15">
              <PawPrint className="h-6 w-6" />
              <span className="absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-[#C7A866]" />
            </div>
            <div>
              <p className="font-display text-xl font-black leading-none">MyDogPortal</p>
              <p className="mt-1 text-[11px] font-black uppercase tracking-[0.16em] text-[#7B756A]">Command Center</p>
            </div>
          </a>

          <div className="mt-4 rounded-[1.5rem] border border-[#DDD6C8] bg-[#ECEBE3] p-4">
            <div className="flex gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-[#315842]"><ShieldCheck className="h-5 w-5" /></div>
              <div>
                <p className="text-sm font-black">Morning command check</p>
                <p className="mt-1 text-xs leading-5 text-[#5C6C72]">{live.organizationName}</p>
              </div>
            </div>
          </div>

          <nav className="mt-4 space-y-1">
            {navItems.map(([label, href, Icon, active]) => (
              <a key={label} href={href} className={`group flex items-center justify-between rounded-2xl px-4 py-2.5 text-sm font-black transition ${active ? "bg-[#315842] text-white shadow-md shadow-[#315842]/15" : "text-[#52616B] hover:bg-white hover:text-[#315842]"}`}>
                <span className="flex items-center gap-3"><Icon className="h-4 w-4" />{label}</span>
                {active ? <span className="h-1.5 w-1.5 rounded-full bg-[#D9BC7B]" /> : null}
              </a>
            ))}
          </nav>
        </aside>

        <section className="flex-1 overflow-hidden">
          <header className="sticky top-0 z-30 border-b border-[#DDD6C8] bg-[#F7F5EF]/90 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4 px-4 py-3 md:px-7">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#B08A46]">Daily breeder command center</p>
                <h1 className="font-display text-4xl font-black leading-none md:text-5xl">Dashboard</h1>
              </div>
              <div className="hidden min-w-[360px] items-center gap-2 rounded-full border border-[#DDD6C8] bg-white px-4 py-2.5 shadow-sm lg:flex">
                <Search className="h-4 w-4 text-[#7A6A55]" />
                <input className="w-full bg-transparent text-sm outline-none placeholder:text-[#9C9588]" placeholder="Search dog, litter, buyer, contract, payment..." />
              </div>
              <div className="flex items-center gap-2">
                <button className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-[#DDD6C8] bg-white shadow-sm"><Bell className="h-5 w-5 text-[#315842]" /></button>
                <a href="/dashboard/settings" className="rounded-2xl border border-[#DDD6C8] bg-white px-5 py-2.5 text-sm font-black text-[#315842] shadow-sm">Settings</a>
              </div>
            </div>
          </header>

          <div className="px-4 py-5 md:px-7">
            <section className="grid gap-5 2xl:grid-cols-[minmax(0,1fr)_390px]">
              <div className="space-y-5">
                <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_355px]">
                  <div className="relative overflow-hidden rounded-[2rem] border border-[#DDD6C8] bg-white p-6 shadow-xl shadow-[#315842]/7">
                    <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#C7A866]/18 blur-3xl" />
                    <div className="absolute -bottom-20 left-32 h-52 w-52 rounded-full bg-[#315842]/8 blur-3xl" />
                    <div className="relative">
                      <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#DDD6C8] bg-[#F3EFE5] px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-[#B08A46]"><Sparkles className="h-4 w-4" />Morning briefing</div>
                      <h2 className="font-display max-w-4xl text-4xl font-black leading-[1.02] md:text-6xl">Run today from one calm command center.</h2>
                      <p className="mt-4 max-w-3xl text-base leading-7 text-[#52616B]">A focused view of your program, buyers, money, documents, and go-home logistics.</p>
                      <div className="mt-5 grid gap-3 md:grid-cols-3">
                        <BriefingStat label="Due soon" value={live.money.dueSoon} detail="payments" />
                        <BriefingStat label="Pending" value={live.counts.documentsPending} detail="documents" />
                        <BriefingStat label="Upcoming" value={live.counts.eventsUpcoming} detail="events" />
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[2rem] border border-[#DDD6C8] bg-[#315842] p-5 text-white shadow-xl shadow-[#315842]/15">
                    <div className="flex items-center gap-3">
                      <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-white/12 text-white"><Bot className="h-6 w-6" /><span className="absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full border-2 border-[#315842] bg-[#D9BC7B]" /></div>
                      <div><p className="font-display text-2xl font-black leading-none">Breeder Buddy AI</p><p className="mt-1 text-[11px] font-black uppercase tracking-[0.16em] text-[#D9BC7B]">Concierge intelligence</p></div>
                    </div>
                    <div className="mt-5 rounded-[1.25rem] border border-white/12 bg-white/8 p-4">
                      <p className="text-sm font-bold leading-7 text-white/82">Ask who owes balances, which agreements are unsigned, or what buyer action needs attention next.</p>
                    </div>
                    <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-black text-[#315842] shadow-lg shadow-black/10">Ask Breeder Buddy AI<WandSparkles className="h-4 w-4" /></button>
                  </div>
                </section>

                <section className="grid gap-3 md:grid-cols-2 2xl:grid-cols-4">
                  {primaryMetrics.map(([label, value, detail, Icon, tone]) => <MetricCard key={label} label={label} value={value} detail={detail} icon={Icon} tone={tone} />)}
                </section>

                <section className="grid gap-5 xl:grid-cols-[1fr_0.95fr]">
                  <Card><SectionHeader eyebrow="Today’s priorities" title="Fix these first" description="Live tasks and program actions surfaced for the day." />{taskPreview.map((task) => <CompactRow key={task.title} title={task.title} detail={task.detail} tone="green" />)}</Card>
                  <Card><SectionHeader eyebrow="Red flags" title="Needs attention" description="Alerts, unsigned docs, overdue balances, and program warnings." />{alertPreview.map((alert) => <CompactRow key={alert.title} title={alert.title} detail={alert.detail} tone="red" />)}</Card>
                </section>

                <section className="rounded-[1.75rem] border border-[#DDD6C8] bg-[#F9F8F4] p-4 shadow-sm">
                  <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                    <div><p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#B08A46]">Operating lifecycle</p><h2 className="font-display mt-1 text-2xl font-black">Dogs → Breedings → Litters → Puppies → Buyers → Payments → Delivery</h2></div>
                    <p className="max-w-md text-sm leading-6 text-[#52616B]">Open the module, add records, and the command center becomes live.</p>
                  </div>
                  <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-7">
                    {lifecycle.map(([label, href, Icon, detail, value, subtext], index) => <ModuleTile key={label} index={index + 1} label={label} href={href} icon={Icon} detail={detail} value={value} subtext={subtext} />)}
                  </div>
                </section>
              </div>

              <aside className="space-y-5">
                <Card>
                  <SectionHeader eyebrow="Quick commands" title="Add the next record" description="These shortcuts will become the daily input engine." />
                  <div className="mt-4 grid gap-2 sm:grid-cols-2 2xl:grid-cols-1">
                    {quickActions.map(([label, href, Icon]) => <a key={label} href={href} className="flex items-center justify-between rounded-2xl border border-[#E2DBCE] bg-[#FBFAF6] px-3 py-3 text-sm font-black text-[#315842] transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md"><span className="flex items-center gap-2"><Icon className="h-4 w-4 text-[#B08A46]" />{label}</span><Plus className="h-4 w-4" /></a>)}
                  </div>
                </Card>

                <Card>
                  <SectionHeader eyebrow="Activation" title="Workspace setup" description="Add records to turn demo zeros into live intelligence." />
                  <div className="mt-4 rounded-[1.25rem] bg-[#315842] p-4 text-white">
                    <div className="flex items-end justify-between"><div><p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#D9BC7B]">Progress</p><p className="font-display text-4xl font-black">{completed}/{onboarding.length}</p></div><BadgeCheck className="h-9 w-9 text-[#D9BC7B]" /></div>
                    <div className="mt-3 h-2.5 rounded-full bg-white/15"><div className="h-full rounded-full bg-[#D9BC7B]" style={{ width: `${(completed / onboarding.length) * 100}%` }} /></div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">{onboarding.map(([label, done]) => <span key={label} className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-black ${done ? "border-[#BFD0C4] bg-[#EEF4EC] text-[#315842]" : "border-[#DDD6C8] bg-white text-[#7A6A55]"}`}>{done ? <CheckCircle2 className="h-4 w-4" /> : <TimerReset className="h-4 w-4" />}{label}</span>)}</div>
                </Card>

                <Card><SectionHeader eyebrow="Calendar" title="Upcoming" description="Merged breeder events and breeding calendar." />{eventPreview.map((event) => <div key={event.title} className="mt-3 rounded-2xl border border-[#DDD6C8] bg-[#FBFAF6] p-3"><div className="flex items-center gap-3"><CalendarClock className="h-5 w-5 text-[#B08A46]" /><div><p className="text-[11px] font-black uppercase tracking-[0.14em] text-[#B08A46]">{event.date} · {event.tag}</p><p className="text-sm font-black">{event.title}</p></div></div></div>)}</Card>
              </aside>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}

function BriefingStat({ label, value, detail }: { label: string; value: number; detail: string }) {
  return <div className="rounded-2xl border border-[#DDD6C8] bg-[#FBFAF6] px-4 py-3"><p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#B08A46]">{label}</p><p className="font-display text-3xl font-black">{value}</p><p className="text-xs font-bold text-[#52616B]">{detail}</p></div>;
}

function MetricCard({ label, value, detail, icon: Icon, tone }: { label: string; value: string; detail: string; icon: typeof PawPrint; tone: string }) {
  return <div className={`rounded-[1.5rem] border p-4 shadow-sm ${metricTone(tone)}`}><div className="flex items-start justify-between"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/70 text-[#315842]"><Icon className="h-5 w-5" /></div>{tone === "rose" ? <span className="rounded-full bg-white/70 px-2.5 py-1 text-[11px] font-black text-[#A03625]">Watch</span> : null}</div><p className="mt-4 text-[11px] font-black uppercase tracking-[0.18em] text-[#7A6A55]">{label}</p><p className="font-display mt-1 text-3xl font-black">{value}</p><p className="mt-1 text-xs font-bold text-[#52616B]">{detail}</p></div>;
}

function ModuleTile({ index, label, href, icon: Icon, detail, value, subtext }: { index: number; label: string; href: string; icon: typeof PawPrint; detail: string; value: string | number; subtext: string }) {
  return <a href={href} className="group rounded-2xl border border-[#DDD6C8] bg-white p-3 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#315842]/8"><div className="mb-3 flex items-center justify-between"><div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#EEF1E8] text-[#315842]"><Icon className="h-5 w-5" /></div><span className="font-display text-2xl font-black text-[#C7A866]">{String(index).padStart(2, "0")}</span></div><p className="font-black">{label}</p><p className="text-xs text-[#66757A]">{detail}</p><p className="mt-2 text-lg font-black text-[#315842]">{value}</p><div className="mt-3 flex items-center justify-between border-t border-[#EEE7DA] pt-3 text-xs font-black text-[#52616B]"><span>{subtext}</span><ChevronRight className="h-4 w-4 text-[#B08A46] transition group-hover:translate-x-0.5" /></div></a>;
}

function Card({ children }: { children: ReactNode }) { return <div className="rounded-[1.75rem] border border-[#DDD6C8] bg-white p-5 shadow-sm shadow-[#315842]/5">{children}</div>; }
function SectionHeader({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) { return <div><p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#B08A46]">{eyebrow}</p><h2 className="font-display mt-1 text-2xl font-black">{title}</h2><p className="mt-1 text-sm leading-6 text-[#52616B]">{description}</p></div>; }
function CompactRow({ title, detail, tone }: { title: string; detail: string; tone: "green" | "red" }) { return <div className="mt-3 rounded-2xl border border-[#DDD6C8] bg-[#FBFAF6] p-3"><div className="flex gap-3"><div className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${tone === "red" ? "bg-[#A03625]" : "bg-[#315842]"}`} /><div><p className="font-black">{title}</p><p className="mt-0.5 text-sm leading-6 text-[#52616B]">{detail}</p></div></div></div>; }
function metricTone(tone: string) { if (tone === "rose") return "border-[#EBCBC4] bg-[#FFF7F4]"; if (tone === "gold") return "border-[#E4D5B8] bg-[#FFF9EA]"; if (tone === "sage") return "border-[#C9D7CC] bg-[#F1F6EF]"; return "border-[#C9D7CC] bg-[#F4F8F1]"; }
