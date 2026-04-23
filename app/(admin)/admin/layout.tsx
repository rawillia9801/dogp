import type { ReactNode } from "react";
import { getSubscriptionForOrganization, requireAdminOrganization } from "@/lib/auth";
import { getUsageSummary } from "@/lib/upgrade-service";
import { getUsageUpgradePrompt } from "@/lib/upgrade";
import { AdminShell } from "@/components/layout/admin-shell";

export default async function Layout({ children }: { children: ReactNode }) {
  const organization = await requireAdminOrganization();
  const [subscription, usage] = await Promise.all([
    getSubscriptionForOrganization(organization.id),
    getUsageSummary(organization.id),
  ]);
  const usagePrompt = getUsageUpgradePrompt(subscription.planKey, usage);

  return (
    <AdminShell organization={organization} subscription={subscription} usagePrompt={usagePrompt}>
      {children}
    </AdminShell>
  );
}
