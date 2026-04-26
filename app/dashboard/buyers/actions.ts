"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase";
import { getCurrentOrganizationId } from "@/lib/dogs-data";

export async function createBuyerRecord(formData: FormData) {
  const admin = createSupabaseAdminClient();
  const organizationId = await getCurrentOrganizationId();

  if (!admin || !organizationId) {
    redirect("/dashboard/buyers/new?error=config");
  }

  const buyerName = clean(formData.get("buyer_name"));

  if (!buyerName) {
    redirect("/dashboard/buyers/new?error=missing_name");
  }

  const payload = {
    organization_id: organizationId,
    buyer_name: buyerName,
    email: clean(formData.get("email")) || null,
    phone: clean(formData.get("phone")) || null,
    application_status: clean(formData.get("application_status")) || "new",
    assigned_litter: clean(formData.get("assigned_litter")) || null,
    deposit_paid: toNumberOrZero(formData.get("deposit_paid")),
    balance_due: toNumberOrZero(formData.get("balance_due")),
    notes: buildBuyerNotes(formData),
  };

  const { error } = await admin.from("buyers").insert(payload);

  if (error) {
    const message = encodeURIComponent(error.message.slice(0, 220));
    redirect(`/dashboard/buyers/new?error=save_failed&message=${message}`);
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/buyers");
  redirect("/dashboard/buyers?created=1");
}

function buildBuyerNotes(formData: FormData) {
  const parts = [
    ["City/State", clean(formData.get("city_state"))],
    ["Desired Breed", clean(formData.get("desired_breed"))],
    ["Desired Sex", clean(formData.get("desired_sex"))],
    ["Desired Color", clean(formData.get("desired_color"))],
    ["Budget", clean(formData.get("budget"))],
  ].filter(([, value]) => value);

  const notes = clean(formData.get("notes"));
  const generated = parts.map(([label, value]) => `${label}: ${value}`).join("\n");

  return [generated, notes].filter(Boolean).join("\n\n") || null;
}

function clean(value: FormDataEntryValue | null) { return String(value || "").trim(); }
function toNumberOrZero(value: FormDataEntryValue | null) { const n = Number(clean(value)); return Number.isFinite(n) ? n : 0; }
