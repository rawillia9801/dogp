import type { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ClipboardList,
  Dna,
  HeartPulse,
  PawPrint,
  PlusCircle,
  Sparkles,
  Timer,
  UsersRound,
} from "lucide-react";
import type { BreederWorkspaceData } from "@/lib/breeder-data";
import { Panel, StatusPill, WorkspaceHeader, formatDate, toneForStatus } from "@/components/admin/workspace-ui";

type Tone = "gold" | "green" | "blue" | "red" | "neutral";

type FeedItem = {
  id: string;
  title: string;
  detail: string;
  date: string | null;
  category: string;
  tone: Tone;
};

type ActionItem = {
  id: string;
  title: string;
  detail: string;
  due: string;
  tone: Tone;
};

export function DashboardWorkspace({ data }: { data: BreederWorkspaceData }) {
  const activeDogs = data.dogs.filter((dog) => dog.status !== "retired" && dog.status !== "archived");
  const activePairings = data.pairings.filter((pairing) =>
    ["planned", "review", "bred", "confirmed"].includes(pairing.status),
  );
  const littersInProgress = data.litters.filter((litter) =>
    ["planned", "bred", "confirmed", "whelped"].includes(litter.status),
  );
  const puppies = data.puppies.filter((puppy) => puppy.status !== "placed");
  const openTasks = data.tasks.filter((task) => task.status !== "closed" && task.status !== "complete");
  const feed = buildOperationalFeed(data);
  const actions = buildPriorityActions(openTasks);
  const health = programHealth(data, activeDogs, activePairings, littersInProgress);

  return (
    <div>
      <WorkspaceHeader
        eyebrow="Command center"
        title="Dashboard"
        description="Overview of your breeding program, active work, and upcoming activity."
      />

      <Panel className="mt-8 overflow-hidden p-0" title="Program Status" eyebrow="Live totals">
        <div className="grid gap-px bg-white/[0.06] md:grid-cols-4">
          <TopMetric
            icon={<PawPrint className="size-5" />}
            label="Active Dogs"
            value={activeDogs.length}
            detail={`${data.dogs.length} roster records`}
            progress={ratio(activeDogs.length, Math.max(data.dogs.length, 1))}
            tone="gold"
          />
          <TopMetric
            icon={<Dna className="size-5" />}
            label="Active Pairings"
            value={activePairings.length}
            detail={`${data.pairings.length} breeding records`}
            progress={ratio(activePairings.length, Math.max(data.pairings.length, 1))}
            tone="blue"
          />
          <TopMetric
            icon={<HeartPulse className="size-5" />}
            label="Litters in Progress"
            value={littersInProgress.length}
            detail={`${data.litters.length} litter records`}
            progress={ratio(littersInProgress.length, Math.max(data.litters.length, 1))}
            tone="green"
          />
          <TopMetric
            icon={<UsersRound className="size-5" />}
            label="Puppies"
            value={puppies.length}
            detail={`${data.puppies.length} puppy records`}
            progress={ratio(puppies.length, Math.max(data.puppies.length, 1))}
            tone="gold"
          />
        </div>
      </Panel>

      <div className="mt-5 grid gap-5 2xl:grid-cols-[1.1fr_1fr_360px]">
        <Panel className="p-5" title="Operational Feed" eyebrow="Program activity">
          <div className="relative">
            <div className="absolute bottom-4 left-[15px] top-4 w-px bg-gradient-to-b from-gold/50 via-white/[0.08] to-transparent" />
            {feed.slice(0, 7).map((item, index) => (
              <FeedRow key={item.id} item={item} featured={index === 0} />
            ))}
          </div>
        </Panel>

        <Panel className="p-5" title="Program Health" eyebrow="Readiness index">
          <div className="grid gap-5 lg:grid-cols-[180px_1fr] 2xl:grid-cols-1">
            <div className="flex items-center justify-center">
              <div className="flex size-44 flex-col items-center justify-center rounded-full border border-gold/25 bg-[radial-gradient(circle_at_50%_20%,rgba(215,173,103,0.24),transparent_55%),rgba(0,0,0,0.18)] shadow-[0_0_52px_rgba(215,173,103,0.12)]">
                <p className="text-5xl font-semibold tracking-tight text-stone-50">{health.score}%</p>
                <p className="mt-1 text-xs uppercase tracking-[0.16em] text-stone-500">health</p>
              </div>
            </div>
            <div className="space-y-4">
              {health.breakdown.map((item) => (
                <HealthBar key={item.label} label={item.label} value={item.value} detail={item.detail} />
              ))}
            </div>
          </div>
        </Panel>

        <Panel className="p-5" title="Tasks & Priorities" eyebrow="Current work">
          <div className="space-y-3">
            {actions.slice(0, 6).map((action) => (
              <PriorityAction key={action.id} action={action} />
            ))}
          </div>
        </Panel>
      </div>

      <Panel className="mt-5 p-5" title="Quick Actions" eyebrow="Primary workflows">
        <div className="grid gap-3 md:grid-cols-5">
          <QuickAction href="/admin/dogs" icon={<PlusCircle className="size-4" />} label="Add Dog" detail="Open roster controls" />
          <QuickAction href="/admin/breeding-program" icon={<Dna className="size-4" />} label="Plan Breeding" detail="Launch pair engine" />
          <QuickAction href="/admin/litters" icon={<ClipboardList className="size-4" />} label="Record Litter" detail="Manage litter records" />
          <QuickAction href="/admin/puppies" icon={<PawPrint className="size-4" />} label="Add Puppy" detail="Open puppy pipeline" />
          <QuickAction href="/admin/payments" icon={<UsersRound className="size-4" />} label="Log Payment" detail="Update buyer account" />
        </div>
      </Panel>
    </div>
  );
}

