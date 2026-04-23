import type { Metadata } from "next";
import { getSubscriptionForOrganization, requireAdminOrganization } from "@/lib/auth";
import { getAutomationWorkspaceData } from "@/lib/automation-data";
import { getBusinessWorkspaceData } from "@/lib/business-data";
import { hasFeatureAccess } from "@/lib/upgrade";
import { PaymentsWorkspace } from "@/components/admin/payments-workspace";
import { LockedWorkspace } from "@/components/admin/locked-workspace";

export const metadata: Metadata = {
  title: "Payments",
};

export default async function PaymentsPage() {
  const organization = await requireAdminOrganization();
  const subscription = await getSubscriptionForOrganization(organization.id);

  if (!hasFeatureAccess(subscription.planKey, "payments")) {
    return (
      <LockedWorkspace
        eyebrow="Financial control"
        title="Payments"
        description="Track payments, balances, and buyer account activity in one breeder ledger."
        currentPlan={subscription.planKey}
        featureKey="payments"
        sourceArea="/admin/payments"
        promptTitle="Track payments without spreadsheets"
        promptBody="Keep deposits, balances, and buyer payment records organized in one place."
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

  return <PaymentsWorkspace business={business} automation={automation} />;
}
