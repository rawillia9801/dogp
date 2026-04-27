import { createSupabaseAdminClient } from "@/lib/supabase";
import { getCurrentOrganizationId } from "@/lib/dogs-data";

export async function getLittersWorkspaceData() {
  const admin = createSupabaseAdminClient();
  const organizationId = await getCurrentOrganizationId();
  if (!admin || !organizationId) return [];

  const { data, error } = await admin
    .from("litters")
    .select("id,litter_name,status,bred_date,pregnancy_confirmed_at,due_date,whelp_date,expected_size,reservation_goal,notes,dam_id,sire_id,breeding_dogs!litters_dam_id_fkey(dog_name,call_name),sire:breeding_dogs!litters_sire_id_fkey(dog_name,call_name)")
    .eq("organization_id", organizationId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Litters workspace query failed", error.message);
    return [];
  }

  return data || [];
}

export async function getBuyersWorkspaceData() {
  const admin = createSupabaseAdminClient();
  const organizationId = await getCurrentOrganizationId();
  if (!admin || !organizationId) return [];

  const { data, error } = await admin
    .from("buyers")
    .select("id,full_name,email,phone,status,city,state,notes,buyer_payment_accounts(id,sale_price,deposit_amount,balance,billing_status,puppies(id,puppy_name,call_name,status))")
    .eq("organization_id", organizationId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Buyers workspace query failed", error.message);
    return [];
  }

  return data || [];
}

export async function getPuppiesWorkspaceData() {
  const admin = createSupabaseAdminClient();
  const organizationId = await getCurrentOrganizationId();
  if (!admin || !organizationId) return [];

  const { data, error } = await admin
    .from("puppies")
    .select("id,litter_id,buyer_id,puppy_name,call_name,sex,color,coat,pattern,status,date_of_birth,registry,price,deposit,balance,photo_url,description,notes,is_public,portal_visible,retained_for_program,go_home_ready,litters(litter_name),buyers(full_name)")
    .eq("organization_id", organizationId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Puppies workspace query failed", error.message);
    return [];
  }

  return data || [];
}

export async function getPaymentsWorkspaceData() {
  const admin = createSupabaseAdminClient();
  const organizationId = await getCurrentOrganizationId();
  if (!admin || !organizationId) return [];

  const { data, error } = await admin
    .from("buyer_payments")
    .select("id,amount,payment_date,payment_type,payment_method,status,note,buyers(full_name),buyer_payment_accounts(id,balance,puppies(puppy_name,call_name))")
    .eq("organization_id", organizationId)
    .order("payment_date", { ascending: false });

  if (error) {
    console.error("Payments workspace query failed", error.message);
    return [];
  }

  return (data || []).filter((row: any) => row.buyers).map((row: any) => ({
    ...row,
    type: row.payment_type ?? "payment",
    method: row.payment_method ?? "manual",
  }));
}
