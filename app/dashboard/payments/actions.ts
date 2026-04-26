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

  let buyerId: string | null = null;

  const { data: existingBuyer } = await admin
    .from("buyers")
    .select("id")
    .eq("organization_id", organizationId)
    .ilike("full_name", buyerName)
    .maybeSingle();

  if (existingBuyer?.id) {
    buyerId = existingBuyer.id;
  } else {
    const { data: newBuyer } = await admin
      .from("buyers")
      .insert({ organization_id: organizationId, full_name: buyerName, email: `${buyerName.toLowerCase().replace(/\s+/g, ".")}@placeholder.local`, status: "lead" })
      .select("id")
      .single();
    buyerId = newBuyer?.id ?? null;
  }

  if (!buyerId) {
    redirect("/dashboard/payments/new?error=buyer_lookup_failed");
  }

  const payload = {
    buyer_id: buyerId,
    amount,
    payment_date: clean(formData.get("payment_date")) || new Date().toISOString().slice(0,10),
    type: clean(formData.get("payment_type")) || "deposit",
    method: clean(formData.get("method")) || "manual",
    status: "received",
  };

  const { error } = await admin.from("buyer_payments").insert(payload);

  if (error) {
    const message = encodeURIComponent(error.message.slice(0, 220));
    redirect(`/dashboard/payments/new?error=save_failed&message=${message}`);
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/payments");
  revalidatePath("/dashboard/buyers");
  redirect("/dashboard/payments?created=1");
}

function clean(value: FormDataEntryValue | null) { return String(value || "").trim(); }
function toNumberOrZero(value: FormDataEntryValue | null) { const n = Number(clean(value)); return Number.isFinite(n) ? n : 0; }
