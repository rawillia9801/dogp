"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase";
import { getCurrentOrganizationId } from "@/lib/dogs-data";

const allowedStatuses = new Set(["planned", "bred", "confirmed", "whelped", "closed"]);

export async function createLitterRecord(formData: FormData) {
  const admin = createSupabaseAdminClient();
  const organizationId = await getCurrentOrganizationId();
  if (!admin || !organizationId) redirect("/dashboard/litters/new?error=config");
  const litterName = clean(formData.get("litter_name"));
  if (!litterName) redirect("/dashboard/litters/new?error=missing_name");
  const { error } = await admin.from("litters").insert(buildPayload(formData, organizationId, litterName));
  if (error) redirect(`/dashboard/litters/new?error=save_failed&message=${encodeURIComponent(error.message.slice(0, 220))}`);
  revalidatePath("/dashboard"); revalidatePath("/dashboard/litters"); redirect("/dashboard/litters?created=1");
}

export async function updateLitterRecord(formData: FormData) {
  const admin = createSupabaseAdminClient();
  const organizationId = await getCurrentOrganizationId();
  const litterId = clean(formData.get("litter_id"));
  if (!admin || !organizationId || !litterId) redirect("/dashboard/litters?error=config");
  const litterName = clean(formData.get("litter_name"));
  if (!litterName) redirect(`/dashboard/litters/${litterId}/edit?error=missing_name`);
  const { organization_id, ...payload } = buildPayload(formData, organizationId, litterName);
  const { error } = await admin.from("litters").update({ ...payload, updated_at: new Date().toISOString() }).eq("id", litterId).eq("organization_id", organizationId);
  if (error) redirect(`/dashboard/litters/${litterId}/edit?error=save_failed&message=${encodeURIComponent(error.message.slice(0, 220))}`);
  revalidatePath("/dashboard"); revalidatePath("/dashboard/litters"); redirect("/dashboard/litters?updated=1");
}

export async function deleteLitterRecord(formData: FormData) {
  const admin = createSupabaseAdminClient();
  const organizationId = await getCurrentOrganizationId();
  const litterId = clean(formData.get("litter_id"));
  if (!admin || !organizationId || !litterId) redirect("/dashboard/litters?error=delete_failed");
  const { error } = await admin.from("litters").delete().eq("id", litterId).eq("organization_id", organizationId);
  if (error) redirect(`/dashboard/litters?error=delete_failed&message=${encodeURIComponent(error.message.slice(0, 220))}`);
  revalidatePath("/dashboard"); revalidatePath("/dashboard/litters"); redirect("/dashboard/litters?deleted=1");
}

function buildPayload(formData: FormData, organizationId: string, litterName: string) {
  return { organization_id: organizationId, litter_name: litterName, status: normalizeSelect(formData.get("status"), allowedStatuses, "planned"), breeding_date: clean(formData.get("breeding_date")) || null, due_date: clean(formData.get("due_date")) || null, whelp_date: clean(formData.get("whelp_date")) || null, expected_size: clean(formData.get("expected_size")) || null, reservation_goal: toNumberOrNull(formData.get("reservation_goal")), notes: buildNotes(formData) };
}

function buildNotes(formData: FormData) { const parts = [["Sire", clean(formData.get("sire"))], ["Dam", clean(formData.get("dam"))], ["Puppies Born", clean(formData.get("puppies_born"))], ["Available Spots", clean(formData.get("available_spots"))], ["Reserved Spots", clean(formData.get("reserved_spots"))], ["Deposit Collected", clean(formData.get("deposit_collected"))]].filter(([, value]) => value); const notes = clean(formData.get("notes")); const generated = parts.map(([label, value]) => `${label}: ${value}`).join("\n"); return [generated, notes].filter(Boolean).join("\n\n") || null; }
function clean(value: FormDataEntryValue | null) { return String(value || "").trim(); }
function normalizeSelect(value: FormDataEntryValue | null, allowed: Set<string>, fallback: string) { const normalized = clean(value).toLowerCase(); return allowed.has(normalized) ? normalized : fallback; }
function toNumberOrNull(value: FormDataEntryValue | null) { const cleanValue = clean(value); if (!cleanValue) return null; const number = Number(cleanValue); return Number.isFinite(number) ? number : null; }
