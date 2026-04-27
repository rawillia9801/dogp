import { createSupabaseServerClient } from "@/lib/supabase";
import type {
  BreederEvent,
  BreederTask,
  BreedingPair,
  Dog,
  DogGeneticRecord,
  DogHealthRecord,
  Litter,
  Puppy,
} from "@/types";

type DogRow = {
  id: string;
  organization_id: string;
  call_name: string;
  registered_name: string | null;
  role: string;
  status: string;
  date_of_birth: string | null;
  sex: string | null;
  color: string | null;
  coat: string | null;
  registry: string | null;
  bloodline: string | null;
  photo_url: string | null;
  notes: string | null;
  breeding_eligibility: string | null;
  proven_status: string | null;
  cycle_notes: string | null;
  created_at: string;
  updated_at: string;
};

type HealthRow = { id: string; organization_id: string; dog_id: string; test_name: string; result: string | null; status: string; tested_at: string | null; notes: string | null; created_at: string; updated_at: string; };
type GeneticRow = { id: string; organization_id: string; dog_id: string; carrier_states: string | null; color_genetics: string | null; coat_genetics: string | null; coi_percent: number | null; notes: string | null; created_at: string; updated_at: string; };
type PairingRow = { id: string; organization_id: string; dam_id: string | null; sire_id: string | null; pairing_name: string | null; status: string; breeding_method: string | null; planned_start: string | null; planned_end: string | null; expected_litter_size: string | null; color_coat_summary: string | null; reservation_goal: number | null; goals: string | null; internal_analysis: string | null; notes: string | null; created_at: string; updated_at: string; };
type LitterRow = { id: string; organization_id: string; pairing_id: string | null; dam_id: string | null; sire_id: string | null; litter_name: string; status: string; breeding_date: string | null; confirmation_date: string | null; due_date: string | null; whelp_date: string | null; expected_size: string | null; reservation_goal: number | null; notes: string | null; created_at: string; updated_at: string; };

type PuppyRow = {
  id: string;
  organization_id: string;
  litter_id: string | null;
  buyer_id?: string | null;
  puppy_name: string | null;
  call_name: string | null;
  date_of_birth: string | null;
  sex: string | null;
  color: string | null;
  coat: string | null;
  status: string;
  price: number | null;
  deposit: number | null;
  balance: number | null;
  retained?: boolean | null;
  retained_for_program?: boolean | null;
  public_visible?: boolean | null;
  is_public?: boolean | null;
  portal_visible: boolean | null;
  go_home_ready?: boolean | null;
  notes: string | null;
  description: string | null;
  photo_url: string | null;
  created_at: string;
  updated_at: string;
};

type TaskRow = { id: string; organization_id: string; related_type: string | null; related_id: string | null; title: string; priority: string; due_date: string | null; status: string; notes: string | null; created_at: string; updated_at: string; };
type EventRow = { id: string; organization_id: string; related_type: string | null; related_id: string | null; title: string; event_type: string | null; event_date: string; status: string; notes: string | null; created_at: string; updated_at: string; };

export type BreederWorkspaceData = { dogs: Dog[]; healthRecords: DogHealthRecord[]; geneticRecords: DogGeneticRecord[]; pairings: BreedingPair[]; litters: Litter[]; puppies: Puppy[]; tasks: BreederTask[]; events: BreederEvent[]; };
const emptyWorkspaceData: BreederWorkspaceData = { dogs: [], healthRecords: [], geneticRecords: [], pairings: [], litters: [], puppies: [], tasks: [], events: [] };

export async function getBreederWorkspaceData(organizationId: string): Promise<BreederWorkspaceData> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return emptyWorkspaceData;
  const [dogsResult, healthResult, geneticResult, pairingsResult, littersResult, puppiesResult, tasksResult, eventsResult] = await Promise.all([
    supabase.from("breeding_dogs").select("*").eq("organization_id", organizationId).order("call_name", { ascending: true }).returns<DogRow[]>(),
    supabase.from("dog_health_records").select("*").eq("organization_id", organizationId).order("tested_at", { ascending: false, nullsFirst: false }).returns<HealthRow[]>(),
    supabase.from("dog_genetic_records").select("*").eq("organization_id", organizationId).order("created_at", { ascending: false }).returns<GeneticRow[]>(),
    supabase.from("breeding_pairings").select("*").eq("organization_id", organizationId).order("planned_start", { ascending: true, nullsFirst: false }).returns<PairingRow[]>(),
    supabase.from("litters").select("*").eq("organization_id", organizationId).order("due_date", { ascending: true, nullsFirst: false }).returns<LitterRow[]>(),
    supabase.from("puppies").select("*").eq("organization_id", organizationId).order("created_at", { ascending: false }).returns<PuppyRow[]>(),
    supabase.from("breeder_tasks").select("*").eq("organization_id", organizationId).order("due_date", { ascending: true, nullsFirst: false }).returns<TaskRow[]>(),
    supabase.from("breeder_events").select("*").eq("organization_id", organizationId).order("event_date", { ascending: true }).returns<EventRow[]>(),
  ]);
  return { dogs: (dogsResult.data ?? []).map(mapDog), healthRecords: (healthResult.data ?? []).map(mapHealthRecord), geneticRecords: (geneticResult.data ?? []).map(mapGeneticRecord), pairings: (pairingsResult.data ?? []).map(mapPairing), litters: (littersResult.data ?? []).map(mapLitter), puppies: (puppiesResult.data ?? []).map(mapPuppy), tasks: (tasksResult.data ?? []).map(mapTask), events: (eventsResult.data ?? []).map(mapEvent) };
}

