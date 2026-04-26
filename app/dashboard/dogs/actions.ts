"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase";
import { getCurrentOrganizationId } from "@/lib/dogs-data";

const allowedRoles = new Set(["dam", "sire", "puppy", "keeper", "retired", "prospect"]);
const allowedStatuses = new Set(["active", "retired", "watch", "sold", "hold"]);
const allowedSexes = new Set(["female", "male", "unknown"]);

export async function createDogRecord(formData: FormData) {
  const admin = createSupabaseAdminClient();
  const organizationId = await getCurrentOrganizationId();

  if (!admin || !organizationId) {
    redirect("/dashboard/dogs/new?error=config");
  }

  const callName = clean(formData.get("call_name"));

  if (!callName) {
    redirect("/dashboard/dogs/new?error=missing_name");
  }

  const role = normalizeSelect(formData.get("role"), allowedRoles, "dam");
  const status = normalizeSelect(formData.get("status"), allowedStatuses, "active");
  const sex = normalizeSelect(formData.get("sex"), allowedSexes, role === "sire" ? "male" : role === "dam" ? "female" : "unknown");

  const payload = {
    organization_id: organizationId,
    call_name: callName,
    registered_name: clean(formData.get("registered_name")) || null,
    sex,
    role,
    status,
    date_of_birth: clean(formData.get("date_of_birth")) || null,
    color: clean(formData.get("color")) || null,
    coat: clean(formData.get("coat")) || null,
    registry: clean(formData.get("registry")) || null,
    breeding_eligibility: clean(formData.get("breeding_eligibility")) || "pending",
    proven_status: clean(formData.get("proven_status")) || null,
    notes: clean(formData.get("notes")) || null,
  };

  const { error } = await admin.from("breeding_dogs").insert(payload);

  if (error) {
    const message = encodeURIComponent(error.message.slice(0, 220));
    redirect(`/dashboard/dogs/new?error=save_failed&message=${message}`);
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/dogs");
  redirect("/dashboard/dogs?created=1");
}

function clean(value: FormDataEntryValue | null) {
  return String(value || "").trim();
}

function normalizeSelect(value: FormDataEntryValue | null, allowed: Set<string>, fallback: string) {
  const normalized = clean(value).toLowerCase();
  return allowed.has(normalized) ? normalized : fallback;
}
