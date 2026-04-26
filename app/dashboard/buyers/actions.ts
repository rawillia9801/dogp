"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase";
import { getCurrentOrganizationId } from "@/lib/dogs-data";

const allowedStatuses = new Set(["lead", "approved", "active", "completed"]);

export async function createBuyerRecord(formData: FormData) {
  const admin = createSupabaseAdminClient();
  const organizationId = await getCurrentOrganizationId();

  if (!admin || !organizationId) {
    redirect("/dashboard/buyers/new?error=config");
  }

  const fullName = clean(formData.get("buyer_name"));
  const email = clean(formData.get("email"));

  if (!fullName || !email) {
    redirect("/dashboard/buyers/new?error=missing_required");
  }

  const cityState = clean(formData.get("city_state"));
  const [city, state] = splitCityState(cityState);

  const payload = {
    organization_id: organizationId,
    full_name: fullName,
    email,
    phone: clean(formData.get("phone")) || null,
    status: normalizeSelect(formData.get("application_status"), allowedStatuses, "lead"),
    city,
    state,
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
    ["Desired Breed", clean(formData.get("desired_breed"))],
    ["Desired Sex", clean(formData.get("desired_sex"))],
    ["Desired Color", clean(formData.get("desired_color"))],
    ["Budget", clean(formData.get("budget"))],
    ["Deposit Paid", clean(formData.get("deposit_paid"))],
    ["Balance Due", clean(formData.get("balance_due"))],
    ["Assigned Litter", clean(formData.get("assigned_litter"))],
  ].filter(([, value]) => value);

  const notes = clean(formData.get("notes"));
  const generated = parts.map(([label, value]) => `${label}: ${value}`).join("\n");

  return [generated, notes].filter(Boolean).join("\n\n") || null;
}

function splitCityState(value: string) {
  if (!value) return [null, null] as const;
  const [city, ...stateParts] = value.split(",");
  return [city?.trim() || null, stateParts.join(",").trim() || null] as const;
}

function clean(value: FormDataEntryValue | null) {
  return String(value || "").trim();
}

function normalizeSelect(value: FormDataEntryValue | null, allowed: Set<string>, fallback: string) {
  const normalized = clean(value).toLowerCase();
  return allowed.has(normalized) ? normalized : fallback;
}
