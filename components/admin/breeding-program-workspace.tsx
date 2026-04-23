import type { ReactNode } from "react";
import {
  CalendarDays,
  CheckCircle2,
  CircleDot,
  ClipboardCheck,
  Dna,
  FlaskConical,
  HeartPulse,
  Microscope,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Target,
  Timer,
} from "lucide-react";
import type { BreederWorkspaceData } from "@/lib/breeder-data";
import type { BreederEvent, BreederTask, BreedingPair, Dog, DogGeneticRecord, DogHealthRecord, Litter, Puppy } from "@/types";
import {
  FieldRow,
  Panel,
  StatusPill,
  WorkspaceHeader,
  displayText,
  dogAge,
  formatDate,
  toneForStatus,
} from "@/components/admin/workspace-ui";

type SignalTone = "gold" | "green" | "blue" | "red" | "neutral";

type TimelineMilestone = {
  label: string;
  date: string | null;
  status: "complete" | "active" | "queued";
};

type PuppyProjection = {
  id: string;
  label: string;
  sex: string;
  color: string;
  coat: string;
  trait: string;
};

export function BreedingProgramWorkspace({ data }: { data: BreederWorkspaceData }) {
  const activePairings = data.pairings.filter((pairing) =>
    ["planned", "review", "bred", "confirmed"].includes(pairing.status),
  );
  const selectedPairing = activePairings[0] ?? data.pairings[0] ?? null;
  const sire = resolveSire(data.dogs, selectedPairing);
  const dam = resolveDam(data.dogs, selectedPairing, sire?.id ?? null);
  const relatedLitter = resolveLitter(data.litters, selectedPairing, dam, sire);
  const relatedPuppies = relatedLitter
    ? data.puppies.filter((puppy) => puppy.litterId === relatedLitter.id)
    : [];
  const pairTasks = resolvePairTasks(data.tasks, selectedPairing);
  const pairEvents = resolvePairEvents(data.events, selectedPairing);
  const sireHealth = recordsForDog(data.healthRecords, sire?.id);
  const damHealth = recordsForDog(data.healthRecords, dam?.id);
  const sireGenetic = latestGeneticRecord(data.geneticRecords, sire?.id);
  const damGenetic = latestGeneticRecord(data.geneticRecords, dam?.id);
  const compatibility = calculateCompatibilityScore({
    selectedPairing,
    sire,
    dam,
    sireHealth,
    damHealth,
    sireGenetic,
    damGenetic,
    relatedLitter,
  });
  const coi = calculateCoi(sireGenetic, damGenetic);
  const milestones = buildTimeline(selectedPairing, relatedLitter);
  const projections = buildPuppyProjections(selectedPairing, relatedLitter, relatedPuppies, sire, dam);
  const taskRail = buildTaskRail(pairTasks, selectedPairing, relatedLitter);

  return (
    <div>
      <WorkspaceHeader
        eyebrow="Breeding operating system"
        title="Breeding Program"
        description="Plan pairings, track timelines, and manage outcomes."
        actions={
          <button className="inline-flex h-10 items-center gap-2 rounded-md border border-gold/35 bg-gold px-4 text-sm font-semibold text-[#20160c] shadow-gold">
            <Dna className="size-4" />
            View Full Analysis
          </button>
        }
      />

      <section className="mt-8 rounded-lg border border-white/[0.08] bg-[linear-gradient(135deg,rgba(215,173,103,0.11),rgba(255,255,255,0.035)_42%,rgba(10,16,22,0.92))] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">Breeding Pair Engine</p>
            <h2 className="mt-1 text-xl font-semibold text-stone-50">
              {selectedPairing?.pairingName ?? pairEngineTitle(sire, dam)}
            </h2>
          </div>
          <StatusPill tone={selectedPairing ? toneForStatus(selectedPairing.status) : "gold"}>
            {selectedPairing ? breedingStatusLabel(compatibility) : "Pair setup"}
          </StatusPill>
        </div>

        <div className="grid gap-4 xl:grid-cols-[1fr_300px_1fr] xl:items-stretch">
          <PairDogCard dog={sire} label="Sire" side="left" healthCount={sireHealth.length} geneticRecord={sireGenetic} />
          <CompatibilityCore score={compatibility} coi={coi} sire={sire} dam={dam} />
          <PairDogCard dog={dam} label="Dam" side="right" healthCount={damHealth.length} geneticRecord={damGenetic} />
        </div>
      </section>

      <nav className="mt-5 flex gap-2 overflow-x-auto border-b border-white/[0.08] pb-2">
        {[
          ["Overview", "#overview"],
          ["Planned Breedings", "#planned-breedings"],
          ["Timeline", "#timeline"],
          ["Genetics", "#genetic-analysis"],
          ["Offspring", "#offspring"],
          ["Notes", "#notes"],
        ].map(([tab, href], index) => (
          <a
            key={tab}
            href={href}
            className={
              index === 0
                ? "whitespace-nowrap rounded-md border border-gold/25 bg-gold/10 px-3 py-2 text-sm font-semibold text-gold-soft"
                : "whitespace-nowrap rounded-md border border-white/[0.06] bg-white/[0.025] px-3 py-2 text-sm text-stone-400 transition hover:border-gold/20 hover:text-stone-100"
            }
          >
            {tab}
          </a>
        ))}
      </nav>

      <div id="overview" className="mt-5 grid gap-5 2xl:grid-cols-[1fr_340px]">
        <main className="space-y-5">
          <Panel id="timeline" className="p-5" title="Breeding Timeline" eyebrow="Heat to weaning">
            <div className="grid gap-3 lg:grid-cols-6">
              {milestones.map((milestone) => (
                <TimelineNode key={milestone.label} milestone={milestone} />
              ))}
            </div>
          </Panel>

          <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
            <Panel id="genetic-analysis" className="p-5" title="Genetic Summary" eyebrow="Health, traits, and risk">
              <div className="grid gap-3 sm:grid-cols-2">
                <IndicatorTile
                  icon={<Dna className="size-4" />}
                  label="COI Percentage"
                  value={coi === null ? "Baseline" : `${coi.toFixed(1)}%`}
                  detail={coiRiskLevel(coi)}
                  tone={toneForCoi(coi)}
                />
                <IndicatorTile
                  icon={<ShieldAlert className="size-4" />}
                  label="Risk level"
                  value={coiRiskLevel(coi)}
                  detail={riskDetail(coi)}
                  tone={toneForCoi(coi)}
                />
                <IndicatorTile
                  icon={<HeartPulse className="size-4" />}
                  label="Health compatibility"
                  value={healthCompatibilityLabel(sireHealth, damHealth)}
                  detail={`${sireHealth.length + damHealth.length} clearance records`}
                  tone={healthCompatibilityTone(sireHealth, damHealth)}
                />
                <IndicatorTile
                  icon={<Sparkles className="size-4" />}
                  label="Key ancestry notes"
                  value={traitBalanceLabel(sire, dam)}
                  detail={traitBalanceDetail(sire, dam)}
                  tone="blue"
                />
              </div>
            </Panel>

            <Panel id="planned-breedings" className="p-5" title="Planned Litter" eyebrow="Forecast and reservations">
              <div className="space-y-1">
                <FieldRow label="Breeding date" value={formatDate(selectedPairing?.plannedStart ?? relatedLitter?.breedingDate ?? null)} />
                <FieldRow label="Expected litter size" value={selectedPairing?.expectedLitterSize ?? relatedLitter?.expectedSize ?? projectionSizeLabel(projections.length)} />
                <FieldRow label="Color expectations" value={selectedPairing?.colorCoatSummary ?? colorProjection(sire, dam)} />
                <FieldRow label="Reservation count" value={reservationLabel(selectedPairing, relatedLitter)} />
              </div>
              <div className="mt-4 rounded-md border border-gold/20 bg-gold/10 p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold-soft">Planning note</p>
                <p className="mt-2 text-sm leading-6 text-stone-300">
                  {displayText(selectedPairing?.goals ?? relatedLitter?.notes)}
                </p>
              </div>
            </Panel>
          </div>

          <Panel id="offspring" className="p-5" title="Predicted Offspring" eyebrow="Predicted puppy outcomes">
            {selectedPairing ? (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {projections.map((puppy) => (
                  <ProjectionCard key={puppy.id} puppy={puppy} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-stone-400">Select a breeding pair to generate offspring predictions.</p>
            )}
          </Panel>

          <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
            <Panel className="p-5" title="Overview" eyebrow="Operating ledger">
              <div className="divide-y divide-white/[0.06]">
                {activeBreedingLedger(activePairings, selectedPairing).map((item) => (
                  <div key={item.id} className="grid gap-3 py-3 md:grid-cols-[1fr_110px_120px] md:items-center">
                    <div>
                      <p className="font-medium text-stone-100">{item.title}</p>
                      <p className="mt-1 text-sm text-stone-500">{item.detail}</p>
                    </div>
                    <p className="text-sm text-stone-400">{item.date}</p>
                    <StatusPill tone={item.tone}>{item.status}</StatusPill>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel id="notes" className="p-5" title="Notes" eyebrow="Breeder intent">
              <div className="grid gap-4 md:grid-cols-2">
                <NoteBlock label="Pairing goals" value={selectedPairing?.goals} />
                <NoteBlock label="Internal analysis" value={selectedPairing?.internalAnalysis} />
                <NoteBlock label="Sire context" value={sire?.notes ?? sire?.bloodline} />
                <NoteBlock label="Dam context" value={dam?.notes ?? dam?.cycleNotes} />
              </div>
            </Panel>
          </div>
        </main>

        <aside className="space-y-5">
          <Panel className="p-5" title="Breeding Tasks" eyebrow="Reproductive workflow">
            <div className="space-y-3">
              {taskRail.map((task) => (
                <ChecklistTask key={task.id} task={task} />
              ))}
            </div>
          </Panel>

          <Panel className="p-5" title="Upcoming Events" eyebrow="Breeding calendar">
            <div className="space-y-3">
              {calendarRail(pairEvents, milestones).map((event) => (
                <EventRow key={event.id} title={event.title} date={event.date} tone={event.tone} />
              ))}
            </div>
          </Panel>

          <Panel className="p-5" title="Mini Calendar" eyebrow="Month view">
            <MiniCalendar events={pairEvents} milestones={milestones} />
          </Panel>
        </aside>
      </div>
    </div>
  );
}

function PairDogCard({
  dog,
  label,
  side,
  healthCount,
  geneticRecord,
}: {
  dog: Dog | null;
  label: string;
  side: "left" | "right";
  healthCount: number;
  geneticRecord: DogGeneticRecord | null;
}) {
  return (
    <article className="rounded-lg border border-white/[0.08] bg-black/15 p-3">
      <DogPhoto dog={dog} label={label} />
      <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">{label}</p>
          <h3 className="mt-1 text-2xl font-semibold text-stone-50">{dog?.callName ?? `${label} selection`}</h3>
          <p className="mt-1 text-sm text-stone-400">{dog ? `${dog.role} / ${dogAge(dog.dateOfBirth)}` : "Connect a dog record to activate analysis"}</p>
        </div>
        <StatusPill tone={dog ? toneForStatus(dog.status) : "gold"}>{dog?.status ?? "select"}</StatusPill>
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        <MicroMetric label="Health" value={healthCount} tone={healthCount > 0 ? "green" : "gold"} />
        <MicroMetric label="COI" value={geneticRecord?.coiPercent === null || geneticRecord?.coiPercent === undefined ? "Base" : `${geneticRecord.coiPercent}%`} tone={toneForCoi(geneticRecord?.coiPercent ?? null)} />
        <MicroMetric label="Coat" value={dog?.coat ?? "Profile"} tone={side === "left" ? "blue" : "gold"} />
      </div>
    </article>
  );
}

function DogPhoto({ dog, label }: { dog: Dog | null; label: string }) {
  return (
    <div
      className="relative aspect-[16/11] overflow-hidden rounded-md border border-white/[0.08] bg-[radial-gradient(circle_at_30%_20%,rgba(215,173,103,0.26),transparent_34%),linear-gradient(145deg,#1a242d,#0b1117)] bg-cover bg-center shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
      style={dog?.photoUrl ? { backgroundImage: `linear-gradient(180deg,rgba(6,10,14,0.1),rgba(6,10,14,0.42)),url("${dog.photoUrl}")` } : undefined}
      aria-label={dog ? `${dog.callName} ${label} photo` : `${label} premium profile state`}
    >
      {!dog?.photoUrl ? (
        <div className="flex h-full flex-col items-center justify-center text-center">
          <div className="flex size-16 items-center justify-center rounded-full border border-gold/25 bg-gold/10 text-3xl font-semibold text-gold-soft shadow-[0_0_36px_rgba(215,173,103,0.16)]">
            {dog?.callName.slice(0, 1).toUpperCase() ?? label.slice(0, 1)}
          </div>
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">
            {dog ? "Profile image queued" : "Profile selection"}
          </p>
        </div>
      ) : null}
    </div>
  );
}

function CompatibilityCore({ score, coi, sire, dam }: { score: number; coi: number | null; sire: Dog | null; dam: Dog | null }) {
  return (
    <div className="rounded-lg border border-gold/20 bg-[radial-gradient(circle_at_50%_0%,rgba(215,173,103,0.22),transparent_48%),rgba(9,15,21,0.82)] p-5 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Compatibility Score</p>
      <div className="mx-auto mt-5 flex size-44 items-center justify-center rounded-full border border-gold/25 bg-black/20 shadow-[0_0_52px_rgba(215,173,103,0.13)]">
        <div className="flex size-36 flex-col items-center justify-center rounded-full border border-white/[0.08] bg-[#101820]">
          <p className="text-5xl font-semibold tracking-tight text-stone-50">{score}%</p>
          <p className="mt-1 text-xs uppercase tracking-[0.16em] text-stone-500">{breedingStatusLabel(score)}</p>
        </div>
      </div>
      <div className="mt-5 grid gap-2">
        <SignalLine icon={<ShieldCheck className="size-4" />} label="Health compatibility" value={sire && dam ? "Matched" : "Select pair"} tone={sire && dam ? "green" : "gold"} />
        <SignalLine icon={<Target className="size-4" />} label="Genetic balance" value={diversitySignal(sire, dam, coi)} tone={toneForCoi(coi)} />
        <SignalLine icon={<Dna className="size-4" />} label="COI level" value={coiRiskLevel(coi)} tone={toneForCoi(coi)} />
        <SignalLine icon={<Sparkles className="size-4" />} label="Trait considerations" value={traitBalanceLabel(sire, dam)} tone="blue" />
      </div>
    </div>
  );
}

function SignalLine({ icon, label, value, tone }: { icon: ReactNode; label: string; value: string; tone: SignalTone }) {
  const accent = toneClasses(tone);

  return (
    <div className="flex items-center justify-between gap-3 rounded-md border border-white/[0.06] bg-black/15 px-3 py-2.5">
      <span className="flex items-center gap-2 text-sm text-stone-300">
        <span className={accent.text}>{icon}</span>
        {label}
      </span>
      <span className="text-sm font-semibold text-stone-50">{value}</span>
    </div>
  );
}

function TimelineNode({ milestone }: { milestone: TimelineMilestone }) {
  const active = milestone.status === "active";
  const complete = milestone.status === "complete";

  return (
    <div className={active ? "rounded-md border border-gold/30 bg-gold/10 p-3" : "rounded-md border border-white/[0.06] bg-white/[0.025] p-3"}>
      <div className={complete ? "mb-3 flex size-8 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-200" : active ? "mb-3 flex size-8 items-center justify-center rounded-full bg-gold/20 text-gold" : "mb-3 flex size-8 items-center justify-center rounded-full bg-white/[0.05] text-stone-500"}>
        {complete ? <CheckCircle2 className="size-4" /> : <CircleDot className="size-4" />}
      </div>
      <p className="font-medium text-stone-100">{milestone.label}</p>
      <p className="mt-1 text-sm text-stone-500">{formatDate(milestone.date)}</p>
    </div>
  );
}

function IndicatorTile({
  icon,
  label,
  value,
  detail,
  tone,
  id,
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
  detail: string;
  tone: SignalTone;
  id?: string;
}) {
  const accent = toneClasses(tone);

  return (
    <div id={id} className="rounded-md border border-white/[0.06] bg-black/10 p-4">
      <div className="flex items-center justify-between">
        <span className={`${accent.text}`}>{icon}</span>
        <span className={`size-2 rounded-full ${accent.solid}`} />
      </div>
      <p className="mt-4 text-2xl font-semibold text-stone-50">{value}</p>
      <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">{label}</p>
      <p className="mt-2 text-sm leading-5 text-stone-400">{detail}</p>
    </div>
  );
}

function ProjectionCard({ puppy }: { puppy: PuppyProjection }) {
  return (
    <article className="min-w-[210px] rounded-md border border-white/[0.07] bg-white/[0.025] p-4">
      <div className="mb-4 flex items-center justify-between">
        <span className="flex size-10 items-center justify-center rounded-full border border-gold/20 bg-gold/10 text-sm font-semibold text-gold">
          {puppy.label.slice(-1)}
        </span>
        <StatusPill tone="blue">{puppy.sex}</StatusPill>
      </div>
      <p className="font-semibold text-stone-50">{puppy.label}</p>
      <div className="mt-3 space-y-2">
        <TraitLine label="Color" value={puppy.color} />
        <TraitLine label="Coat" value={puppy.coat} />
        <TraitLine label="Trait" value={puppy.trait} />
      </div>
    </article>
  );
}

function TraitLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-white/[0.06] pb-2 text-sm last:border-0 last:pb-0">
      <span className="text-stone-500">{label}</span>
      <span className="text-right text-stone-200">{value}</span>
    </div>
  );
}

function NoteBlock({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="rounded-md border border-white/[0.06] bg-white/[0.025] p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">{label}</p>
      <p className="mt-2 text-sm leading-6 text-stone-300">{displayText(value)}</p>
    </div>
  );
}

function ChecklistTask({
  task,
}: {
  task: {
    id: string;
    title: string;
    meta: string;
    status: string;
    tone: SignalTone;
    icon: ReactNode;
  };
}) {
  const accent = toneClasses(task.tone);

  return (
    <div className="rounded-md border border-white/[0.06] bg-white/[0.025] p-3">
      <div className="flex items-start gap-3">
        <span className={`flex size-9 shrink-0 items-center justify-center rounded-md border ${accent.border} ${accent.bg} ${accent.text}`}>
          {task.icon}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <p className="font-medium text-stone-100">{task.title}</p>
            <StatusPill tone={task.tone}>{task.status}</StatusPill>
          </div>
          <p className="mt-1 text-sm text-stone-500">{task.meta}</p>
        </div>
      </div>
    </div>
  );
}

function EventRow({ title, date, tone }: { title: string; date: string | null; tone: SignalTone }) {
  const accent = toneClasses(tone);

  return (
    <div className="flex items-center gap-3 rounded-md border border-white/[0.06] bg-black/10 p-3">
      <span className={`flex size-8 items-center justify-center rounded-full ${accent.bg} ${accent.text}`}>
        <CalendarDays className="size-4" />
      </span>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-stone-100">{title}</p>
        <p className="text-xs text-stone-500">{formatDate(date)}</p>
      </div>
    </div>
  );
}

function MiniCalendar({ events, milestones }: { events: BreederEvent[]; milestones: TimelineMilestone[] }) {
  const today = new Date();
  const monthLabel = new Intl.DateTimeFormat("en", { month: "long", year: "numeric" }).format(today);
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const eventDays = new Set(
    [
      ...events.map((event) => event.eventDate),
      ...milestones.map((milestone) => milestone.date).filter(Boolean),
    ]
      .map((value) => new Date(`${value}T00:00:00`))
      .filter((date) => date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear())
      .map((date) => date.getDate()),
  );
  const days = Array.from({ length: daysInMonth }, (_, index) => index + 1);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="font-semibold text-stone-100">{monthLabel}</p>
        <CalendarDays className="size-4 text-gold" />
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {days.map((day) => (
          <span
            key={day}
            className={eventDays.has(day) ? "rounded-md bg-gold/20 px-1.5 py-2 font-semibold text-gold" : "rounded-md bg-white/[0.025] px-1.5 py-2 text-stone-500"}
          >
            {day}
          </span>
        ))}
      </div>
    </div>
  );
}

function MicroMetric({ label, value, tone }: { label: string; value: ReactNode; tone: SignalTone }) {
  const accent = toneClasses(tone);

  return (
    <div className="rounded-md border border-white/[0.06] bg-black/10 p-3">
      <p className={`text-sm font-semibold ${accent.text}`}>{value}</p>
      <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-stone-500">{label}</p>
    </div>
  );
}

function activeBreedingLedger(activePairings: BreedingPair[], selectedPairing: BreedingPair | null) {
  const source = activePairings.length > 0 ? activePairings : selectedPairing ? [selectedPairing] : [];

  if (source.length > 0) {
    return source.slice(0, 4).map((pairing) => ({
      id: pairing.id,
      title: pairing.pairingName ?? "Breeding review",
      detail: pairing.breedingMethod ?? "Breeder method review",
      date: formatDate(pairing.plannedStart ?? pairing.createdAt.slice(0, 10)),
      status: pairing.status,
      tone: toneForStatus(pairing.status) as SignalTone,
    }));
  }

  return [
    {
      id: "ledger-sire-dam",
      title: "Sire and dam pairing setup",
      detail: "Pair records connect goals, dates, health context, and genetic analysis.",
      date: "Ready",
      status: "setup",
      tone: "gold" as SignalTone,
    },
  ];
}

function buildTaskRail(tasks: BreederTask[], pairing: BreedingPair | null, litter: Litter | null) {
  const required = [
    {
      id: "lh-tests",
      title: "LH Test",
      meta: pairing?.plannedStart ? `Start ${formatDate(pairing.plannedStart)}` : "Align with heat watch",
      status: "queued",
      tone: "gold" as SignalTone,
      icon: <FlaskConical className="size-4" />,
    },
    {
      id: "progesterone",
      title: "Progesterone Test",
      meta: pairing?.plannedStart ? `Window ${formatDate(pairing.plannedStart)}` : "Schedule with ovulation timing",
      status: "active",
      tone: "blue" as SignalTone,
      icon: <Microscope className="size-4" />,
    },
    {
      id: "ultrasound",
      title: "Ultrasound",
      meta: litter?.confirmationDate ? formatDate(litter.confirmationDate) : "Plan 28 days post breeding",
      status: "planned",
      tone: "green" as SignalTone,
      icon: <HeartPulse className="size-4" />,
    },
    {
      id: "whelp-prep",
      title: "Prepare whelping area",
      meta: litter?.dueDate ? `Target ${formatDate(litter.dueDate)}` : "Prepare box, supplies, and watch schedule",
      status: "ready",
      tone: "gold" as SignalTone,
      icon: <ClipboardCheck className="size-4" />,
    },
  ];

  const operational = tasks.slice(0, 2).map((task) => ({
    id: task.id,
    title: task.title,
    meta: `${formatDate(task.dueDate)} / ${task.priority}`,
    status: task.status,
    tone: (task.priority === "urgent" ? "red" : task.priority === "high" ? "gold" : "blue") as SignalTone,
    icon: <Timer className="size-4" />,
  }));

  return [...operational, ...required].slice(0, 6);
}

function calendarRail(events: BreederEvent[], milestones: TimelineMilestone[]) {
  const eventRows = events.slice(0, 4).map((event) => ({
    id: event.id,
    title: event.title,
    date: event.eventDate,
    tone: toneForStatus(event.status) as SignalTone,
  }));

  if (eventRows.length > 0) {
    return eventRows;
  }

  return milestones.slice(0, 4).map((milestone) => ({
    id: `milestone-${milestone.label}`,
    title: milestone.label,
    date: milestone.date,
    tone: (milestone.status === "complete" ? "green" : milestone.status === "active" ? "gold" : "blue") as SignalTone,
  }));
}

function buildTimeline(pairing: BreedingPair | null, litter: Litter | null): TimelineMilestone[] {
  const heatDate = pairing?.plannedStart ? addDays(pairing.plannedStart, -5) : null;
  const ovulationDate = pairing?.plannedStart ?? null;
  const breedingDate = pairing?.plannedEnd ?? litter?.breedingDate ?? null;
  const pregnancyDate = litter?.confirmationDate ?? (breedingDate ? addDays(breedingDate, 28) : null);
  const whelpingDate = litter?.whelpDate ?? litter?.dueDate ?? (breedingDate ? addDays(breedingDate, 63) : null);
  const weaningDate = litter?.whelpDate ? addDays(litter.whelpDate, 56) : whelpingDate ? addDays(whelpingDate, 56) : null;

  const dates = [heatDate, ovulationDate, breedingDate, pregnancyDate, whelpingDate, weaningDate];
  const activeIndex = dates.findIndex((date) => date && new Date(`${date}T00:00:00`) >= startOfToday());

  return [
    { label: "Heat", date: heatDate, status: milestoneStatus(0, activeIndex, heatDate) },
    { label: "Ovulation", date: ovulationDate, status: milestoneStatus(1, activeIndex, ovulationDate) },
    { label: "Breeding", date: breedingDate, status: milestoneStatus(2, activeIndex, breedingDate) },
    { label: "Pregnancy", date: pregnancyDate, status: milestoneStatus(3, activeIndex, pregnancyDate) },
    { label: "Whelping", date: whelpingDate, status: milestoneStatus(4, activeIndex, whelpingDate) },
    { label: "Weaning", date: weaningDate, status: milestoneStatus(5, activeIndex, weaningDate) },
  ];
}

function milestoneStatus(index: number, activeIndex: number, date: string | null): TimelineMilestone["status"] {
  if (!date) {
    return "queued";
  }

  if (activeIndex === -1) {
    return index === 5 ? "active" : "complete";
  }

  if (index < activeIndex) {
    return "complete";
  }

  return index === activeIndex ? "active" : "queued";
}

function buildPuppyProjections(
  pairing: BreedingPair | null,
  litter: Litter | null,
  puppies: Puppy[],
  sire: Dog | null,
  dam: Dog | null,
): PuppyProjection[] {
  if (puppies.length > 0) {
    return puppies.slice(0, 8).map((puppy, index) => ({
      id: puppy.id,
      label: puppy.callName ?? puppy.puppyName ?? `Puppy ${index + 1}`,
      sex: puppy.sex ?? (index % 2 === 0 ? "Female" : "Male"),
      color: puppy.color ?? colorProjection(sire, dam),
      coat: puppy.coat ?? coatProjection(sire, dam),
      trait: puppy.retained ? "Retain candidate" : "Placement review",
    }));
  }

  const count = parseExpectedSize(pairing?.expectedLitterSize ?? litter?.expectedSize) ?? 6;
  const colors = splitTraitValues(pairing?.colorCoatSummary ?? colorProjection(sire, dam));
  const coats = splitTraitValues(coatProjection(sire, dam));
  const traits = ["Balanced drive", "Show prospect", "Companion match", "Working aptitude", "Strong pigment", "Calm handler focus"];

  return Array.from({ length: Math.min(count, 8) }, (_, index) => ({
    id: `projection-${index + 1}`,
    label: `Projection ${String.fromCharCode(65 + index)}`,
    sex: index % 2 === 0 ? "Female" : "Male",
    color: colors[index % colors.length],
    coat: coats[index % coats.length],
    trait: traits[index % traits.length],
  }));
}

function calculateCompatibilityScore({
  selectedPairing,
  sire,
  dam,
  sireHealth,
  damHealth,
  sireGenetic,
  damGenetic,
  relatedLitter,
}: {
  selectedPairing: BreedingPair | null;
  sire: Dog | null;
  dam: Dog | null;
  sireHealth: DogHealthRecord[];
  damHealth: DogHealthRecord[];
  sireGenetic: DogGeneticRecord | null;
  damGenetic: DogGeneticRecord | null;
  relatedLitter: Litter | null;
}) {
  let score = 42;

  if (sire) score += 8;
  if (dam) score += 8;
  if (selectedPairing) score += 8;
  if (sireHealth.length > 0) score += 8;
  if (damHealth.length > 0) score += 8;
  if (sireGenetic) score += 7;
  if (damGenetic) score += 7;
  if (relatedLitter) score += 5;

  const coi = calculateCoi(sireGenetic, damGenetic);
  if (coi !== null && coi > 12) score -= 10;
  if (coi !== null && coi <= 6) score += 4;

  return Math.max(1, Math.min(96, score));
}

function resolveSire(dogs: Dog[], pairing: BreedingPair | null) {
  return (
    (pairing ? findDog(dogs, pairing.sireId) : null) ??
    dogs.find((dog) => dog.role.toLowerCase() === "sire") ??
    dogs.find((dog) => dog.sex?.toLowerCase() === "male") ??
    dogs[0] ??
    null
  );
}

function resolveDam(dogs: Dog[], pairing: BreedingPair | null, sireId: string | null) {
  return (
    (pairing ? findDog(dogs, pairing.damId) : null) ??
    dogs.find((dog) => dog.role.toLowerCase() === "dam" && dog.id !== sireId) ??
    dogs.find((dog) => dog.sex?.toLowerCase() === "female" && dog.id !== sireId) ??
    dogs.find((dog) => dog.id !== sireId) ??
    null
  );
}

function resolveLitter(litters: Litter[], pairing: BreedingPair | null, dam: Dog | null, sire: Dog | null) {
  return (
    (pairing ? litters.find((litter) => litter.pairingId === pairing.id) : null) ??
    litters.find((litter) => litter.damId === dam?.id || litter.sireId === sire?.id) ??
    litters[0] ??
    null
  );
}

function resolvePairTasks(tasks: BreederTask[], pairing: BreedingPair | null) {
  const linked = pairing
    ? tasks.filter((task) => task.relatedId === pairing.id || task.relatedType === "breeding")
    : tasks.filter((task) => task.relatedType === "breeding");

  return linked.length > 0 ? linked : tasks;
}

function resolvePairEvents(events: BreederEvent[], pairing: BreedingPair | null) {
  const linked = pairing
    ? events.filter((event) => event.relatedId === pairing.id || event.relatedType === "breeding")
    : events.filter((event) => event.relatedType === "breeding");

  return linked.length > 0 ? linked : events;
}

function recordsForDog<T extends { dogId: string }>(records: T[], dogId: string | null | undefined) {
  return dogId ? records.filter((record) => record.dogId === dogId) : [];
}

function latestGeneticRecord(records: DogGeneticRecord[], dogId: string | null | undefined) {
  return dogId ? records.find((record) => record.dogId === dogId) ?? null : null;
}

function findDog(dogs: Dog[], dogId: string | null) {
  return dogs.find((dog) => dog.id === dogId) ?? null;
}

function calculateCoi(sireRecord: DogGeneticRecord | null, damRecord: DogGeneticRecord | null) {
  const values = [sireRecord?.coiPercent, damRecord?.coiPercent].filter(
    (value): value is number => typeof value === "number",
  );

  if (values.length === 0) {
    return null;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function coiRiskLevel(coi: number | null) {
  if (coi === null) return "Moderate";
  if (coi <= 6) return "Low";
  if (coi <= 12) return "Moderate";
  return "High";
}

function toneForCoi(coi: number | null): SignalTone {
  if (coi === null) return "gold";
  if (coi <= 6) return "green";
  if (coi <= 12) return "gold";
  return "red";
}

function riskDetail(coi: number | null) {
  if (coi === null) return "Pairing score uses available pedigree and genetic records";
  if (coi <= 6) return "Pedigree overlap is within preferred planning range";
  if (coi <= 12) return "Breeder review should confirm line concentration";
  return "Line concentration requires focused breeder review";
}

function healthCompatibilityLabel(sireHealth: DogHealthRecord[], damHealth: DogHealthRecord[]) {
  if (sireHealth.length > 0 && damHealth.length > 0) return "Matched";
  if (sireHealth.length > 0 || damHealth.length > 0) return "Partial";
  return "Build matrix";
}

function healthCompatibilityTone(sireHealth: DogHealthRecord[], damHealth: DogHealthRecord[]): SignalTone {
  if (sireHealth.length > 0 && damHealth.length > 0) return "green";
  if (sireHealth.length > 0 || damHealth.length > 0) return "gold";
  return "blue";
}

function traitBalanceLabel(sire: Dog | null, dam: Dog | null) {
  if (sire?.color && dam?.color && sire.color !== dam.color) return "Balanced";
  if (sire?.color && dam?.color) return "Consistent";
  return "Review required";
}

function traitBalanceDetail(sire: Dog | null, dam: Dog | null) {
  const sireTrait = sire?.color ?? sire?.coat ?? sire?.bloodline ?? "sire profile";
  const damTrait = dam?.color ?? dam?.coat ?? dam?.bloodline ?? "dam profile";
  return `${sireTrait} x ${damTrait}`;
}

function diversitySignal(sire: Dog | null, dam: Dog | null, coi: number | null) {
  if (coi !== null && coi <= 6) return "Strong";
  if (sire?.bloodline && dam?.bloodline && sire.bloodline !== dam.bloodline) return "Broad";
  if (coi !== null && coi > 12) return "Focused";
  return "Balanced";
}

function colorProjection(sire: Dog | null, dam: Dog | null) {
  const colors = [sire?.color, dam?.color].filter(Boolean);
  return colors.length > 0 ? Array.from(new Set(colors)).join(" / ") : "Color profile";
}

function coatProjection(sire: Dog | null, dam: Dog | null) {
  const coats = [sire?.coat, dam?.coat].filter(Boolean);
  return coats.length > 0 ? Array.from(new Set(coats)).join(" / ") : "Coat profile";
}

function reservationLabel(pairing: BreedingPair | null, litter: Litter | null) {
  const value = pairing?.reservationGoal ?? litter?.reservationGoal;
  return typeof value === "number" ? `${value} reservation targets` : "Reservation target";
}

function projectionSizeLabel(count: number) {
  return `${count} projected puppies`;
}

function parseExpectedSize(value: string | null | undefined) {
  if (!value) return null;
  const match = value.match(/\d+/);
  return match ? Number(match[0]) : null;
}

function splitTraitValues(value: string) {
  const parts = value
    .split(/[\/,]/)
    .map((part) => part.trim())
    .filter(Boolean);

  return parts.length > 0 ? parts : [value];
}

function pairEngineTitle(sire: Dog | null, dam: Dog | null) {
  if (sire && dam) return `${sire.callName} x ${dam.callName}`;
  if (sire) return `${sire.callName} pairing setup`;
  if (dam) return `${dam.callName} pairing setup`;
  return "Pairing setup";
}

function breedingStatusLabel(score: number) {
  if (score >= 88) return "Excellent Match";
  if (score >= 72) return "Good Match";
  return "Review Required";
}

function addDays(value: string, days: number) {
  const date = new Date(`${value}T00:00:00`);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function startOfToday() {
  const today = new Date();
  return new Date(today.getFullYear(), today.getMonth(), today.getDate());
}

function toneClasses(tone: SignalTone) {
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
