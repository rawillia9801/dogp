import { NextRequest, NextResponse } from "next/server";
import { getOptionalAdminOrganization, getSubscriptionForOrganization } from "@/lib/auth";
import { updateGeneratedDocument } from "@/lib/ai-service";
import { hasFeatureAccess } from "@/lib/upgrade";
import { logUpgradeEvent } from "@/lib/upgrade-service";

export async function PATCH(request: NextRequest, context: { params: Promise<{ documentId: string }> }) {
  const organization = await getOptionalAdminOrganization();

  if (!organization) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const subscription = await getSubscriptionForOrganization(organization.id);

  if (!hasFeatureAccess(subscription.planKey, "ai_documents")) {
    await logUpgradeEvent({
      organizationId: organization.id,
      triggerType: "feature_lock_click",
      sourceArea: "/api/admin/generated-documents",
      currentPlan: subscription.planName,
      suggestedPlan: "Premium",
      metadata: { featureKey: "ai_documents" },
    });

    return NextResponse.json({ error: "AI Documents is available in the Premium plan." }, { status: 403 });
  }

  const body = (await request.json().catch(() => ({}))) as { contentText?: string };
  const { documentId } = await context.params;

  if (!body.contentText) {
    return NextResponse.json({ error: "Document text is required." }, { status: 400 });
  }

  try {
    await updateGeneratedDocument({
      organizationId: organization.id,
      documentId,
      contentText: body.contentText,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Document update failed." },
      { status: 500 },
    );
  }
}
