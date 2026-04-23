import type { Metadata } from "next";
import { getSubscriptionForOrganization, requireAdminOrganization } from "@/lib/auth";
import { getAiWorkspaceData } from "@/lib/ai-data";
import { hasFeatureAccess } from "@/lib/upgrade";
import { WebsiteBuilderWorkspaceClient } from "@/components/admin/website-builder-workspace-client";
import { LockedWorkspace } from "@/components/admin/locked-workspace";

export const metadata: Metadata = {
  title: "Website Builder",
};

export default async function WebsiteBuilderPage() {
  const organization = await requireAdminOrganization();
  const subscription = await getSubscriptionForOrganization(organization.id);

  if (!hasFeatureAccess(subscription.planKey, "website_builder")) {
    return (
      <LockedWorkspace
        eyebrow="DogBreederWeb"
        title="Website Builder"
        description="Generate and edit breeder website copy from inside your admin workspace."
        currentPlan={subscription.planKey}
        featureKey="website_builder"
        sourceArea="/admin/website-builder"
        promptTitle="Unlock AI tools"
        promptBody="Generate breeder documents, build your website, and use AI-assisted workflows with Premium."
        suggestedPlan="elite"
        primaryLabel="Upgrade to Premium"
        secondaryLabel="View Plans"
      />
    );
  }

  const ai = await getAiWorkspaceData(organization.id);

  return <WebsiteBuilderWorkspaceClient websites={ai.breederWebsites} />;
}
