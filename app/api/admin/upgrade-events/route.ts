import { NextRequest, NextResponse } from "next/server";
import { getOptionalAdminOrganization, getSubscriptionForOrganization } from "@/lib/auth";
import { logUpgradeEvent } from "@/lib/upgrade-service";
import { displayPlanName, normalizePlanKey, suggestedPlanForFeature, type FeatureKey, type UpgradeEventTrigger } from "@/lib/upgrade";

type UpgradeEventPayload = {
  triggerType?: UpgradeEventTrigger;
  sourceArea?: string;
  currentPlan?: string;
  suggestedPlan?: string;
  metadata?: Record<string, unknown>;
};

export async function POST(request: NextRequest) {
  const organization = await getOptionalAdminOrganization();

  if (!organization) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as UpgradeEventPayload;

  if (!body.triggerType || !body.sourceArea) {
    return NextResponse.json({ error: "Trigger type and source area are required." }, { status: 400 });
  }

  const subscription = await getSubscriptionForOrganization(organization.id);
  const featureKey =
    typeof body.metadata?.featureKey === "string" ? (body.metadata.featureKey as FeatureKey) : undefined;
  const currentPlan = displayPlanName(normalizePlanKey(body.currentPlan ?? subscription.planKey));
  const suggestedPlan = displayPlanName(
    normalizePlanKey(body.suggestedPlan ?? (featureKey ? suggestedPlanForFeature(featureKey) : "pro")),
  );

  await logUpgradeEvent({
    organizationId: organization.id,
    triggerType: body.triggerType,
    sourceArea: body.sourceArea,
    currentPlan,
    suggestedPlan,
    metadata: body.metadata,
  });

  return NextResponse.json({ ok: true });
}
