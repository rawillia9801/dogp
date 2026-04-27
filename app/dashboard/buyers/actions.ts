"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase";
import { getCurrentOrganizationId } from "@/lib/dogs-data";

const allowedStatuses = new Set(["pending", "lead", "approved", "active", "completed"]);

export async function createBuyerRecord(formData: FormData) {
  const admin = createSupabaseAdminClient();
  const organizationId = await getCurrentOrganizationId();
  if (!admin || !organizationId) redirect("/dashboard/buyers/new?error=config");

  const fullName = clean(formData.get("buyer_name"));
  const email = clean(formData.get("email"));
  if (!fullName || !email) redirect("/dashboard/buyers/new?error=missing_required");

  const cityState = clean(formData.get("city_state"));
  const [city, state] = splitCityState(cityState);

  const { data: buyer, error } = await admin
    .from("buyers")
    .insert({
      organization_id: organizationId,
      full_name: fullName,
      email,
      phone: clean(formData.get("phone")) || null,
      status: normalizeSelect(formData.get("application_status"), allowedStatuses, "pending"),
      city,
      state,
      notes: buildBuyerNotes(formData),
    })
    .select("id")
    .single();

  if (error || !buyer?.id) redirect(`/dashboard/buyers/new?error=save_failed&message=${encodeURIComponent((error?.message ?? "Buyer save failed").slice(0, 220))}`);

  await upsertBuyerPaymentAccount(admin, organizationId, buyer.id, formData);

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/buyers");
  revalidatePath("/dashboard/payments");
  redirect("/dashboard/buyers?created=1");
}

export async function updateBuyerRecord(formData: FormData) {
  const admin = createSupabaseAdminClient();
  const organizationId = await getCurrentOrganizationId();
  const buyerId = clean(formData.get("buyer_id"));
  if (!admin || !organizationId) redirect(`/dashboard/buyers/${buyerId}/edit?error=config`);
  if (!buyerId) redirect("/dashboard/buyers?error=missing_buyer");

  const fullName = clean(formData.get("buyer_name"));
  const email = clean(formData.get("email"));
  if (!fullName || !email) redirect(`/dashboard/buyers/${buyerId}/edit?error=missing_required`);

  const cityState = clean(formData.get("city_state"));
  const [city, state] = splitCityState(cityState);

  const { error } = await admin
    .from("buyers")
    .update({
      full_name: fullName,
      email,
      phone: clean(formData.get("phone")) || null,
      status: normalizeSelect(formData.get("application_status"), allowedStatuses, "pending"),
      city,
      state,
      notes: buildBuyerNotes(formData),
      updated_at: new Date().toISOString(),
    })
    .eq("id", buyerId)
    .eq("organization_id", organizationId);

  if (error) redirect(`/dashboard/buyers/${buyerId}/edit?error=save_failed&message=${encodeURIComponent(error.message.slice(0, 220))}`);

  await upsertBuyerPaymentAccount(admin, organizationId, buyerId, formData);

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/buyers");
  revalidatePath("/dashboard/payments");
  redirect("/dashboard/buyers?updated=1");
}

export async function deleteBuyerRecord(formData: FormData) {
  const admin = createSupabaseAdminClient();
  const organizationId = await getCurrentOrganizationId();
  const buyerId = clean(formData.get("buyer_id"));
  if (!admin || !organizationId || !buyerId) redirect("/dashboard/buyers?error=delete_failed");

  const { error } = await admin.from("buyers").delete().eq("id", buyerId).eq("organization_id", organizationId);
  if (error) redirect(`/dashboard/buyers?error=delete_failed&message=${encodeURIComponent(error.message.slice(0, 220))}`);

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/buyers");
  revalidatePath("/dashboard/payments");
  redirect("/dashboard/buyers?deleted=1");
}

async function upsertBuyerPaymentAccount(admin: any, organizationId: string, buyerId: string, formData: FormData) {
  const salePrice = toNumberOrNull(formData.get("budget"));
  const depositAmount = toNumberOrNull(formData.get("deposit_paid"));
  const balance = toNumberOrNull(formData.get("balance_due"));
  if (salePrice === null && depositAmount === null && balance === null) return;

  const payload = {
    sale_price: salePrice ?? 0,
    deposit_amount: depositAmount ?? 0,
    balance: balance ?? Math.max(0, (salePrice ?? 0) - (depositAmount ?? 0)),
    updated_at: new Date().toISOString(),
  };

  const { data: existing } = await admin
    .from("buyer_payment_accounts")
    .select("id")
    .eq("organization_id", organizationId)
    .eq("buyer_id", buyerId)
    .is("puppy_id", null)
    .maybeSingle();

  if (existing?.id) await admin.from("buyer_payment_accounts").update(payload).eq("id", existing.id);
  else await admin.from("buyer_payment_accounts").insert({ organization_id: organizationId, buyer_id: buyerId, ...payload });
}

function buildBuyerNotes(formData: FormData) {
  const parts = [
    ["Desired Breed", clean(formData.get("desired_breed"))],
    ["Desired Sex", clean(formData.get("desired_sex"))],
    ["Desired Color", clean(formData.get("desired_color"))],
    ["Assigned Litter", clean(formData.get("assigned_litter"))],
  ].filter(([, value]) => value);
  const notes = clean(formData.get("notes"));
  const generated = parts.map(([label, value]) => `${label}: ${value}`).join("\n");
  return [generated, notes].filter(Boolean).join("\n\n") || null;
}
function splitCityState(value: string) { if (!value) return [null, null] as const; const [city, ...stateParts] = value.split(","); return [city?.trim() || null, stateParts.join(",").trim() || null] as const; }
function clean(value: FormDataEntryValue | null) { return String(value || "").trim(); }
function normalizeSelect(value: FormDataEntryValue | null, allowed: Set<string>, fallback: string) { const normalized = clean(value).toLowerCase(); return allowed.has(normalized) ? normalized : fallback; }
function toNumberOrNull(value: FormDataEntryValue | null) { const raw = clean(value); if (!raw) return null; const n = Number(raw); return Number.isFinite(n) ? n : null; }
