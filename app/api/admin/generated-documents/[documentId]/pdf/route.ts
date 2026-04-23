import { NextResponse } from "next/server";
import { getOptionalAdminOrganization, getSubscriptionForOrganization } from "@/lib/auth";
import { loadGeneratedDocumentPdf } from "@/lib/ai-service";
import { hasFeatureAccess } from "@/lib/upgrade";
import { logUpgradeEvent } from "@/lib/upgrade-service";

export async function GET(_: Request, context: { params: Promise<{ documentId: string }> }) {
  const organization = await getOptionalAdminOrganization();

  if (!organization) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const subscription = await getSubscriptionForOrganization(organization.id);

  if (!hasFeatureAccess(subscription.planKey, "ai_documents")) {
    await logUpgradeEvent({
      organizationId: organization.id,
      triggerType: "feature_lock_click",
      sourceArea: "/api/admin/generated-documents/pdf",
      currentPlan: subscription.planName,
      suggestedPlan: "Premium",
      metadata: { featureKey: "ai_documents" },
    });

    return NextResponse.json({ error: "AI Documents is available in the Premium plan." }, { status: 403 });
  }

  const { documentId } = await context.params;

  try {
    const pdf = await loadGeneratedDocumentPdf({
      organizationId: organization.id,
      documentId,
    });

    return new NextResponse(pdf, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="generated-document-${documentId}.pdf"`,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "PDF download failed." },
      { status: 500 },
    );
  }
}
