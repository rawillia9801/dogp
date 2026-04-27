"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase";
import { getCurrentOrganizationId } from "@/lib/dogs-data";

export async function createPaymentRecord(formData: FormData) {
  const admin = createSupabaseAdminClient();
  const organizationId = await getCurrentOrganizationId();

  if (!admin || !organizationId) redirect("/dashboard/payments/new?error=config");

  const buyerName = clean(formData.get("buyer_name"));
  const amount = toNumberOrZero(formData.get("payment_amount"));
  if (!buyerName || amount <= 0) redirect("/dashboard/payments/new?error=missing_required");

  const buyerId = await resolveBuyer(admin, organizationId, buyerName);
  if (!buyerId) redirect("/dashboard/payments/new?error=buyer_lookup_failed");

  const paymentAccountId = await resolvePaymentAccount(admin, organizationId, buyerId);
  if (!paymentAccountId) redirect("/dashboard/payments/new?error=payment_account_failed");

  const { error } = await admin.from("buyer_payments").insert(buildPaymentPayload(formData, buyerId, organizationId, paymentAccountId));
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
  const paymentAccountId = await resolvePaymentAccount(admin, organizationId, buyerId);
  if (!paymentAccountId) redirect(`/dashboard/payments/${paymentId}/edit?error=payment_account_failed`);
  const payload = buildPaymentPayload(formData, buyerId, organizationId, paymentAccountId);
  const { organization_id, ...updatePayload } = payload;
  const { error } = await admin.from("buyer_payments").update(updatePayload).eq("id", paymentId).eq("organization_id", organizationId);
  if (error) redirect(`/dashboard/payments/${paymentId}/edit?error=save_failed&message=${encodeURIComponent(error.message.slice(0,220))}`);
  revalidatePath("/dashboard"); revalidatePath("/dashboard/payments"); revalidatePath("/dashboard/buyers"); redirect("/dashboard/payments?updated=1");
}

export async function deletePaymentRecord(formData: FormData) {
  const admin = createSupabaseAdminClient();
  const organizationId = await getCurrentOrganizationId();
  if (!admin || !organizationId || !clean(formData.get("payment_id"))) redirect("/dashboard/payments?error=delete_failed");
  await admin.from("buyer_payments").delete().eq("id", clean(formData.get("payment_id"))).eq("organization_id", organizationId);
  revalidatePath("/dashboard"); revalidatePath("/dashboard/payments"); redirect("/dashboard/payments?deleted=1");
}

async function resolveBuyer(admin: any, organizationId: string, buyerName: string) {
  if (!buyerName) return null;
  const { data: existingBuyer } = await admin.from("buyers").select("id").eq("organization_id", organizationId).ilike("full_name", buyerName).maybeSingle();
  if (existingBuyer?.id) return existingBuyer.id;
  const emailLocalPart = buyerName.toLowerCase().replace(/[^a-z0-9]+/g, ".").replace(/^\.+|\.+$/g, "") || "buyer";
  const { data: newBuyer } = await admin.from("buyers").insert({ organization_id: organizationId, full_name: buyerName, email: `${emailLocalPart}@placeholder.local`, status: "lead" }).select("id").single();
  return newBuyer?.id ?? null;
}

async function resolvePaymentAccount(admin: any, organizationId: string, buyerId: string) {
  const { data: existingAccount } = await admin.from("buyer_payment_accounts").select("id").eq("organization_id", organizationId).eq("buyer_id", buyerId).maybeSingle();
  if (existingAccount?.id) return existingAccount.id;
  const { data: newAccount } = await admin.from("buyer_payment_accounts").insert({ organization_id: organizationId, buyer_id: buyerId, balance: 0, status: "active" }).select("id").single();
  return newAccount?.id ?? null;
}

function buildPaymentPayload(formData: FormData, buyerId: string, organizationId: string, paymentAccountId: string) {
  return { organization_id: organizationId, buyer_id: buyerId, payment_account_id: paymentAccountId, amount: toNumberOrZero(formData.get("payment_amount")), payment_date: clean(formData.get("payment_date")) || new Date().toISOString().slice(0,10), payment_type: clean(formData.get("payment_type")) || "deposit", payment_method: clean(formData.get("method")) || "manual", status: "received" };
}
function clean(value: FormDataEntryValue | null) { return String(value || "").trim(); }
function toNumberOrZero(value: FormDataEntryValue | null) { const n = Number(clean(value)); return Number.isFinite(n) ? n : 0; }
