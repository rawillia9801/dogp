"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase";
import { getCurrentOrganizationId } from "@/lib/dogs-data";

export async function createPaymentRecord(formData: FormData) {
  const admin = createSupabaseAdminClient();
  const organizationId = await getCurrentOrganizationId();

  if (!admin || !organizationId) {
    redirect("/dashboard/payments/new?error=config");
  }

  const buyerName = clean(formData.get("buyer_name"));
  const amount = toNumberOrZero(formData.get("payment_amount"));
  if (!buyerName || amount <= 0) redirect("/dashboard/payments/new?error=missing_required");

  const buyerId = await resolveBuyer(admin, organizationId, buyerName);
  if (!buyerId) redirect("/dashboard/payments/new?error=buyer_lookup_failed");

  const { error } = await admin.from("buyer_payments").insert(buildPaymentPayload(formData, buyerId));
  if (error) redirect(`/dashboard/payments/new?error=save_failed&message=${encodeURIComponent(error.message.slice(0,220))}`);

  revalidatePath("/dashboard"); revalidatePath("/dashboard/payments"); revalidatePath("/dashboard/buyers"); redirect("/dashboard/payments?created=1");
}

export async function updatePaymentRecord(formData: FormData) {
  const admin = createSupabaseAdminClient();
  const organizationId = await getCurrentOrganizationId();
  const paymentId = clean(formData.get("payment_id"));
  if (!admin || !organizationId || !paymentId) redirect("/dashboard/payments?error=config");
  const buyerId = await resolveBuyer(admin, organizationId, clean(formData.get("buyer_name")));
  if (!buyerId) redirect(`/dashboard/payments/${paymentId}/edit?error=buyer_lookup_failed`);
  const { error } = await admin.from("buyer_payments").update(buildPaymentPayload(formData, buyerId)).eq("id", paymentId);
  if (error) redirect(`/dashboard/payments/${paymentId}/edit?error=save_failed&message=${encodeURIComponent(error.message.slice(0,220))}`);
  revalidatePath("/dashboard"); revalidatePath("/dashboard/payments"); revalidatePath("/dashboard/buyers"); redirect("/dashboard/payments?updated=1");
}

export async function deletePaymentRecord(formData: FormData) {
  const admin = createSupabaseAdminClient();
  if (!admin || !clean(formData.get("payment_id"))) redirect("/dashboard/payments?error=delete_failed");
  await admin.from("buyer_payments").delete().eq("id", clean(formData.get("payment_id")));
  revalidatePath("/dashboard"); revalidatePath("/dashboard/payments"); redirect("/dashboard/payments?deleted=1");
}

async function resolveBuyer(admin: any, organizationId: string, buyerName: string) {
  if (!buyerName) return null;
  const { data: existingBuyer } = await admin.from("buyers").select("id").eq("organization_id", organizationId).ilike("full_name", buyerName).maybeSingle();
  if (existingBuyer?.id) return existingBuyer.id;
  const { data: newBuyer } = await admin.from("buyers").insert({ organization_id: organizationId, full_name: buyerName, email: `${buyerName.toLowerCase().replace(/\s+/g, ".")}@placeholder.local`, status: "lead" }).select("id").single();
  return newBuyer?.id ?? null;
}

function buildPaymentPayload(formData: FormData, buyerId: string) {
  return { buyer_id: buyerId, amount: toNumberOrZero(formData.get("payment_amount")), payment_date: clean(formData.get("payment_date")) || new Date().toISOString().slice(0,10), type: clean(formData.get("payment_type")) || "deposit", method: clean(formData.get("method")) || "manual", status: "received" };
}
function clean(value: FormDataEntryValue | null) { return String(value || "").trim(); }
function toNumberOrZero(value: FormDataEntryValue | null) { const n = Number(clean(value)); return Number.isFinite(n) ? n : 0; }
