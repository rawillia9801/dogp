import { createSupabaseAdminClient, isSupabaseConfigured } from "@/lib/supabase";
import type { UpgradeEventTrigger, UsageSummary } from "@/lib/upgrade";

export async function logUpgradeEvent({
  organizationId,
  triggerType,
  sourceArea,
  currentPlan,
  suggestedPlan,
  metadata,
}: {
  organizationId: string;
  triggerType: UpgradeEventTrigger;
  sourceArea: string;
  currentPlan: string;
  suggestedPlan: string;
  metadata?: Record<string, unknown>;
}) {
  const admin = createSupabaseAdminClient();

  if (!admin) {
    return;
  }

  await admin.from("upgrade_events").insert({
    organization_id: organizationId,
    trigger_type: triggerType,
    source_area: sourceArea,
    current_plan: currentPlan,
    suggested_plan: suggestedPlan,
    metadata_json: metadata ?? {},
  });
}

export async function getUsageSummary(organizationId: string): Promise<UsageSummary> {
  if (!isSupabaseConfigured()) {
    return {
      dogs: 0,
      litters: 0,
      users: 1,
      puppies: 0,
      buyers: 0,
      automationRuns: 0,
    };
  }

  const admin = createSupabaseAdminClient();

  if (!admin) {
    return {
      dogs: 0,
      litters: 0,
      users: 1,
      puppies: 0,
      buyers: 0,
      automationRuns: 0,
    };
  }

  const [dogs, litters, users, puppies, buyers, automationRuns] = await Promise.all([
    countRows(admin, "dogs", organizationId),
    countRows(admin, "litters", organizationId),
    countRows(admin, "organization_users", organizationId, "organization_id"),
    countRows(admin, "puppies", organizationId),
    countRows(admin, "buyers", organizationId),
    countRows(admin, "automation_runs", organizationId),
  ]);

  return {
    dogs,
    litters,
    users,
    puppies,
    buyers,
    automationRuns,
  };
}

async function countRows(
  admin: NonNullable<ReturnType<typeof createSupabaseAdminClient>>,
  table: string,
  organizationId: string,
  column = "organization_id",
) {
  const { count } = await admin
    .from(table)
    .select("*", { count: "exact", head: true })
    .eq(column, organizationId);

  return count ?? 0;
}
