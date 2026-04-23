import { NextRequest, NextResponse } from "next/server";
import { getOptionalAdminOrganization, getSubscriptionForOrganization } from "@/lib/auth";
import { getChiChiResponse } from "@/lib/ai-service";
import { getBillingHref, hasFeatureAccess } from "@/lib/upgrade";
import { logUpgradeEvent } from "@/lib/upgrade-service";

export async function POST(request: NextRequest) {
  const organization = await getOptionalAdminOrganization();

  if (!organization) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const subscription = await getSubscriptionForOrganization(organization.id);

  const body = (await request.json().catch(() => ({}))) as { message?: string };

  if (!body.message || body.message.trim().length === 0) {
    return NextResponse.json({ error: "A message is required." }, { status: 400 });
  }

  if (!hasFeatureAccess(subscription.planKey, "chichi_advanced")) {
    await logUpgradeEvent({
      organizationId: organization.id,
      triggerType: "feature_lock_click",
      sourceArea: "/api/chichi",
      currentPlan: subscription.planName,
      suggestedPlan: "Premium",
      metadata: { featureKey: "chichi_advanced" },
    });

    return NextResponse.json({
      answer: "ChiChi AI is available with Premium. Use Premium to generate breeder documents, build your website, and work with AI-assisted summaries and next actions.",
      actions: [
        {
          type: "route",
          label: "View Plans",
          route: getBillingHref("elite", "chichi_advanced", "chichi-assistant"),
        },
      ],
    });
  }

  try {
    const response = await getChiChiResponse({
      organization,
      message: body.message,
    });

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "ChiChi could not complete that request." },
      { status: 500 },
    );
  }
}
