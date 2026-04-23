import type { Metadata } from "next";
import { getSubscriptionForOrganization, requireAdminOrganization } from "@/lib/auth";
import { getAutomationWorkspaceData } from "@/lib/automation-data";
import { getBreederWorkspaceData } from "@/lib/breeder-data";
import { getBusinessWorkspaceData } from "@/lib/business-data";
import { hasFeatureAccess } from "@/lib/upgrade";
import { TransportationWorkspace } from "@/components/admin/transportation-workspace";
import { LockedWorkspace } from "@/components/admin/locked-workspace";

export const metadata: Metadata = {
  title: "Transportation",
};

export default async function TransportationPage() {
  const organization = await requireAdminOrganization();
  const subscription = await getSubscriptionForOrganization(organization.id);

  if (!hasFeatureAccess(subscription.planKey, "transportation")) {
    return (
      <LockedWorkspace
        eyebrow="Delivery logistics"
        title="Transportation"
        description="Coordinate pickup, delivery, and handoff details without leaving the breeder workspace."
        currentPlan={subscription.planKey}
        featureKey="transportation"
        sourceArea="/admin/transportation"
        promptTitle="Upgrade to unlock this workspace"
        promptBody="This feature is available in the Professional plan. Manage buyers, payments, records, and day-to-day business operations in one place."
        suggestedPlan="pro"
        primaryLabel="Upgrade to Professional"
        secondaryLabel="View Plans"
      />
    );
  }

  const [business, breeder, automation] = await Promise.all([
    getBusinessWorkspaceData(organization.id),
    getBreederWorkspaceData(organization.id),
    getAutomationWorkspaceData(organization.id),
  ]);

  return <TransportationWorkspace business={business} breeder={breeder} automation={automation} />;
}
