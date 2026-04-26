"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase";
import { getCurrentOrganizationId } from "@/lib/dogs-data";

export async function createDogRecord(formData: FormData) {
  const admin = createSupabaseAdminClient();
  const organizationId = await getCurrentOrganizationId();

  if (!admin || !organizationId) {
    redirect("/dashboard/dogs?error=config");
  }

  const payload = {
    organization_id: organizationId,
    call_name: String(formData.get("call_name") || "").trim(),
    registered_name: String(formData.get("registered_name") || "").trim() || null,
    sex: String(formData.get("sex") || "unknown").trim(),
    role: String(formData.get("role") || "breeding_dog").trim(),
    status: String(formData.get("status") || "active").trim(),
    date_of_birth: String(formData.get("date_of_birth") || "").trim() || null,
    color: String(formData.get("color") || "").trim() || null,
    coat: String(formData.get("coat") || "").trim() || null,
    registry: String(formData.get("registry") || "").trim() || null,
    bloodline: String(formData.get("bloodline") || "").trim() || null,
    breeding_eligibility: String(formData.get("breeding_eligibility") || "pending").trim(),
    proven_status: String(formData.get("proven_status") || "young program dog").trim(),
    notes: String(formData.get("notes") || "").trim() || null,
  };

  if (!payload.call_name) {
    redirect("/dashboard/dogs/new?error=missing_name");
  }

  await admin.from("breeding_dogs").insert(payload);

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/dogs");
  redirect("/dashboard/dogs?created=1");
}