function mapDog(row: DogRow): Dog { return { id: row.id, organizationId: row.organization_id, callName: row.call_name, registeredName: row.registered_name, role: row.role, status: row.status, dateOfBirth: row.date_of_birth, sex: row.sex, color: row.color, coat: row.coat, registry: row.registry, bloodline: row.bloodline, photoUrl: row.photo_url, notes: row.notes, breedingEligibility: row.breeding_eligibility, provenStatus: row.proven_status, cycleNotes: row.cycle_notes, createdAt: row.created_at, updatedAt: row.updated_at }; }
function mapHealthRecord(row: HealthRow): DogHealthRecord { return { id: row.id, organizationId: row.organization_id, dogId: row.dog_id, testName: row.test_name, result: row.result, status: row.status, testedAt: row.tested_at, notes: row.notes, createdAt: row.created_at, updatedAt: row.updated_at }; }
function mapGeneticRecord(row: GeneticRow): DogGeneticRecord { return { id: row.id, organizationId: row.organization_id, dogId: row.dog_id, carrierStates: row.carrier_states, colorGenetics: row.color_genetics, coatGenetics: row.coat_genetics, coiPercent: row.coi_percent, notes: row.notes, createdAt: row.created_at, updatedAt: row.updated_at }; }
function mapPairing(row: PairingRow): BreedingPair { return { id: row.id, organizationId: row.organization_id, damId: row.dam_id, sireId: row.sire_id, pairingName: row.pairing_name, status: row.status, breedingMethod: row.breeding_method, plannedStart: row.planned_start, plannedEnd: row.planned_end, expectedLitterSize: row.expected_litter_size, colorCoatSummary: row.color_coat_summary, reservationGoal: row.reservation_goal, goals: row.goals, internalAnalysis: row.internal_analysis, notes: row.notes, createdAt: row.created_at, updatedAt: row.updated_at }; }
function mapLitter(row: LitterRow): Litter { return { id: row.id, organizationId: row.organization_id, pairingId: row.pairing_id, damId: row.dam_id, sireId: row.sire_id, litterName: row.litter_name, status: row.status, breedingDate: row.breeding_date, confirmationDate: row.confirmation_date, dueDate: row.due_date, whelpDate: row.whelp_date, expectedSize: row.expected_size, reservationGoal: row.reservation_goal, notes: row.notes, createdAt: row.created_at, updatedAt: row.updated_at }; }
function mapPuppy(row: PuppyRow): Puppy { return { id: row.id, organizationId: row.organization_id, litterId: row.litter_id, buyerId: row.buyer_id ?? null, puppyName: row.puppy_name, callName: row.call_name, dateOfBirth: row.date_of_birth, sex: row.sex, color: row.color, coat: row.coat, status: row.status, price: row.price, deposit: row.deposit, balance: row.balance, retained: Boolean(row.retained_for_program ?? row.retained), publicVisible: Boolean(row.is_public ?? row.public_visible), portalVisible: Boolean(row.portal_visible), goHomeReady: Boolean(row.go_home_ready), notes: row.notes, description: row.description, photoUrl: row.photo_url, createdAt: row.created_at, updatedAt: row.updated_at }; }
function mapTask(row: TaskRow): BreederTask { return { id: row.id, organizationId: row.organization_id, relatedType: row.related_type, relatedId: row.related_id, title: row.title, priority: row.priority, dueDate: row.due_date, status: row.status, notes: row.notes, createdAt: row.created_at, updatedAt: row.updated_at }; }
function mapEvent(row: EventRow): BreederEvent { return { id: row.id, organizationId: row.organization_id, relatedType: row.related_type, relatedId: row.related_id, title: row.title, eventType: row.event_type, eventDate: row.event_date, status: row.status, notes: row.notes, createdAt: row.created_at, updatedAt: row.updated_at }; }
