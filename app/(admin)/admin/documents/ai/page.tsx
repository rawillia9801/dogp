import type { Metadata } from "next";
import { getSubscriptionForOrganization, requireAdminOrganization } from "@/lib/auth";
import { getAiWorkspaceData } from "@/lib/ai-data";
import { hasFeatureAccess } from "@/lib/upgrade";
import { AiDocumentWorkspaceClient } from "@/components/admin/ai-document-workspace-client";
import { LockedWorkspace } from "@/components/admin/locked-workspace";

export const metadata: Metadata = {
  title: "AI Documents",
};

export default async function AiDocumentsPage() {
  const organization = await requireAdminOrganization();
  const subscription = await getSubscriptionForOrganization(organization.id);

  if (!hasFeatureAccess(subscription.planKey, "ai_documents")) {
    return (
      <LockedWorkspace
        eyebrow="DogBreederDocs"
        title="AI Documents"
        description="Generate structured breeder agreements with editable saved copies and PDF output."
        currentPlan={subscription.planKey}
        featureKey="ai_documents"
        sourceArea="/admin/documents/ai"
        promptTitle="Unlock AI tools"
        promptBody="Generate breeder documents, build your website, and use AI-assisted workflows with Premium."
        suggestedPlan="elite"
        primaryLabel="Upgrade to Premium"
        secondaryLabel="View Plans"
      />
    );
  }

  const ai = await getAiWorkspaceData(organization.id);

  return <AiDocumentWorkspaceClient documents={ai.generatedDocuments} />;
}
