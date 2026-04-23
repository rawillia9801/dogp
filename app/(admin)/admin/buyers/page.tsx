import type { Metadata } from "next";
import { getSubscriptionForOrganization, requireAdminOrganization } from "@/lib/auth";
import { getAutomationWorkspaceData } from "@/lib/automation-data";
import { getBreederWorkspaceData } from "@/lib/breeder-data";
import { getBusinessWorkspaceData } from "@/lib/business-data";
import { hasFeatureAccess } from "@/lib/upgrade";
import { BuyersWorkspace } from "@/components/admin/buyers-workspace";
import { LockedWorkspace } from "@/components/admin/locked-workspace";

export const metadata: Metadata = {
  title: "Buyers",
};

export default async function BuyersPage() {
  const organization = await requireAdminOrganization();
  const subscription = await getSubscriptionForOrganization(organization.id);

  if (!hasFeatureAccess(subscription.planKey, "buyers")) {
    return (
      <LockedWorkspace
        eyebrow="Buyer operations"
        title="Buyers"
        description="Manage buyer relationships, reservations, and placements in one breeder workspace."
        currentPlan={subscription.planKey}
        featureKey="buyers"
        sourceArea="/admin/buyers"
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

  return <BuyersWorkspace business={business} breeder={breeder} automation={automation} />;
}
