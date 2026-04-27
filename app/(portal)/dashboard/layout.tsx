import type { ReactNode } from "react";
import { getSubscriptionForOrganization, requireOrganization } from "@/lib/auth";
import { SubscriberShell } from "@/components/layout/subscriber-shell";

export default async function SubscriberDashboardLayout({ children }: { children: ReactNode }) {
  const organization = await requireOrganization();
  const subscription = await getSubscriptionForOrganization(organization.id);

  return <SubscriberShell organization={organization} subscription={subscription}>{children}</SubscriberShell>;
}
