"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase";
import { getCurrentOrganizationId } from "@/lib/dogs-data";

const allowedRoles = new Set(["dam", "sire", "puppy", "keeper", "retired", "prospect"]);
const allowedStatuses = new Set(["active", "retired", "watch", "sold", "hold"]);
const allowedSexes = new Set(["female", "male", "unknown"]);
const allowedEligibility = new Set(["eligible", "pending", "hold"]);

export async function createDogRecord(formData: FormData) {
  const admin = createSupabaseAdminClient();
  const organizationId = await getCurrentOrganizationId();
  if (!admin || !organizationId) redirect("/dashboard/dogs/new?error=config");

  const callName = clean(formData.get("call_name"));
  if (!callName) redirect("/dashboard/dogs/new?error=missing_name");

  const role = normalizeSelect(formData.get("role"), allowedRoles, "dam");
  const status = normalizeSelect(formData.get("status"), allowedStatuses, "active");
  const sex = normalizeSelect(formData.get("sex"), allowedSexes, role === "sire" ? "male" : role === "dam" ? "female" : "unknown");
  const { error } = await admin.from("breeding_dogs").insert(buildDogPayload(formData, organizationId, callName, role, status, sex));

  if (error) redirect(`/dashboard/dogs/new?error=save_failed&message=${encodeURIComponent(error.message.slice(0, 220))}`);
  revalidatePath("/dashboard"); revalidatePath("/dashboard/dogs"); redirect("/dashboard/dogs?created=1");
}

export async function updateDogRecord(formData: FormData) {
  const admin = createSupabaseAdminClient();
  const organizationId = await getCurrentOrganizationId();
  const dogId = clean(formData.get("dog_id"));
  if (!admin || !organizationId) redirect(`/dashboard/dogs/${dogId}/edit?error=config`);
  if (!dogId) redirect("/dashboard/dogs?error=missing_dog");

  const callName = clean(formData.get("call_name"));
  if (!callName) redirect(`/dashboard/dogs/${dogId}/edit?error=missing_name`);

  const role = normalizeSelect(formData.get("role"), allowedRoles, "dam");
  const status = normalizeSelect(formData.get("status"), allowedStatuses, "active");
  const sex = normalizeSelect(formData.get("sex"), allowedSexes, role === "sire" ? "male" : role === "dam" ? "female" : "unknown");
  const { error } = await admin.from("breeding_dogs").update({ ...buildDogPayload(formData, organizationId, callName, role, status, sex), updated_at: new Date().toISOString() }).eq("id", dogId).eq("organization_id", organizationId);

  if (error) redirect(`/dashboard/dogs/${dogId}/edit?error=save_failed&message=${encodeURIComponent(error.message.slice(0, 220))}`);
  revalidatePath("/dashboard"); revalidatePath("/dashboard/dogs"); revalidatePath(`/dashboard/dogs/${dogId}/edit`); redirect("/dashboard/dogs?updated=1");
}

export async function deleteDogRecord(formData: FormData) {
  const admin = createSupabaseAdminClient();
  const organizationId = await getCurrentOrganizationId();
  const dogId = clean(formData.get("dog_id"));
  if (!admin || !organizationId) redirect("/dashboard/dogs?error=config");
  if (!dogId) redirect("/dashboard/dogs?error=missing_dog");

  const { error } = await admin.from("breeding_dogs").delete().eq("id", dogId).eq("organization_id", organizationId);
  if (error) redirect(`/dashboard/dogs?error=delete_failed&message=${encodeURIComponent(error.message.slice(0, 220))}`);
  revalidatePath("/dashboard"); revalidatePath("/dashboard/dogs"); redirect("/dashboard/dogs?deleted=1");
}

function buildDogPayload(formData: FormData, organizationId: string, callName: string, role: string, status: string, sex: string) {
  return {
    organization_id: organizationId,
    dog_name: clean(formData.get("dog_name")) || callName,
    call_name: callName,
    registered_name: clean(formData.get("registered_name")) || null,
    sex,
    role,
    status,
    date_of_birth: clean(formData.get("date_of_birth")) || null,
    color: clean(formData.get("color")) || null,
    coat: clean(formData.get("coat")) || null,
    registry: clean(formData.get("registry")) || null,
    registration_number: clean(formData.get("registration_number")) || null,
    bloodline_label: clean(formData.get("bloodline")) || clean(formData.get("bloodline_label")) || null,
    pedigree_summary: clean(formData.get("pedigree_summary")) || null,
    profile_notes: clean(formData.get("notes")) || clean(formData.get("profile_notes")) || null,
    breeding_eligibility: normalizeSelect(formData.get("breeding_eligibility"), allowedEligibility, "pending"),
    proven_status: clean(formData.get("proven_status")) || null,
    is_public: checkbox(formData.get("is_public"), true),
  };
}

function clean(value: FormDataEntryValue | null) { return String(value || "").trim(); }
function checkbox(value: FormDataEntryValue | null, fallback: boolean) { if (value === null) return fallback; return value === "on" || value === "true" || value === "1"; }
function normalizeSelect(value: FormDataEntryValue | null, allowed: Set<string>, fallback: string) { const normalized = clean(value).toLowerCase(); return allowed.has(normalized) ? normalized : fallback; }
