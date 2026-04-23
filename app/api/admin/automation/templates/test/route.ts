import { NextRequest, NextResponse } from "next/server";
import { getOptionalAdminOrganization, getSubscriptionForOrganization } from "@/lib/auth";
import { sendTestEmail } from "@/lib/automation-service";
import { hasFeatureAccess } from "@/lib/upgrade";
import { logUpgradeEvent } from "@/lib/upgrade-service";

type TestPayload = {
  templateKey?: string;
  buyerId?: string | null;
};

export async function POST(request: NextRequest) {
  const organization = await getOptionalAdminOrganization();

  if (!organization) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const subscription = await getSubscriptionForOrganization(organization.id);

  if (!hasFeatureAccess(subscription.planKey, "automation")) {
    await logUpgradeEvent({
      organizationId: organization.id,
      triggerType: "feature_lock_click",
      sourceArea: "/api/admin/automation/templates/test",
      currentPlan: subscription.planName,
      suggestedPlan: "Professional",
      metadata: { featureKey: "automation" },
    });

    return NextResponse.json({ error: "Automation is available in the Professional plan." }, { status: 403 });
  }

  const body = (await request.json().catch(() => ({}))) as TestPayload;

  if (!body.templateKey) {
    return NextResponse.json({ error: "Template key is required." }, { status: 400 });
  }

  try {
    const result = await sendTestEmail(organization.id, body.templateKey, body.buyerId ?? null);
    return NextResponse.json({ ok: true, result });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Test email failed." },
      { status: 500 },
    );
  }
}