function TopMetric({
  icon,
  label,
  value,
  detail,
  progress,
  tone,
}: {
  icon: ReactNode;
  label: string;
  value: number;
  detail: string;
  progress: number;
  tone: Tone;
}) {
  const accent = toneClasses(tone);

  return (
    <div className="bg-[#101820] p-5">
      <div className="flex items-start justify-between gap-3">
        <span className={`flex size-10 items-center justify-center rounded-md border ${accent.border} ${accent.bg} ${accent.text}`}>
          {icon}
        </span>
        <span className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">{label}</span>
      </div>
      <p className="mt-5 text-4xl font-semibold tracking-tight text-stone-50">{value}</p>
      <p className="mt-1 truncate text-sm text-stone-400">{detail}</p>
      <ProgressLine value={progress} tone={tone} className="mt-4" />
    </div>
  );
}

function FeedRow({ item, featured }: { item: FeedItem; featured: boolean }) {
  const accent = toneClasses(item.tone);

  return (
    <div className="relative grid gap-3 py-3 pl-11 xl:grid-cols-[1fr_120px] xl:items-center">
      <span className={`absolute left-0 top-4 z-10 flex size-8 items-center justify-center rounded-full border ${accent.border} ${accent.bg} ${accent.text}`}>
        {featured ? <Sparkles className="size-4" /> : <Timer className="size-4" />}
      </span>
      <div className={featured ? "rounded-md border border-gold/20 bg-gold/10 p-3" : ""}>
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-medium text-stone-100">{item.title}</p>
          <StatusPill tone={item.tone}>{item.category}</StatusPill>
        </div>
        <p className="mt-1 text-sm leading-6 text-stone-400">{item.detail}</p>
      </div>
      <p className="text-sm text-stone-500 xl:text-right">{formatDate(item.date)}</p>
    </div>
  );
}

function HealthBar({ label, value, detail }: { label: string; value: number; detail: string }) {
  const tone = value >= 0.78 ? "green" : value >= 0.48 ? "gold" : "blue";

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-stone-200">{label}</p>
          <p className="text-xs text-stone-500">{detail}</p>
        </div>
        <p className="font-mono text-xs text-gold-soft">{Math.round(value * 100)}%</p>
      </div>
      <ProgressLine value={value} tone={tone} />
    </div>
  );
}

function PriorityAction({ action }: { action: ActionItem }) {
  const accent = toneClasses(action.tone);

  return (
    <div className="rounded-md border border-white/[0.06] bg-white/[0.025] p-3">
      <div className="flex items-start gap-3">
        <span className={`mt-1 size-2 rounded-full ${accent.solid}`} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <p className="font-medium text-stone-100">{action.title}</p>
            <StatusPill tone={action.tone}>{action.due}</StatusPill>
          </div>
          <p className="mt-1 text-sm leading-5 text-stone-500">{action.detail}</p>
        </div>
      </div>
    </div>
  );
}

