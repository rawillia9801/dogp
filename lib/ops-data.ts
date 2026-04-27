import { createSupabaseAdminClient } from "@/lib/supabase";
import { getCurrentOrganizationId } from "@/lib/dogs-data";

export async function getLittersWorkspaceData() {
  const admin = createSupabaseAdminClient();
  const organizationId = await getCurrentOrganizationId();
  if (!admin || !organizationId) return [];

  const { data } = await admin
    .from("litters")
    .select("id,litter_name,status,bred_date,due_date,whelp_date,expected_size,reservation_goal,notes")
    .eq("organization_id", organizationId)
    .order("created_at", { ascending: false });

  return data || [];
}

export async function getBuyersWorkspaceData() {
  const admin = createSupabaseAdminClient();
  const organizationId = await getCurrentOrganizationId();
  if (!admin || !organizationId) return [];

  const { data } = await admin
    .from("buyers")
    .select("id,full_name,email,phone,status,city,state,notes")
    .eq("organization_id", organizationId)
    .order("created_at", { ascending: false });

  return data || [];
}

export async function getPuppiesWorkspaceData() {
  const admin = createSupabaseAdminClient();
  const organizationId = await getCurrentOrganizationId();
  if (!admin || !organizationId) return [];

  const { data } = await admin
    .from("puppies")
    .select("id,litter_id,buyer_id,puppy_name,call_name,sex,color,coat,pattern,status,date_of_birth,registry,price,deposit,balance,photo_url,description,notes,is_public,portal_visible,retained_for_program,go_home_ready,litters(litter_name),buyers(full_name)")
    .eq("organization_id", organizationId)
    .order("created_at", { ascending: false });

  return data || [];
}

export async function getPaymentsWorkspaceData() {
  const admin = createSupabaseAdminClient();
  const organizationId = await getCurrentOrganizationId();
  if (!admin || !organizationId) return [];

  const { data } = await admin
    .from("buyer_payments")
    .select("id,amount,payment_date,payment_type,payment_method,status,buyers(full_name)")
    .eq("organization_id", organizationId)
    .order("payment_date", { ascending: false });

  return (data || []).filter((row: any) => row.buyers);
}
