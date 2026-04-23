import { NextRequest, NextResponse } from "next/server";
import { getOptionalAdminOrganization, getSubscriptionForOrganization } from "@/lib/auth";
import { updateBreederWebsite } from "@/lib/ai-service";
import { hasFeatureAccess } from "@/lib/upgrade";
import { logUpgradeEvent } from "@/lib/upgrade-service";

export async function PATCH(request: NextRequest, context: { params: Promise<{ websiteId: string }> }) {
  const organization = await getOptionalAdminOrganization();

  if (!organization) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const subscription = await getSubscriptionForOrganization(organization.id);

  if (!hasFeatureAccess(subscription.planKey, "website_builder")) {
    await logUpgradeEvent({
      organizationId: organization.id,
      triggerType: "feature_lock_click",
      sourceArea: "/api/admin/website-builder",
      currentPlan: subscription.planName,
      suggestedPlan: "Premium",
      metadata: { featureKey: "website_builder" },
    });

    return NextResponse.json({ error: "Website Builder is available in the Premium plan." }, { status: 403 });
  }

  const body = (await request.json().catch(() => ({}))) as { siteJson?: Record<string, unknown> };
  const { websiteId } = await context.params;

  if (!body.siteJson) {
    return NextResponse.json({ error: "Site data is required." }, { status: 400 });
  }

  try {
    await updateBreederWebsite({
      organizationId: organization.id,
      websiteId,
      siteJson: body.siteJson,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Website update failed." },
      { status: 500 },
    );
  }
}
