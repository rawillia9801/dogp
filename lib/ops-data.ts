import { createSupabaseAdminClient } from "@/lib/supabase";
import { getCurrentOrganizationId } from "@/lib/dogs-data";

export async function getLittersWorkspaceData() {
  const admin = createSupabaseAdminClient();
  const organizationId = await getCurrentOrganizationId();
  if (!admin || !organizationId) return [];

  const { data } = await admin
    .from("litters")
    .select("id,litter_name,status,breeding_date,due_date,whelp_date,expected_size,reservation_goal,notes")
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

export async function getPaymentsWorkspaceData() {
  const admin = createSupabaseAdminClient();
  const organizationId = await getCurrentOrganizationId();
  if (!admin || !organizationId) return [];

  const { data } = await admin
    .from("buyer_payments")
    .select("id,amount,payment_date,type,method,status,buyers(full_name)")
    .order("payment_date", { ascending: false });

  return (data || []).filter((row: any) => row.buyers);
}
