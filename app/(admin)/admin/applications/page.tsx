import type { Metadata } from "next";
import { getSubscriptionForOrganization, requireAdminOrganization } from "@/lib/auth";
import { getBusinessWorkspaceData } from "@/lib/business-data";
import { hasFeatureAccess } from "@/lib/upgrade";
import { ApplicationsWorkspace } from "@/components/admin/applications-workspace";
import { LockedWorkspace } from "@/components/admin/locked-workspace";

export const metadata: Metadata = {
  title: "Applications",
};

export default async function ApplicationsPage() {
  const organization = await requireAdminOrganization();
  const subscription = await getSubscriptionForOrganization(organization.id);

  if (!hasFeatureAccess(subscription.planKey, "applications")) {
    return (
      <LockedWorkspace
        eyebrow="Intake pipeline"
        title="Applications"
        description="Review and manage incoming buyer applications inside one breeder intake pipeline."
        currentPlan={subscription.planKey}
        featureKey="applications"
        sourceArea="/admin/applications"
        promptTitle="Upgrade to unlock this workspace"
        promptBody="This feature is available in the Professional plan. Manage buyers, payments, records, and day-to-day business operations in one place."
        suggestedPlan="pro"
        primaryLabel="Upgrade to Professional"
        secondaryLabel="View Plans"
      />
    );
  }

  const business = await getBusinessWorkspaceData(organization.id);

  return <ApplicationsWorkspace business={business} />;
}
