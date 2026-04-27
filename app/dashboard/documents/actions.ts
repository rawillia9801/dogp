"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase";
import { getCurrentOrganizationId } from "@/lib/dogs-data";

const allowedStatuses = new Set(["draft", "pending", "sent", "signed", "uploaded", "archived"]);

export async function createBuyerDocumentRecord(formData: FormData) {
  const admin = createSupabaseAdminClient();
  const organizationId = await getCurrentOrganizationId();
  if (!admin || !organizationId) redirect("/dashboard/documents/new?error=config");

  const title = clean(formData.get("title"));
  if (!title) redirect("/dashboard/documents/new?error=missing_title");

  const buyerId = await resolveBuyer(admin, organizationId, clean(formData.get("buyer_name")));
  const { error } = await admin.from("buyer_documents").insert({
    organization_id: organizationId,
    buyer_id: buyerId,
    title,
    category: clean(formData.get("category")) || "contract",
    file_url: clean(formData.get("file_url")) || null,
    status: normalizeSelect(formData.get("status"), allowedStatuses, "draft"),
    visible_to_buyer: checkbox(formData.get("visible_to_buyer"), true),
    notes: clean(formData.get("notes")) || null,
  });

  if (error) redirect(`/dashboard/documents/new?error=save_failed&message=${encodeURIComponent(error.message.slice(0, 220))}`);
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/documents");
  revalidatePath("/dashboard/buyers");
  redirect("/dashboard/documents?created=1");
}

async function resolveBuyer(admin: any, organizationId: string, buyerName: string) {
  if (!buyerName) return null;
  const { data: existing } = await admin.from("buyers").select("id").eq("organization_id", organizationId).ilike("full_name", buyerName).maybeSingle();
  if (existing?.id) return existing.id;
  const emailLocalPart = buyerName.toLowerCase().replace(/[^a-z0-9]+/g, ".").replace(/^\.+|\.+$/g, "") || "buyer";
  const { data: created } = await admin.from("buyers").insert({ organization_id: organizationId, full_name: buyerName, email: `${emailLocalPart}@placeholder.local`, status: "pending" }).select("id").single();
  return created?.id ?? null;
}

function clean(value: FormDataEntryValue | null) { return String(value || "").trim(); }
function checkbox(value: FormDataEntryValue | null, fallback: boolean) { if (value === null) return fallback; return value === "on" || value === "true" || value === "1"; }
function normalizeSelect(value: FormDataEntryValue | null, allowed: Set<string>, fallback: string) { const normalized = clean(value).toLowerCase(); return allowed.has(normalized) ? normalized : fallback; }
