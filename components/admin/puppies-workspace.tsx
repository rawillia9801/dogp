import type { ReactNode } from "react";
import { BadgeDollarSign, BellRing, CalendarClock, Eye, MailCheck, PawPrint, Search, ShieldCheck } from "lucide-react";
import type { AutomationWorkspaceData } from "@/lib/automation-data";
import type { BreederWorkspaceData } from "@/lib/breeder-data";
import type { Puppy } from "@/types";
import {
  EmptyState,
  FieldRow,
  Panel,
  RosterSearch,
  StatusPill,
  WorkspaceHeader,
  displayText,
  formatDate,
  money,
  toneForStatus,
} from "@/components/admin/workspace-ui";
import { compactDate } from "@/components/admin/business-ui";

export function PuppiesWorkspace({
  data,
  automation,
}: {
  data: BreederWorkspaceData;
  automation?: AutomationWorkspaceData;
}) {
  const selectedPuppy = data.puppies[0] ?? null;
  const litter = selectedPuppy
    ? data.litters.find((record) => record.id === selectedPuppy.litterId) ?? null
    : null;
  const dam = litter ? data.dogs.find((dog) => dog.id === litter.damId) : null;
  const sire = litter ? data.dogs.find((dog) => dog.id === litter.sireId) : null;
  const puppyNoticeLogs = selectedPuppy && automation
    ? automation.logs.filter((log) => log.puppyId === selectedPuppy.id || (log.relatedType === "puppy" && log.relatedId === selectedPuppy.id))
    : [];
  const nextMilestoneNotice = puppyNoticeLogs.find((log) => ["scheduled", "queued"].includes(log.deliveryStatus)) ?? null;

  return (
    <div>
      <WorkspaceHeader
        eyebrow="Puppy roster"
        title="Puppies"
        description="A polished workspace for puppy records, litter context, readiness details, visibility status, and breeder notes."
        actions={
          <button className="inline-flex h-10 items-center gap-2 rounded-md border border-gold/30 bg-gold/10 px-4 text-sm font-semibold text-gold-soft">
            <Search className="size-4" />
            Review Puppies
          </button>
        }
      />

      <div className="mt-8 grid gap-5 xl:grid-cols-[320px_1fr_300px]">
        <Panel className="p-4" title="Puppy Roster" eyebrow="Active records">
          <RosterSearch label="Find records" searchLabel="Search puppies" />
          <div className="mt-4 space-y-2">
            {data.puppies.length > 0 ? (
              data.puppies.map((puppy) => (
                <PuppyRosterRow
                  key={puppy.id}
                  puppy={puppy}
                  selected={selectedPuppy?.id === puppy.id}
                  litterName={data.litters.find((record) => record.id === puppy.litterId)?.litterName ?? null}
                />
              ))
            ) : (
              <EmptyState
                title="Build the puppy pipeline"
                body="Add puppy records to track litter context, status, color, coat, pricing, visibility, and placement details."
              />
            )}
          </div>
        </Panel>

        <main className="space-y-5">
          {selectedPuppy ? (
            <>
              <Panel className="p-5">
                <div className="flex flex-col gap-5 lg:flex-row">
                  <PuppyPortrait puppy={selectedPuppy} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
                          Selected puppy
                        </p>
                        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-stone-50">
                          {selectedPuppy.callName ?? selectedPuppy.puppyName ?? "Puppy record"}
                        </h2>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-400">
                          {displayText(selectedPuppy.description)}
                        </p>
                      </div>
                      <StatusPill tone={toneForStatus(selectedPuppy.status)}>
                        {selectedPuppy.status}
                      </StatusPill>
                    </div>
                    <div className="mt-5 grid gap-x-8 gap-y-1 md:grid-cols-2">
                      <FieldRow label="Litter" value={litter?.litterName ?? null} />
                      <FieldRow label="DOB" value={formatDate(selectedPuppy.dateOfBirth)} />
                      <FieldRow label="Sex" value={selectedPuppy.sex} />
                      <FieldRow label="Color" value={selectedPuppy.color} />
                      <FieldRow label="Coat" value={selectedPuppy.coat} />
                      <FieldRow label="Retained" value={selectedPuppy.retained ? "Retained" : "Placement"} />
                    </div>
                  </div>
                </div>
              </Panel>

              <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
                <Panel className="p-5" title="Litter Context" eyebrow="Family record">
                  <FieldRow label="Litter" value={litter?.litterName ?? null} />
                  <FieldRow label="Dam" value={dam?.callName ?? null} />
                  <FieldRow label="Sire" value={sire?.callName ?? null} />
                  <FieldRow label="Whelp date" value={formatDate(litter?.whelpDate ?? null)} />
                </Panel>

                <Panel className="p-5" title="Care and Readiness" eyebrow="Operational state">
                  <ReadinessLine icon={<ShieldCheck className="size-4" />} label="Status" value={selectedPuppy.status} />
                  <ReadinessLine icon={<Eye className="size-4" />} label="Public visibility" value={selectedPuppy.publicVisible ? "Visible" : "Hidden"} />
                  <ReadinessLine icon={<Eye className="size-4" />} label="Portal visibility" value={selectedPuppy.portalVisible ? "Visible" : "Hidden"} />
                  <ReadinessLine icon={<PawPrint className="size-4" />} label="Program retention" value={selectedPuppy.retained ? "Retained" : "Not retained"} />
                </Panel>
              </div>

              <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
                <Panel className="p-5" title="Pricing" eyebrow="Sale context">
                  <FieldRow label="Price" value={money(selectedPuppy.price)} />
                  <FieldRow label="Deposit" value={money(selectedPuppy.deposit)} />
                  <FieldRow label="Balance" value={money(selectedPuppy.balance)} />
                </Panel>

                <Panel className="p-5" title="Breeder Notes" eyebrow="Internal record">
                  {selectedPuppy.notes ? (
                    <p className="text-sm leading-6 text-stone-300">{selectedPuppy.notes}</p>
                  ) : (
                    <EmptyState
                      title="Add placement notes"
                      body="Capture temperament, care observations, buyer fit, and internal placement context for this puppy."
                    />
                  )}
                </Panel>
              </div>
            </>
          ) : (
            <Panel className="p-6">
              <EmptyState
                title="Select a puppy record"
                body="Open a puppy to review litter context, readiness status, pricing, visibility, photos, and notes."
              />
            </Panel>
          )}
        </main>

        <aside className="space-y-5">
          <Panel className="p-5" title="Roster Summary" eyebrow="Puppy state">
            <SideLine icon={<PawPrint className="size-4" />} label="Puppies" value={data.puppies.length} />
            <SideLine icon={<ShieldCheck className="size-4" />} label="Retained" value={data.puppies.filter((puppy) => puppy.retained).length} />
            <SideLine icon={<Eye className="size-4" />} label="Portal visible" value={data.puppies.filter((puppy) => puppy.portalVisible).length} />
            <SideLine icon={<BadgeDollarSign className="size-4" />} label="Priced" value={data.puppies.filter((puppy) => puppy.price !== null).length} />
          </Panel>

          <Panel className="p-5" title="Milestone Notices" eyebrow="Buyer updates">
            <NoticeLine icon={<BellRing className="size-4" />} label="Automation" value={automation?.settings?.puppyMilestoneNoticesEnabled === false ? "Paused" : "Active"} />
            <NoticeLine icon={<CalendarClock className="size-4" />} label="Next update" value={nextMilestoneNotice?.scheduledAt ? compactDate(nextMilestoneNotice.scheduledAt) : selectedPuppy?.dateOfBirth ? milestoneDate(selectedPuppy.dateOfBirth, 42) : "Schedule ready"} />
            <NoticeLine icon={<MailCheck className="size-4" />} label="History" value={`${puppyNoticeLogs.length} notices`} />
          </Panel>
        </aside>
      </div>
    </div>
  );
}

