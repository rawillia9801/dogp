import type { Metadata } from "next";
import { getSubscriptionForOrganization, requireAdminOrganization } from "@/lib/auth";
import { getAutomationWorkspaceData } from "@/lib/automation-data";
import { getBusinessWorkspaceData } from "@/lib/business-data";
import { hasFeatureAccess } from "@/lib/upgrade";
import { DocumentsWorkspace } from "@/components/admin/documents-workspace";
import { LockedWorkspace } from "@/components/admin/locked-workspace";

export const metadata: Metadata = {
  title: "Documents",
};

export default async function DocumentsPage() {
  const organization = await requireAdminOrganization();
  const subscription = await getSubscriptionForOrganization(organization.id);

  if (!hasFeatureAccess(subscription.planKey, "documents")) {
    return (
      <LockedWorkspace
        eyebrow="Document control"
        title="Documents"
        description="Manage contracts, agreements, and signed records inside the breeder document file."
        currentPlan={subscription.planKey}
        featureKey="documents"
        sourceArea="/admin/documents"
        promptTitle="Unlock document management"
        promptBody="Track contracts, signed records, and buyer documents in one place."
        suggestedPlan="pro"
        primaryLabel="Upgrade to Professional"
        secondaryLabel="View Plans"
      />
    );
  }

  const [business, automation] = await Promise.all([
    getBusinessWorkspaceData(organization.id),
    getAutomationWorkspaceData(organization.id),
  ]);

  return <DocumentsWorkspace business={business} automation={automation} subscription={subscription} />;
}
