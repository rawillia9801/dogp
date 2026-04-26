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

  if (!buyerName || amount <= 0) {
    redirect("/dashboard/payments/new?error=missing_required");
  }

  const payload = {
    organization_id: organizationId,
    buyer_name: buyerName,
    amount,
    payment_date: clean(formData.get("payment_date")) || new Date().toISOString().slice(0,10),
    payment_type: clean(formData.get("payment_type")) || null,
    invoice_ref: clean(formData.get("invoice_ref")) || null,
    remaining_balance: toNumberOrZero(formData.get("remaining_balance")),
    method: clean(formData.get("method")) || null,
    notes: buildPaymentNotes(formData),
  };

  const { error } = await admin.from("buyer_payments").insert(payload);

  if (error) {
    const message = encodeURIComponent(error.message.slice(0, 220));
    redirect(`/dashboard/payments/new?error=save_failed&message=${message}`);
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/payments");
  redirect("/dashboard/payments?created=1");
}

function buildPaymentNotes(formData: FormData) {
  const parts = [
    ["Assigned Puppy/Litter", clean(formData.get("assigned_unit"))],
    ["Finance Notes", clean(formData.get("notes"))],
  ].filter(([, value]) => value);
  return parts.map(([label, value]) => `${label}: ${value}`).join("\n") || null;
}

function clean(value: FormDataEntryValue | null) { return String(value || "").trim(); }
function toNumberOrZero(value: FormDataEntryValue | null) { const n = Number(clean(value)); return Number.isFinite(n) ? n : 0; }
