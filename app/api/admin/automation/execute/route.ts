import { NextResponse } from "next/server";
import { getOptionalAdminOrganization, getSubscriptionForOrganization } from "@/lib/auth";
import { runAutomationEngine } from "@/lib/automation-service";
import { hasFeatureAccess } from "@/lib/upgrade";
import { logUpgradeEvent } from "@/lib/upgrade-service";

export async function POST() {
  const organization = await getOptionalAdminOrganization();

  if (!organization) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const subscription = await getSubscriptionForOrganization(organization.id);

  if (!hasFeatureAccess(subscription.planKey, "automation")) {
    await logUpgradeEvent({
      organizationId: organization.id,
      triggerType: "feature_lock_click",
      sourceArea: "/api/admin/automation/execute",
      currentPlan: subscription.planName,
      suggestedPlan: "Professional",
      metadata: { featureKey: "automation" },
    });

    return NextResponse.json({ error: "Automation is available in the Professional plan." }, { status: 403 });
  }

  try {
    const result = await runAutomationEngine(organization.id);
    return NextResponse.json({ ok: true, result });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Automation run failed." },
      { status: 500 },
    );
  }
}
