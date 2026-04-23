import { NextRequest, NextResponse } from "next/server";
import { getOptionalAdminOrganization, getSubscriptionForOrganization } from "@/lib/auth";
import { generateWebsiteDraft } from "@/lib/ai-service";
import { hasFeatureAccess } from "@/lib/upgrade";
import { logUpgradeEvent } from "@/lib/upgrade-service";

export async function POST(request: NextRequest) {
  const organization = await getOptionalAdminOrganization();

  if (!organization) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const subscription = await getSubscriptionForOrganization(organization.id);

  if (!hasFeatureAccess(subscription.planKey, "website_builder")) {
    await logUpgradeEvent({
      organizationId: organization.id,
      triggerType: "feature_lock_click",
      sourceArea: "/api/admin/website-builder/generate",
      currentPlan: subscription.planName,
      suggestedPlan: "Premium",
      metadata: { featureKey: "website_builder" },
    });

    return NextResponse.json({ error: "Website Builder is available in the Premium plan." }, { status: 403 });
  }

  const body = (await request.json().catch(() => ({}))) as {
    kennelName?: string;
    location?: string;
    breeds?: string;
    tone?: string;
    services?: string;
  };

  if (!body.kennelName || !body.location || !body.breeds || !body.tone || !body.services) {
    return NextResponse.json({ error: "Kennel name, location, breeds, tone, and services are required." }, { status: 400 });
  }

  try {
    const website = await generateWebsiteDraft({
      organization,
      input: {
        kennelName: body.kennelName,
        location: body.location,
        breeds: body.breeds,
        tone: body.tone,
        services: body.services,
      },
    });

    return NextResponse.json({ ok: true, website });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Website generation failed." },
      { status: 500 },
    );
  }
}
