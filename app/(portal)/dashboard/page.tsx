import type { ReactNode } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Baby,
  BadgeCheck,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  CreditCard,
  Dog,
  HeartPulse,
  PawPrint,
  PlusCircle,
  Sparkles,
  Timer,
  TimerReset,
  Truck,
  Users,
} from "lucide-react";
import { getDashboardData } from "@/lib/dashboard-data";

type Tone = "gold" | "green" | "blue" | "red" | "neutral";

const quickActions = [
  ["Add Dog", "/dashboard/dogs/new", Dog, "Open roster controls"],
  ["Plan Breeding", "/dashboard/breeding-program/new", HeartPulse, "Launch pairing engine"],
  ["Record Litter", "/dashboard/litters/new", ClipboardList, "Manage litter records"],
  ["Add Puppy", "/dashboard/puppies/new", PawPrint, "Open puppy pipeline"],
  ["Log Payment", "/dashboard/payments/new", CreditCard, "Update buyer account"],
] as const;

export default async function DashboardPage() {
  const live = await getDashboardData();

  const topMetrics = [
    ["Active Dogs", live.counts.dogs, `${live.counts.dogs} roster records`, ratio(live.counts.dogs, Math.max(live.counts.dogs, 1)), PawPrint, "gold"],
    ["Active Pairings", live.counts.breedings + live.counts.pregnancies, `${live.counts.breedings} breeding records`, ratio(live.counts.breedings + live.counts.pregnancies, Math.max(live.counts.breedings + live.counts.pregnancies, 1)), HeartPulse, "blue"],
    ["Litters in Progress", live.counts.litters, `${live.counts.litters} litter records`, ratio(live.counts.litters, Math.max(live.counts.litters, 1)), Baby, "green"],
    ["Puppies", live.counts.puppies, `${live.counts.puppies} puppy records`, ratio(live.counts.puppies, Math.max(live.counts.puppies, 1)), Users, "gold"],
  ] as const;

  const feed = [
    ...live.events.map((event) => ({ id: `event-${event.title}`, title: event.title, detail: `${event.tag} activity is recorded in your program timeline.`, date: event.date, category: event.tag, tone: "blue" as Tone })),
    ...live.tasks.map((task) => ({ id: `task-${task.title}`, title: task.title, detail: task.detail, date: null, category: task.tag, tone: task.priority === "urgent" ? "red" as Tone : "gold" as Tone })),
  ];

  const displayFeed = feed.length ? feed.slice(0, 7) : [{ id: "guide-roster", title: "No recent activity yet. Your program updates will appear here.", detail: "Breeding scheduled, ovulation confirmed, litter records, puppy status changes, and payments will appear here.", date: null, category: "roster", tone: "gold" as Tone }];
  const actions = live.tasks.length ? live.tasks.slice(0, 6).map((task) => ({ id: task.title, title: task.title, detail: task.detail, due: task.tag, tone: task.priority === "urgent" ? "red" as Tone : "gold" as Tone })) : [{ id: "priority-dog", title: "No active tasks. Create or update a breeding plan to begin.", detail: "Tasks like confirming the breeding window, recording ovulation, and preparing whelping will appear here.", due: "ready", tone: "gold" as Tone }];
  const readiness = buildReadiness(live);
  const onboarding = [["Dog", live.activation.hasDog], ["Breeding", live.activation.hasBreeding], ["Puppy", live.activation.hasPuppy], ["Buyer", live.activation.hasBuyer], ["Payment", live.activation.hasPayment]] as const;

  return (
    <div className="px-5 py-8 lg:px-8">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700;9..144,800&family=DM+Sans:wght@400;500;700;800&display=swap'); body{font-family:'DM Sans',sans-serif;background:#F4F0E7}.font-display{font-family:'Fraunces',serif}`}</style>
      <WorkspaceHeader eyebrow="Command center" title="Dashboard" description="Overview of your breeding program, active work, buyer pipeline, and upcoming activity." />

      <Panel className="mt-8 overflow-hidden p-0" title="Program Status" eyebrow="Live totals">
        <div className="grid gap-px bg-[#E2D8C8] md:grid-cols-4">
          {topMetrics.map(([label, value, detail, progress, Icon, tone]) => (
            <TopMetric key={label} icon={<Icon className="size-5" />} label={label} value={value} detail={detail} progress={progress} tone={tone} />
          ))}
        </div>
      </Panel>

      <div className="mt-5 grid gap-5 2xl:grid-cols-[1.1fr_1fr_360px]">
        <Panel className="p-5" title="Operational Feed" eyebrow="Program activity">
          <div className="relative">
            <div className="absolute bottom-4 left-[15px] top-4 w-px bg-gradient-to-b from-[#C7A866] via-[#E2D8C8] to-transparent" />
            {displayFeed.map((item, index) => <FeedRow key={item.id} item={item} featured={index === 0} />)}
          </div>
        </Panel>

        <Panel className="p-5" title="Program Health" eyebrow="Readiness index">
          <div className="grid gap-5 lg:grid-cols-[180px_1fr] 2xl:grid-cols-1">
            <div className="flex items-center justify-center">
              <div className="flex size-44 flex-col items-center justify-center rounded-full border border-[#C7A866]/30 bg-[radial-gradient(circle_at_50%_20%,rgba(199,168,102,0.20),transparent_55%),#FBFAF6] shadow-[0_0_52px_rgba(49,88,66,0.10)]">
                <p className="text-5xl font-black tracking-tight text-[#172638]">{readiness.score}%</p>
                <p className="mt-1 text-xs font-black uppercase tracking-[0.16em] text-[#8A8173]">health</p>
              </div>
            </div>
            <div className="space-y-4">
              {readiness.breakdown.map((item) => <HealthBar key={item.label} label={item.label} value={item.value} detail={item.detail} />)}
            </div>
          </div>
        </Panel>

        <Panel className="p-5" title="Tasks & Priorities" eyebrow="Current work">
          <div className="space-y-3">
            {actions.map((action) => <PriorityAction key={action.id} action={action} />)}
          </div>
          <div className="mt-5 rounded-xl border border-[#D8CFBF] bg-[#F8F5EE] p-4">
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#B08A46]">Activation</p>
            <div className="mt-3 flex items-end justify-between">
              <p className="font-display text-4xl font-black text-[#315842]">{onboarding.filter((item) => item[1]).length}/{onboarding.length}</p>
              <BadgeCheck className="size-8 text-[#C7A866]" />
            </div>
            <div className="mt-3 flex flex-wrap gap-2">{onboarding.map(([label, done]) => <span key={label} className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-black ${done ? "border-[#BFD0C4] bg-[#EEF4EC] text-[#315842]" : "border-[#DDD6C8] bg-white text-[#7A6A55]"}`}>{done ? <CheckCircle2 className="size-4" /> : <TimerReset className="size-4" />}{label}</span>)}</div>
          </div>
        </Panel>
      </div>

      <Panel className="mt-5 p-5" title="Quick Actions" eyebrow="Primary workflows">
        <div className="grid gap-3 md:grid-cols-5">
          {quickActions.map(([label, href, Icon, detail]) => <QuickAction key={label} href={href} icon={<Icon className="size-4" />} label={label} detail={detail} />)}
        </div>
      </Panel>
    </div>
  );
}

function WorkspaceHeader({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) { return <div><p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#B08A46]">{eyebrow}</p><h1 className="mt-2 text-4xl font-black tracking-tight text-[#172638] md:text-5xl">{title}</h1><p className="mt-3 max-w-3xl text-sm leading-6 text-[#5C6872]">{description}</p></div>; }
function Panel({ children, title, eyebrow, className = "" }: { children: ReactNode; title: string; eyebrow: string; className?: string }) { return <section className={`rounded-lg border border-[#D8CFBF] bg-white shadow-[0_18px_48px_rgba(49,88,66,0.08)] ${className}`}><div className="border-b border-[#E2D8C8] px-5 py-4"><p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#B08A46]">{eyebrow}</p><h2 className="mt-1 text-base font-black text-[#172638]">{title}</h2></div>{children}</section>; }
function TopMetric({ icon, label, value, detail, progress, tone }: { icon: ReactNode; label: string; value: number; detail: string; progress: number; tone: Tone }) { const accent = toneClasses(tone); return <div className="bg-[#FBFAF6] p-5"><div className="flex items-start justify-between gap-3"><span className={`flex size-10 items-center justify-center rounded-md border ${accent.border} ${accent.bg} ${accent.text}`}>{icon}</span><span className="mt-1 text-xs font-black uppercase tracking-[0.16em] text-[#8A8173]">{label}</span></div><p className="mt-5 text-4xl font-black tracking-tight text-[#172638]">{value}</p><p className="mt-1 truncate text-sm text-[#5C6872]">{detail}</p><ProgressLine value={progress} tone={tone} className="mt-4" /></div>; }
function FeedRow({ item, featured }: { item: { title: string; detail: string; date: string | null; category: string; tone: Tone }; featured: boolean }) { const accent = toneClasses(item.tone); return <div className="relative grid gap-3 py-3 pl-11 xl:grid-cols-[1fr_120px] xl:items-center"><span className={`absolute left-0 top-4 z-10 flex size-8 items-center justify-center rounded-full border ${accent.border} ${accent.bg} ${accent.text}`}>{featured ? <Sparkles className="size-4" /> : <Timer className="size-4" />}</span><div className={featured ? "rounded-md border border-[#C7A866]/25 bg-[#FFF7E6] p-3" : ""}><div className="flex flex-wrap items-center gap-2"><p className="font-black text-[#172638]">{item.title}</p><StatusPill tone={item.tone}>{item.category}</StatusPill></div><p className="mt-1 text-sm leading-6 text-[#5C6872]">{item.detail}</p></div><p className="text-sm text-[#8A8173] xl:text-right">{item.date ?? "Set date"}</p></div>; }
function HealthBar({ label, value, detail }: { label: string; value: number; detail: string }) { const tone = value >= 0.78 ? "green" : value >= 0.48 ? "gold" : "blue"; return <div><div className="mb-2 flex items-center justify-between gap-4"><div><p className="text-sm font-black text-[#172638]">{label}</p><p className="text-xs text-[#66757A]">{detail}</p></div><p className="font-mono text-xs text-[#B08A46]">{Math.round(value * 100)}%</p></div><ProgressLine value={value} tone={tone} /></div>; }
function PriorityAction({ action }: { action: { title: string; detail: string; due: string; tone: Tone } }) { const accent = toneClasses(action.tone); return <div className="rounded-md border border-[#E2D8C8] bg-[#FBFAF6] p-3"><div className="flex items-start gap-3"><span className={`mt-1 size-2 rounded-full ${accent.solid}`} /><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-3"><p className="font-black text-[#172638]">{action.title}</p><StatusPill tone={action.tone}>{action.due}</StatusPill></div><p className="mt-1 text-sm leading-5 text-[#66757A]">{action.detail}</p></div></div></div>; }
function QuickAction({ href, icon, label, detail }: { href: string; icon: ReactNode; label: string; detail: string }) { return <Link href={href} className="group rounded-md border border-[#C7A866]/25 bg-[#FFF7E6] p-4 transition hover:border-[#C7A866]/50 hover:bg-[#FFF2D2]"><div className="flex items-center justify-between gap-3"><span className="flex size-9 items-center justify-center rounded-md border border-[#C7A866]/30 bg-white text-[#B08A46]">{icon}</span><ArrowRight className="size-4 text-[#B08A46] transition group-hover:translate-x-0.5" /></div><p className="mt-4 font-black text-[#172638]">{label}</p><p className="mt-1 text-sm text-[#66757A]">{detail}</p></Link>; }
function StatusPill({ children, tone }: { children: ReactNode; tone: Tone }) { const accent = toneClasses(tone); return <span className={`rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] ${accent.border} ${accent.bg} ${accent.text}`}>{children}</span>; }
function ProgressLine({ value, tone, className }: { value: number; tone: Tone; className?: string }) { const accent = toneClasses(tone); return <div className={className}><div className="h-1.5 overflow-hidden rounded-full bg-[#E2D8C8]"><div className={`h-full rounded-full ${accent.solid}`} style={{ width: `${Math.max(8, Math.round(clamp(value) * 100))}%` }} /></div></div>; }
function buildReadiness(live: Awaited<ReturnType<typeof getDashboardData>>) { const breakdown = [{ label: "Roster readiness", value: ratio(live.counts.dogs, Math.max(live.counts.dogs, 1)), detail: `${live.counts.dogs} active dogs` }, { label: "Buyer pipeline", value: ratio(live.counts.buyers, Math.max(live.counts.buyers + 1, 1)), detail: `${live.counts.buyers} buyer records` }, { label: "Money control", value: live.money.overdue > 0 ? 0.35 : 0.86, detail: `${live.money.overdue} overdue balances` }, { label: "Document control", value: live.counts.documentsPending > 0 ? 0.45 : 0.9, detail: `${live.counts.documentsPending} pending documents` }, { label: "Calendar control", value: ratio(live.counts.eventsUpcoming, Math.max(live.counts.eventsUpcoming + 1, 1)), detail: `${live.counts.eventsUpcoming} upcoming events` }]; const score = Math.round((breakdown.reduce((sum, item) => sum + item.value, 0) / breakdown.length) * 100); return { score, breakdown }; }
function ratio(value: number, total: number) { return total <= 0 ? 0 : clamp(value / total); }
function clamp(value: number) { return Math.max(0, Math.min(1, value)); }
function toneClasses(tone: Tone) { return { gold: { bg: "bg-[#FFF7E6]", border: "border-[#C7A866]/35", text: "text-[#8A6422]", solid: "bg-[#C7A866]" }, green: { bg: "bg-[#EEF4EC]", border: "border-[#AFC7B4]", text: "text-[#315842]", solid: "bg-[#315842]" }, blue: { bg: "bg-[#EEF4F7]", border: "border-[#B8CDD6]", text: "text-[#31556B]", solid: "bg-[#4F8195]" }, red: { bg: "bg-[#FFF2EE]", border: "border-[#E6B9AA]", text: "text-[#A03625]", solid: "bg-[#A03625]" }, neutral: { bg: "bg-[#F8F5EE]", border: "border-[#D8CFBF]", text: "text-[#5C6872]", solid: "bg-[#8A8173]" } }[tone]; }