function PuppyRosterRow({
  puppy,
  selected,
  litterName,
}: {
  puppy: Puppy;
  selected: boolean;
  litterName: string | null;
}) {
  const name = puppy.callName ?? puppy.puppyName ?? "Puppy record";

  return (
    <div className={selected ? "rounded-md border border-gold/30 bg-gold/10 p-3" : "rounded-md border border-white/[0.06] bg-white/[0.025] p-3"}>
      <div className="flex items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-gold/20 bg-gold/10 text-sm font-semibold text-gold">
          {name.slice(0, 1).toUpperCase()}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-stone-100">{name}</p>
          <p className="truncate text-xs text-stone-500">{litterName ?? "Litter link ready"}</p>
        </div>
        <StatusPill tone={toneForStatus(puppy.status)}>{puppy.status}</StatusPill>
      </div>
    </div>
  );
}

function PuppyPortrait({ puppy }: { puppy: Puppy }) {
  const name = puppy.callName ?? puppy.puppyName ?? "P";

  return (
    <div
      className="min-h-48 w-full rounded-lg border border-white/[0.08] bg-[radial-gradient(circle_at_30%_20%,rgba(215,173,103,0.22),transparent_34%),linear-gradient(145deg,#171f27,#0d1319)] bg-cover bg-center lg:w-56"
      style={puppy.photoUrl ? { backgroundImage: `url("${puppy.photoUrl}")` } : undefined}
    >
      {!puppy.photoUrl ? (
        <div className="flex h-full min-h-48 items-center justify-center text-5xl font-semibold text-gold/60">
          {name.slice(0, 1).toUpperCase()}
        </div>
      ) : null}
    </div>
  );
}

function ReadinessLine({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between border-b border-white/[0.06] py-3 last:border-0">
      <span className="flex items-center gap-2 text-sm text-stone-300">
        <span className="text-gold">{icon}</span>
        {label}
      </span>
      <span className="text-sm font-semibold text-stone-50">{value}</span>
    </div>
  );
}

function SideLine({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center justify-between border-b border-white/[0.06] py-3 last:border-0">
      <span className="flex items-center gap-2 text-sm text-stone-300">
        <span className="text-gold">{icon}</span>
        {label}
      </span>
      <span className="font-semibold text-stone-50">{value}</span>
    </div>
  );
}

function NoticeLine({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-white/[0.06] py-3 last:border-0">
      <span className="flex items-center gap-2 text-sm text-stone-300">
        <span className="text-gold">{icon}</span>
        {label}
      </span>
      <span className="text-sm font-semibold text-stone-50">{value}</span>
    </div>
  );
}

function milestoneDate(dateOfBirth: string, days: number) {
  const date = new Date(`${dateOfBirth}T00:00:00`);
  date.setDate(date.getDate() + days);
  return compactDate(date.toISOString());
}
