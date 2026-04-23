import type { Metadata } from "next";
import { getSubscriptionForOrganization, requireAdminOrganization } from "@/lib/auth";
import { getAutomationWorkspaceData } from "@/lib/automation-data";
import { getBreederWorkspaceData } from "@/lib/breeder-data";
import { getBusinessWorkspaceData } from "@/lib/business-data";
import { hasFeatureAccess } from "@/lib/upgrade";
import { AutomationWorkspace } from "@/components/admin/automation-workspace";
import { LockedWorkspace } from "@/components/admin/locked-workspace";

export const metadata: Metadata = {
  title: "Automation",
};

export default async function AutomationPage() {
  const organization = await requireAdminOrganization();
  const subscription = await getSubscriptionForOrganization(organization.id);

  if (!hasFeatureAccess(subscription.planKey, "automation")) {
    return (
      <LockedWorkspace
        eyebrow="Automation command"
        title="Automation"
        description="Manage automated messages, reminders, notice rules, and workflow execution."
        currentPlan={subscription.planKey}
        featureKey="automation"
        sourceArea="/admin/automation"
        promptTitle="Unlock automation"
        promptBody="Send reminders, notices, and updates automatically with built-in workflows."
        suggestedPlan="pro"
        primaryLabel="Upgrade to Professional"
        secondaryLabel="View Plans"
      />
    );
  }

  const [automation, business, breeder] = await Promise.all([
    getAutomationWorkspaceData(organization.id),
    getBusinessWorkspaceData(organization.id),
    getBreederWorkspaceData(organization.id),
  ]);

  return <AutomationWorkspace automation={automation} business={business} breeder={breeder} />;
}
