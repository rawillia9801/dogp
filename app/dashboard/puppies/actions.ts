"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase";
import { getCurrentOrganizationId } from "@/lib/dogs-data";

const allowedStatuses = new Set(["available", "reserved", "pending", "sold", "retained", "unavailable"]);

export async function createPuppyRecord(formData: FormData) {
  const admin = createSupabaseAdminClient();
  const organizationId = await getCurrentOrganizationId();
  if (!admin || !organizationId) redirect("/dashboard/puppies/new?error=config");

  const puppyName = clean(formData.get("puppy_name"));
  const callName = clean(formData.get("call_name"));
  if (!puppyName && !callName) redirect("/dashboard/puppies/new?error=missing_name");

  const litterId = await resolveLitter(admin, organizationId, clean(formData.get("litter_name")));
  const buyerId = await resolveBuyer(admin, organizationId, clean(formData.get("buyer_name")));
  const payload = buildPayload(formData, organizationId, litterId, buyerId);

  const { data: puppy, error } = await admin.from("puppies").insert(payload).select("id,price,deposit,balance").single();
  if (error) redirect(`/dashboard/puppies/new?error=save_failed&message=${encodeURIComponent(error.message.slice(0,220))}`);

  if (buyerId && puppy?.id) {
    await ensurePaymentAccount(admin, organizationId, buyerId, puppy.id, puppy.price, puppy.deposit, puppy.balance);
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/puppies");
  revalidatePath("/dashboard/litters");
  revalidatePath("/dashboard/buyers");
  redirect("/dashboard/puppies?created=1");
}

export async function updatePuppyRecord(formData: FormData) {
  const admin = createSupabaseAdminClient();
  const organizationId = await getCurrentOrganizationId();
  const puppyId = clean(formData.get("puppy_id"));
  if (!admin || !organizationId || !puppyId) redirect("/dashboard/puppies?error=config");

  const litterId = await resolveLitter(admin, organizationId, clean(formData.get("litter_name")));
  const buyerId = await resolveBuyer(admin, organizationId, clean(formData.get("buyer_name")));
  const { organization_id, ...payload } = buildPayload(formData, organizationId, litterId, buyerId);

  const { data: puppy, error } = await admin.from("puppies").update({ ...payload, updated_at: new Date().toISOString() }).eq("id", puppyId).eq("organization_id", organizationId).select("id,price,deposit,balance").single();
  if (error) redirect(`/dashboard/puppies/${puppyId}/edit?error=save_failed&message=${encodeURIComponent(error.message.slice(0,220))}`);

  if (buyerId && puppy?.id) {
    await ensurePaymentAccount(admin, organizationId, buyerId, puppy.id, puppy.price, puppy.deposit, puppy.balance);
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/puppies");
  revalidatePath("/dashboard/buyers");
  redirect("/dashboard/puppies?updated=1");
}

export async function deletePuppyRecord(formData: FormData) {
  const admin = createSupabaseAdminClient();
  const organizationId = await getCurrentOrganizationId();
  const puppyId = clean(formData.get("puppy_id"));
  if (!admin || !organizationId || !puppyId) redirect("/dashboard/puppies?error=delete_failed");
  const { error } = await admin.from("puppies").delete().eq("id", puppyId).eq("organization_id", organizationId);
  if (error) redirect(`/dashboard/puppies?error=delete_failed&message=${encodeURIComponent(error.message.slice(0,220))}`);
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/puppies");
  redirect("/dashboard/puppies?deleted=1");
}

async function resolveLitter(admin: any, organizationId: string, litterName: string) {
  if (!litterName) return null;
  const { data: existing } = await admin.from("litters").select("id").eq("organization_id", organizationId).ilike("litter_name", litterName).maybeSingle();
  if (existing?.id) return existing.id;
  const { data: created } = await admin.from("litters").insert({ organization_id: organizationId, litter_name: litterName, status: "planned" }).select("id").single();
  return created?.id ?? null;
}

async function resolveBuyer(admin: any, organizationId: string, buyerName: string) {
  if (!buyerName) return null;
  const { data: existing } = await admin.from("buyers").select("id").eq("organization_id", organizationId).ilike("full_name", buyerName).maybeSingle();
  if (existing?.id) return existing.id;
  const emailLocalPart = buyerName.toLowerCase().replace(/[^a-z0-9]+/g, ".").replace(/^\.+|\.+$/g, "") || "buyer";
  const { data: created } = await admin.from("buyers").insert({ organization_id: organizationId, full_name: buyerName, email: `${emailLocalPart}@placeholder.local`, status: "pending" }).select("id").single();
  return created?.id ?? null;
}

async function ensurePaymentAccount(admin: any, organizationId: string, buyerId: string, puppyId: string, price: number | string | null, deposit: number | string | null, balance: number | string | null) {
  const { data: existing } = await admin.from("buyer_payment_accounts").select("id").eq("organization_id", organizationId).eq("buyer_id", buyerId).eq("puppy_id", puppyId).maybeSingle();
  const salePrice = toNumber(price);
  const depositAmount = toNumber(deposit);
  const accountBalance = balance === null || balance === undefined ? Math.max(0, salePrice - depositAmount) : toNumber(balance);
  const accountPayload = { sale_price: salePrice, deposit_amount: depositAmount, balance: accountBalance, updated_at: new Date().toISOString() };
  if (existing?.id) {
    await admin.from("buyer_payment_accounts").update(accountPayload).eq("id", existing.id);
    return existing.id;
  }
  const { data: created } = await admin.from("buyer_payment_accounts").insert({ organization_id: organizationId, buyer_id: buyerId, puppy_id: puppyId, ...accountPayload }).select("id").single();
  return created?.id ?? null;
}

function buildPayload(formData: FormData, organizationId: string, litterId: string | null, buyerId: string | null) {
  const price = toNumberOrNull(formData.get("price"));
  const deposit = toNumberOrNull(formData.get("deposit"));
  const balanceInput = toNumberOrNull(formData.get("balance"));
  return {
    organization_id: organizationId,
    litter_id: litterId,
    buyer_id: buyerId,
    puppy_name: clean(formData.get("puppy_name")) || null,
    call_name: clean(formData.get("call_name")) || null,
    sex: clean(formData.get("sex")) || null,
    color: clean(formData.get("color")) || null,
    coat: clean(formData.get("coat")) || null,
    pattern: clean(formData.get("pattern")) || null,
    status: normalizeStatus(formData.get("status")),
    date_of_birth: clean(formData.get("date_of_birth")) || null,
    registry: clean(formData.get("registry")) || null,
    price,
    deposit,
    balance: balanceInput ?? (price !== null ? Math.max(0, price - (deposit ?? 0)) : null),
    photo_url: clean(formData.get("photo_url")) || null,
    description: clean(formData.get("description")) || null,
    notes: clean(formData.get("notes")) || null,
    is_public: checkbox(formData.get("is_public"), true),
    portal_visible: checkbox(formData.get("portal_visible"), true),
    retained_for_program: checkbox(formData.get("retained_for_program"), false),
    go_home_ready: checkbox(formData.get("go_home_ready"), false),
  };
}

function clean(value: FormDataEntryValue | null) { return String(value || "").trim(); }
function normalizeStatus(value: FormDataEntryValue | null) { const status = clean(value).toLowerCase(); return allowedStatuses.has(status) ? status : "available"; }
function checkbox(value: FormDataEntryValue | null, fallback: boolean) { if (value === null) return fallback; return value === "on" || value === "true" || value === "1"; }
function toNumber(value: number | string | null | undefined) { const n = Number(value ?? 0); return Number.isFinite(n) ? n : 0; }
function toNumberOrNull(value: FormDataEntryValue | null) { const raw = clean(value); if (!raw) return null; const n = Number(raw); return Number.isFinite(n) ? n : null; }