function QuickAction({ href, icon, label, detail }: { href: string; icon: ReactNode; label: string; detail: string }) {
  return (
    <Link
      href={href}
      className="group rounded-md border border-gold/20 bg-gold/10 p-4 transition hover:border-gold/40 hover:bg-gold/15"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="flex size-9 items-center justify-center rounded-md border border-gold/25 bg-black/15 text-gold">
          {icon}
        </span>
        <ArrowRight className="size-4 text-gold transition group-hover:translate-x-0.5" />
      </div>
      <p className="mt-4 font-semibold text-stone-50">{label}</p>
      <p className="mt-1 text-sm text-stone-500">{detail}</p>
    </Link>
  );
}

function ProgressLine({ value, tone, className }: { value: number; tone: Tone; className?: string }) {
  const accent = toneClasses(tone);

  return (
    <div className={className}>
      <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
        <div className={`h-full rounded-full ${accent.solid}`} style={{ width: `${Math.max(8, Math.round(clamp(value) * 100))}%` }} />
      </div>
    </div>
  );
}

function buildOperationalFeed(data: BreederWorkspaceData): FeedItem[] {
  const events = data.events.map((event) => ({
    id: `event-${event.id}`,
    title: eventTitle(event.title, event.eventType),
    detail: event.notes ?? `${eventTitle(event.title, event.eventType)} is recorded in your program timeline.`,
    date: event.eventDate,
    category: eventCategory(event.eventType),
    tone: toneForStatus(event.status) as Tone,
  }));

  const tasks = data.tasks
    .filter((task) => task.status !== "closed" && task.status !== "complete")
    .map((task) => ({
      id: `task-${task.id}`,
      title: task.title,
      detail: task.notes ?? `${task.title} is ready for breeder review.`,
      date: task.dueDate,
      category: task.priority,
      tone: (task.priority === "urgent" ? "red" : task.priority === "high" ? "gold" : "blue") as Tone,
    }));

  const records = [
    ...data.pairings.map((pairing) => ({
      id: `pairing-${pairing.id}`,
      title: pairingTitle(pairing.pairingName, pairing.status),
      detail: pairing.internalAnalysis ?? "Breeding plan is active and ready for the next program update.",
      date: pairing.updatedAt.slice(0, 10),
      category: "pairing",
      tone: toneForStatus(pairing.status) as Tone,
    })),
    ...data.litters.map((litter) => ({
      id: `litter-${litter.id}`,
      title: litter.status === "whelped" ? "Litter recorded" : litter.litterName,
      detail: litter.notes ?? `${litter.litterName} is active in your litter records.`,
      date: litter.updatedAt.slice(0, 10),
      category: "litter",
      tone: toneForStatus(litter.status) as Tone,
    })),
    ...data.dogs.map((dog) => ({
      id: `dog-${dog.id}`,
      title: puppyStatusTitle(dog.callName, dog.status),
      detail: `${dog.callName} remains active in your breeding records.`,
      date: dog.updatedAt.slice(0, 10),
      category: "dog",
      tone: toneForStatus(dog.status) as Tone,
    })),
  ];

  const feed = [...events, ...tasks, ...records].sort(
    (a, b) => new Date(b.date ?? "1970-01-01").getTime() - new Date(a.date ?? "1970-01-01").getTime(),
  );

  if (feed.length > 0) {
    return feed;
  }

  return [
    {
      id: "guide-roster",
      title: "No recent activity yet. Your program updates will appear here.",
      detail: "Breeding scheduled, ovulation confirmed, litter records, puppy status changes, and payments will appear here.",
      date: null,
      category: "roster",
      tone: "gold",
    },
  ];
}

