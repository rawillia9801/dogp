import type { ReactNode } from "react";
import { Dna, HeartPulse, PawPrint, Search, ShieldCheck } from "lucide-react";
import type { BreederWorkspaceData } from "@/lib/breeder-data";
import type { Dog } from "@/types";
import {
  EmptyState,
  FieldRow,
  Panel,
  RosterSearch,
  StatusPill,
  WorkspaceHeader,
  displayText,
  dogAge,
  formatDate,
  toneForStatus,
} from "@/components/admin/workspace-ui";

export function DogsWorkspace({ data }: { data: BreederWorkspaceData }) {
  const selectedDog = data.dogs[0] ?? null;
  const healthRecords = selectedDog
    ? data.healthRecords.filter((record) => record.dogId === selectedDog.id)
    : [];
  const geneticRecords = selectedDog
    ? data.geneticRecords.filter((record) => record.dogId === selectedDog.id)
    : [];
  const litters = selectedDog
    ? data.litters.filter((litter) => litter.damId === selectedDog.id || litter.sireId === selectedDog.id)
    : [];
  const offspring = data.puppies.filter((puppy) =>
    litters.some((litter) => litter.id === puppy.litterId),
  );

  return (
    <div>
      <WorkspaceHeader
        eyebrow="Dog records"
        title="Dogs"
        description="Manage your breeding dogs and their records."
        actions={
          <button className="inline-flex h-10 items-center gap-2 rounded-md border border-gold/30 bg-gold/10 px-4 text-sm font-semibold text-gold-soft">
            <Search className="size-4" />
            Review Roster
          </button>
        }
      />

      <div className="mt-8 grid gap-5 xl:grid-cols-[320px_1fr_300px]">
        <Panel className="p-4" title="Dog roster list" eyebrow="Program list">
          <RosterSearch label="Find records" searchLabel="Search dogs" />
          <div className="mt-4 space-y-2">
            {data.dogs.length > 0 ? (
              data.dogs.map((dog) => (
                <DogRosterRow key={dog.id} dog={dog} selected={selectedDog?.id === dog.id} />
              ))
            ) : (
              <EmptyState
                title="No dogs added yet. Add your first dog to begin your program."
                body="Add breeding dogs, then record health, genetics, litters, offspring, and notes."
              />
            )}
          </div>
        </Panel>

        <main className="space-y-5">
          {selectedDog ? (
            <>
              <Panel className="p-5" title="Selected dog profile" eyebrow="Overview">
                <div className="flex flex-col gap-5 lg:flex-row">
                  <DogPortrait dog={selectedDog} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h2 className="text-3xl font-semibold tracking-tight text-stone-50">
                          {selectedDog.callName}
                        </h2>
                        <p className="mt-1 text-sm text-stone-400">
                          {displayText(selectedDog.registeredName)}
                        </p>
                      </div>
                      <StatusPill tone={toneForStatus(selectedDog.status)}>
                        {selectedDog.status}
                      </StatusPill>
                    </div>
                    <div className="mt-5 grid gap-x-8 gap-y-1 md:grid-cols-2">
                      <FieldRow label="Role" value={selectedDog.role} />
                      <FieldRow label="Sex" value={selectedDog.sex} />
                      <FieldRow label="Age" value={dogAge(selectedDog.dateOfBirth)} />
                      <FieldRow label="Registry" value={selectedDog.registry} />
                      <FieldRow label="Color" value={selectedDog.color} />
                      <FieldRow label="Coat" value={selectedDog.coat} />
                      <FieldRow label="Bloodline" value={selectedDog.bloodline} />
                      <FieldRow label="Eligibility" value={selectedDog.breedingEligibility} />
                    </div>
                  </div>
                </div>
              </Panel>

              <div className="rounded-lg border border-white/[0.08] bg-black/10 p-2">
                <div className="grid gap-2 md:grid-cols-6">
                  {["Overview", "Health", "Genetics", "Litters", "Offspring", "Notes"].map((tab) => (
                    <div key={tab} className="rounded-md border border-white/[0.06] bg-white/[0.025] px-3 py-2 text-center text-xs font-semibold uppercase tracking-[0.12em] text-stone-400">
                      {tab}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-5 lg:grid-cols-2">
                <Panel className="p-5" title="Health" eyebrow="Clearance context">
                  {healthRecords.length > 0 ? (
                    <div className="divide-y divide-white/[0.06]">
                      {healthRecords.map((record) => (
                        <div key={record.id} className="py-3">
                          <div className="flex items-center justify-between gap-3">
                            <p className="font-medium text-stone-100">{record.testName}</p>
                            <StatusPill tone={toneForStatus(record.status)}>{record.status}</StatusPill>
                          </div>
                          <p className="mt-1 text-sm text-stone-400">{displayText(record.result)}</p>
                          <p className="mt-1 text-xs text-stone-500">{formatDate(record.testedAt)}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      title="Start the health matrix"
                      body="Add clearances, test results, dates, and breeder notes to strengthen breeding decisions for this dog."
                    />
                  )}
                </Panel>

                <Panel className="p-5" title="Genetics" eyebrow="Recorded profile">
                  {geneticRecords.length > 0 ? (
                    <div className="space-y-4">
                      {geneticRecords.map((record) => (
                        <div key={record.id} className="rounded-md border border-white/[0.06] bg-white/[0.025] p-4">
                          <FieldRow label="Carrier states" value={record.carrierStates} />
                          <FieldRow label="Color genetics" value={record.colorGenetics} />
                          <FieldRow label="Coat genetics" value={record.coatGenetics} />
                          <FieldRow label="COI" value={record.coiPercent === null ? null : `${record.coiPercent}%`} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      title="Build the genetic profile"
                      body="Capture carrier states, color genetics, coat genetics, and COI context for pairing reviews."
                    />
                  )}
                </Panel>
              </div>

              <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
                <Panel className="p-5" title="Notes" eyebrow="Breeding status">
                  <FieldRow label="Eligibility" value={selectedDog.breedingEligibility} />
                  <FieldRow label="Proven status" value={selectedDog.provenStatus} />
                  <FieldRow label="Cycle notes" value={selectedDog.cycleNotes} />
                  <FieldRow label="Program notes" value={selectedDog.notes} />
                </Panel>

                <Panel className="p-5" title="Litters" eyebrow="Production history">
                  <div className="grid gap-4 md:grid-cols-3">
                    <HistoryMetric label="Litters" value={litters.length} />
                    <HistoryMetric label="Offspring" value={offspring.length} />
                    <HistoryMetric label="Retained" value={offspring.filter((puppy) => puppy.retained).length} />
                  </div>
                  {litters.length > 0 ? (
                    <div className="mt-4 divide-y divide-white/[0.06]">
                      {litters.map((litter) => (
                        <div key={litter.id} className="flex items-center justify-between gap-4 py-3">
                          <div>
                            <p className="font-medium text-stone-100">{litter.litterName}</p>
                            <p className="text-sm text-stone-500">{formatDate(litter.whelpDate ?? litter.dueDate)}</p>
                          </div>
                          <StatusPill tone={toneForStatus(litter.status)}>{litter.status}</StatusPill>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </Panel>
              </div>
            </>
          ) : (
            <Panel className="p-6">
              <EmptyState
                title="No dogs added yet. Add your first dog to begin your program."
                body="Dog profiles, health records, genetics, litters, offspring, and notes will appear here."
              />
            </Panel>
          )}
        </main>

        <aside className="space-y-5">
          <Panel className="p-5" title="Roster Health" eyebrow="Program checks">
            <SideMetric icon={<PawPrint className="size-4" />} label="Dogs" value={data.dogs.length} />
            <SideMetric icon={<HeartPulse className="size-4" />} label="Health records" value={data.healthRecords.length} />
            <SideMetric icon={<Dna className="size-4" />} label="Genetic records" value={data.geneticRecords.length} />
            <SideMetric icon={<ShieldCheck className="size-4" />} label="Active roles" value={new Set(data.dogs.map((dog) => dog.role)).size} />
          </Panel>
        </aside>
      </div>
    </div>
  );
}

function DogRosterRow({ dog, selected }: { dog: Dog; selected: boolean }) {
  return (
    <div className={selected ? "rounded-md border border-gold/30 bg-gold/10 p-3" : "rounded-md border border-white/[0.06] bg-white/[0.025] p-3"}>
      <div className="flex items-center gap-3">
        <DogInitial dog={dog} />
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-stone-100">{dog.callName}</p>
          <p className="truncate text-xs text-stone-500">{dog.role} / {dogAge(dog.dateOfBirth)}</p>
        </div>
        <StatusPill tone={toneForStatus(dog.status)}>{dog.status}</StatusPill>
      </div>
    </div>
  );
}

function DogPortrait({ dog }: { dog: Dog }) {
  return (
    <div
      className="min-h-48 w-full rounded-lg border border-white/[0.08] bg-[radial-gradient(circle_at_30%_20%,rgba(215,173,103,0.22),transparent_34%),linear-gradient(145deg,#171f27,#0d1319)] bg-cover bg-center lg:w-56"
      style={dog.photoUrl ? { backgroundImage: `url("${dog.photoUrl}")` } : undefined}
    >
      {!dog.photoUrl ? (
        <div className="flex h-full min-h-48 items-center justify-center text-5xl font-semibold text-gold/60">
          {dog.callName.slice(0, 1).toUpperCase()}
        </div>
      ) : null}
    </div>
  );
}

function DogInitial({ dog }: { dog: Dog }) {
  return (
    <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-gold/20 bg-gold/10 text-sm font-semibold text-gold">
      {dog.callName.slice(0, 1).toUpperCase()}
    </span>
  );
}

function HistoryMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-white/[0.06] bg-black/10 p-3">
      <p className="text-2xl font-semibold text-stone-50">{value}</p>
      <p className="mt-1 text-xs uppercase tracking-[0.16em] text-stone-500">{label}</p>
    </div>
  );
}

function SideMetric({
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
