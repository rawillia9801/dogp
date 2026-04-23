import { NextRequest, NextResponse } from "next/server";
import { getOptionalAdminOrganization, getSubscriptionForOrganization } from "@/lib/auth";
import { generateDocumentDraft } from "@/lib/ai-service";
import { hasFeatureAccess } from "@/lib/upgrade";
import { logUpgradeEvent } from "@/lib/upgrade-service";

export async function POST(request: NextRequest) {
  const organization = await getOptionalAdminOrganization();

  if (!organization) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const subscription = await getSubscriptionForOrganization(organization.id);

  if (!hasFeatureAccess(subscription.planKey, "ai_documents")) {
    await logUpgradeEvent({
      organizationId: organization.id,
      triggerType: "feature_lock_click",
      sourceArea: "/api/admin/documents/ai/generate",
      currentPlan: subscription.planName,
      suggestedPlan: "Premium",
      metadata: { featureKey: "ai_documents" },
    });

    return NextResponse.json({ error: "AI Documents is available in the Premium plan." }, { status: 403 });
  }

  const body = (await request.json().catch(() => ({}))) as {
    state?: string;
    documentType?: string;
    refundPolicy?: string;
    healthTerms?: string;
    paymentStructure?: string;
    breederGuarantees?: string;
    buyerResponsibilities?: string;
  };

  if (!body.state || !body.documentType) {
    return NextResponse.json({ error: "State and document type are required." }, { status: 400 });
  }

  try {
    const document = await generateDocumentDraft({
      organization,
      documentType: body.documentType,
      state: body.state,
      options: {
        refundPolicy: body.refundPolicy ?? "",
        healthTerms: body.healthTerms ?? "",
        paymentStructure: body.paymentStructure ?? "",
        breederGuarantees: body.breederGuarantees ?? "",
        buyerResponsibilities: body.buyerResponsibilities ?? "",
      },
    });

    return NextResponse.json({ ok: true, document });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Document generation failed." },
      { status: 500 },
    );
  }
}
