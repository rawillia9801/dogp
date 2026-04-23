import type { ReactNode } from "react";
import { CalendarDays, PawPrint, Search } from "lucide-react";
import type { BreederWorkspaceData } from "@/lib/breeder-data";
import type { Litter } from "@/types";
import {
  EmptyState,
  FieldRow,
  Panel,
  RosterSearch,
  StatusPill,
  WorkspaceHeader,
  displayText,
  formatDate,
  toneForStatus,
} from "@/components/admin/workspace-ui";

export function LittersWorkspace({ data }: { data: BreederWorkspaceData }) {
  const selectedLitter = data.litters[0] ?? null;
  const dam = selectedLitter ? data.dogs.find((dog) => dog.id === selectedLitter.damId) : null;
  const sire = selectedLitter ? data.dogs.find((dog) => dog.id === selectedLitter.sireId) : null;
  const puppies = selectedLitter
    ? data.puppies.filter((puppy) => puppy.litterId === selectedLitter.id)
    : [];

  return (
    <div>
      <WorkspaceHeader
        eyebrow="Litter operations"
        title="Litters"
        description="A structured workspace for litter records, parent linkage, timeline milestones, puppy roster context, and breeder notes."
        actions={
          <button className="inline-flex h-10 items-center gap-2 rounded-md border border-gold/30 bg-gold/10 px-4 text-sm font-semibold text-gold-soft">
            <Search className="size-4" />
            Review Litters
          </button>
        }
      />

      <div className="mt-8 grid gap-5 xl:grid-cols-[320px_1fr]">
        <Panel className="p-4" title="Litter Roster" eyebrow="Program litters">
          <RosterSearch label="Find records" searchLabel="Search litters" />
          <div className="mt-4 space-y-2">
            {data.litters.length > 0 ? (
              data.litters.map((litter) => (
                <LitterRosterRow
                  key={litter.id}
                  litter={litter}
                  selected={selectedLitter?.id === litter.id}
                  puppyCount={data.puppies.filter((puppy) => puppy.litterId === litter.id).length}
                />
              ))
            ) : (
              <EmptyState
                title="Create the litter ledger"
                body="Add planned and active litters so parent linkage, dates, puppy counts, and status stay organized."
              />
            )}
          </div>
        </Panel>

        <main className="space-y-5">
          {selectedLitter ? (
            <>
              <Panel className="p-5">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
                      Selected litter
                    </p>
                    <h2 className="mt-2 text-3xl font-semibold tracking-tight text-stone-50">
                      {selectedLitter.litterName}
                    </h2>
                    <p className="mt-3 max-w-3xl text-sm leading-6 text-stone-400">
                      {displayText(selectedLitter.notes)}
                    </p>
                  </div>
                  <StatusPill tone={toneForStatus(selectedLitter.status)}>
                    {selectedLitter.status}
                  </StatusPill>
                </div>
                <div className="mt-5 grid gap-x-8 gap-y-1 md:grid-cols-2">
                  <FieldRow label="Dam" value={dam?.callName ?? null} />
                  <FieldRow label="Sire" value={sire?.callName ?? null} />
                  <FieldRow label="Expected size" value={selectedLitter.expectedSize} />
                  <FieldRow label="Reservation goal" value={selectedLitter.reservationGoal} />
                </div>
              </Panel>

              <Panel className="p-5" title="Timeline and Milestones" eyebrow="Breeding sequence">
                <div className="grid gap-3 md:grid-cols-4">
                  <Milestone label="Bred" date={selectedLitter.breedingDate} />
                  <Milestone label="Confirmed" date={selectedLitter.confirmationDate} />
                  <Milestone label="Due" date={selectedLitter.dueDate} />
                  <Milestone label="Whelped" date={selectedLitter.whelpDate} />
                </div>
              </Panel>

              <div className="grid gap-5 xl:grid-cols-[1fr_300px]">
                <Panel className="p-5" title="Puppies in Litter" eyebrow="Roster context">
                  {puppies.length > 0 ? (
                    <div className="divide-y divide-white/[0.06]">
                      {puppies.map((puppy) => (
                        <div key={puppy.id} className="grid gap-3 py-3 md:grid-cols-[1fr_120px_120px] md:items-center">
                          <div className="flex items-center gap-3">
                            <span className="flex size-9 items-center justify-center rounded-full border border-gold/20 bg-gold/10 text-sm font-semibold text-gold">
                              {(puppy.callName ?? puppy.puppyName ?? "P").slice(0, 1).toUpperCase()}
                            </span>
                            <div>
                              <p className="font-medium text-stone-100">
                                {puppy.callName ?? puppy.puppyName ?? "Puppy record"}
                              </p>
                              <p className="text-xs text-stone-500">{displayText(puppy.color)} / {displayText(puppy.coat)}</p>
                            </div>
                          </div>
                          <p className="text-sm text-stone-300">{displayText(puppy.sex)}</p>
                          <StatusPill tone={toneForStatus(puppy.status)}>{puppy.status}</StatusPill>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      title="Attach puppy records"
                      body="Connect puppies to this litter to track status, color, coat, readiness, and placement details."
                    />
                  )}
                </Panel>

                <Panel className="p-5" title="Litter Summary" eyebrow="Program context">
                  <SummaryLine icon={<PawPrint className="size-4" />} label="Puppies" value={puppies.length} />
                  <SummaryLine icon={<CalendarDays className="size-4" />} label="Due date" value={formatDate(selectedLitter.dueDate)} />
                  <SummaryLine icon={<CalendarDays className="size-4" />} label="Whelp date" value={formatDate(selectedLitter.whelpDate)} />
                </Panel>
              </div>
            </>
          ) : (
            <Panel className="p-6">
              <EmptyState
                title="Select a litter record"
                body="Open a litter to review parent linkage, planned dates, whelping outcomes, puppy rosters, and notes."
              />
            </Panel>
          )}
        </main>
      </div>
    </div>
  );
}

function LitterRosterRow({
  litter,
  selected,
  puppyCount,
}: {
  litter: Litter;
  selected: boolean;
  puppyCount: number;
}) {
  return (
    <div className={selected ? "rounded-md border border-gold/30 bg-gold/10 p-3" : "rounded-md border border-white/[0.06] bg-white/[0.025] p-3"}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-medium text-stone-100">{litter.litterName}</p>
          <p className="mt-1 text-xs text-stone-500">{formatDate(litter.dueDate ?? litter.whelpDate)}</p>
        </div>
        <StatusPill tone={toneForStatus(litter.status)}>{litter.status}</StatusPill>
      </div>
      <p className="mt-3 text-xs uppercase tracking-[0.16em] text-stone-500">{puppyCount} puppies</p>
    </div>
  );
}

function Milestone({ label, date }: { label: string; date: string | null }) {
  return (
    <div className="rounded-md border border-white/[0.06] bg-white/[0.025] p-4">
      <CalendarDays className="mb-3 size-4 text-gold" />
      <p className="font-medium text-stone-100">{label}</p>
      <p className="mt-1 text-sm text-stone-500">{formatDate(date)}</p>
    </div>
  );
}

function SummaryLine({
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