function buildPriorityActions(openTasks: BreederWorkspaceData["tasks"]): ActionItem[] {
  if (openTasks.length > 0) {
    return openTasks.slice(0, 6).map((task) => ({
      id: task.id,
      title: task.title,
      detail: task.notes ?? `${task.title} is ready for breeder action.`,
      due: task.dueDate ? formatDate(task.dueDate) : task.priority,
      tone: (task.priority === "urgent" ? "red" : task.priority === "high" ? "gold" : "blue") as Tone,
    }));
  }

  return [
    {
      id: "priority-dog",
      title: "No active tasks. Create or update a breeding plan to begin.",
      detail: "Tasks like confirming the breeding window, recording ovulation, and preparing whelping will appear here.",
      due: "ready",
      tone: "gold",
    },
  ];
}

function eventTitle(title: string, eventType: string | null) {
  const normalized = (eventType ?? "").toLowerCase();

  if (normalized.includes("ovulation")) return "Ovulation confirmed";
  if (normalized.includes("breeding")) return "Breeding scheduled";
  if (normalized.includes("payment")) return "Payment received";
  if (normalized.includes("litter")) return "Litter recorded";

  return title;
}

function eventCategory(eventType: string | null) {
  const normalized = (eventType ?? "").toLowerCase();

  if (normalized.includes("ovulation")) return "Ovulation";
  if (normalized.includes("breeding")) return "Breeding";
  if (normalized.includes("payment")) return "Payment";
  if (normalized.includes("litter")) return "Litter";

  return eventType ?? "Program";
}

function pairingTitle(name: string | null, status: string) {
  if (status === "planned") return "Breeding scheduled";
  if (status === "confirmed") return "Review upcoming litter";
  return name ?? "Breeding scheduled";
}

function puppyStatusTitle(name: string, status: string) {
  if (status === "available") return "Puppy marked available";
  if (status === "reserved") return "Puppy marked reserved";
  if (status === "placed") return "Puppy marked sold";
  return `${name} profile updated`;
}

function programHealth(
  data: BreederWorkspaceData,
  activeDogs: BreederWorkspaceData["dogs"],
  activePairings: BreederWorkspaceData["pairings"],
  littersInProgress: BreederWorkspaceData["litters"],
) {
  const breakdown = [
    {
      label: "Roster readiness",
      value: ratio(activeDogs.length, Math.max(data.dogs.length, 1)),
      detail: `${activeDogs.length} active dogs`,
    },
    {
      label: "Health coverage",
      value: ratio(data.healthRecords.length, Math.max(activeDogs.length, 1)),
      detail: `${data.healthRecords.length} clearance records`,
    },
    {
      label: "Genetic coverage",
      value: ratio(data.geneticRecords.length, Math.max(activeDogs.length, 1)),
      detail: `${data.geneticRecords.length} genetic profiles`,
    },
    {
      label: "Breeding momentum",
      value: ratio(activePairings.length + littersInProgress.length, Math.max(data.pairings.length + data.litters.length, 1)),
      detail: `${activePairings.length + littersInProgress.length} active workflows`,
    },
    {
      label: "Calendar control",
      value: ratio(data.events.length, Math.max(data.events.length + data.tasks.length, 1)),
      detail: `${data.events.length} dated events`,
    },
  ];

  const score = Math.round((breakdown.reduce((sum, item) => sum + item.value, 0) / breakdown.length) * 100);
  return { score, breakdown };
}

function ratio(value: number, total: number) {
  return total <= 0 ? 0 : clamp(value / total);
}

function clamp(value: number) {
  return Math.max(0, Math.min(1, value));
}

function toneClasses(tone: Tone) {
  const classes = {
    gold: {
      bg: "bg-gold/10",
      border: "border-gold/25",
      text: "text-gold",
      solid: "bg-gold",
    },
    green: {
      bg: "bg-emerald-400/10",
      border: "border-emerald-400/20",
      text: "text-emerald-200",
      solid: "bg-emerald-400",
    },
    blue: {
      bg: "bg-sky-400/10",
      border: "border-sky-400/20",
      text: "text-sky-200",
      solid: "bg-sky-400",
    },
    red: {
      bg: "bg-red-400/10",
      border: "border-red-400/20",
      text: "text-red-200",
      solid: "bg-red-400",
    },
    neutral: {
      bg: "bg-white/[0.045]",
      border: "border-white/[0.08]",
      text: "text-stone-300",
      solid: "bg-stone-400",
    },
  };

  return classes[tone];
}
