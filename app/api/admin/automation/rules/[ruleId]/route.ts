import { NextRequest, NextResponse } from "next/server";
import { getOptionalAdminOrganization, getSubscriptionForOrganization } from "@/lib/auth";
import { updateAutomationRule } from "@/lib/automation-service";
import { hasFeatureAccess } from "@/lib/upgrade";
import { logUpgradeEvent } from "@/lib/upgrade-service";

type RulePayload = {
  name?: string;
  triggerType?: string;
  conditionJson?: Record<string, unknown>;
  delayMinutes?: number;
  isActive?: boolean;
  templateKey?: string | null;
};

export async function PATCH(request: NextRequest, context: { params: Promise<{ ruleId: string }> }) {
  const organization = await getOptionalAdminOrganization();

  if (!organization) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const subscription = await getSubscriptionForOrganization(organization.id);

  if (!hasFeatureAccess(subscription.planKey, "automation")) {
    await logUpgradeEvent({
      organizationId: organization.id,
      triggerType: "feature_lock_click",
      sourceArea: "/api/admin/automation/rules",
      currentPlan: subscription.planName,
      suggestedPlan: "Professional",
      metadata: { featureKey: "automation" },
    });

    return NextResponse.json({ error: "Automation is available in the Professional plan." }, { status: 403 });
  }

  const { ruleId } = await context.params;
  const body = (await request.json().catch(() => ({}))) as RulePayload;

  if (!body.name || !body.triggerType || typeof body.delayMinutes !== "number") {
    return NextResponse.json({ error: "Invalid rule update payload." }, { status: 400 });
  }

  try {
    await updateAutomationRule(organization.id, {
      id: ruleId,
      name: body.name,
      triggerType: body.triggerType,
      conditionJson: body.conditionJson ?? {},
      delayMinutes: body.delayMinutes,
      isActive: body.isActive ?? true,
      templateKey: body.templateKey ?? null,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Rule update failed." },
      { status: 500 },
    );
  }
}
