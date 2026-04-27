"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase";
import { getCurrentOrganizationId } from "@/lib/dogs-data";

const allowedStatuses = new Set(["submitted", "pending", "approved", "denied", "waitlist"]);

export async function createBuyerApplicationRecord(formData: FormData) {
  const admin = createSupabaseAdminClient();
  const organizationId = await getCurrentOrganizationId();
  if (!admin || !organizationId) redirect("/dashboard/applications/new?error=config");

  const buyerName = clean(formData.get("buyer_name"));
  const email = clean(formData.get("email"));
  if (!buyerName || !email) redirect("/dashboard/applications/new?error=missing_required");

  const buyerId = await resolveBuyer(admin, organizationId, buyerName, email);
  const { error } = await admin.from("buyer_applications").insert({
    organization_id: organizationId,
    buyer_id: buyerId,
    status: normalizeSelect(formData.get("status"), allowedStatuses, "submitted"),
    application_data: {
      phone: clean(formData.get("phone")),
      city_state: clean(formData.get("city_state")),
      desired_breed: clean(formData.get("desired_breed")),
      desired_sex: clean(formData.get("desired_sex")),
      desired_color: clean(formData.get("desired_color")),
      home_type: clean(formData.get("home_type")),
      fenced_yard: clean(formData.get("fenced_yard")),
      notes: clean(formData.get("notes")),
    },
  });

  if (error) redirect(`/dashboard/applications/new?error=save_failed&message=${encodeURIComponent(error.message.slice(0,220))}`);
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/applications");
  revalidatePath("/dashboard/buyers");
  redirect("/dashboard/applications?created=1");
}

async function resolveBuyer(admin: any, organizationId: string, buyerName: string, email: string) {
  const { data: existing } = await admin.from("buyers").select("id").eq("organization_id", organizationId).ilike("email", email).maybeSingle();
  if (existing?.id) return existing.id;
  const { data: created } = await admin.from("buyers").insert({ organization_id: organizationId, full_name: buyerName, email, status: "pending" }).select("id").single();
  return created?.id ?? null;
}
function clean(value: FormDataEntryValue | null) { return String(value || "").trim(); }
function normalizeSelect(value: FormDataEntryValue | null, allowed: Set<string>, fallback: string) { const normalized = clean(value).toLowerCase(); return allowed.has(normalized) ? normalized : fallback; }
