import type { Metadata } from "next";
import { requireAdminOrganization } from "@/lib/auth";
import { getAutomationWorkspaceData } from "@/lib/automation-data";
import { getBusinessWorkspaceData } from "@/lib/business-data";
import { PaymentsWorkspace } from "@/components/admin/payments-workspace";

export const metadata: Metadata = {
  title: "Payments",
};

export default async function PaymentsPage() {
  const organization = await requireAdminOrganization();
  const [business, automation] = await Promise.all([
    getBusinessWorkspaceData(organization.id),
    getAutomationWorkspaceData(organization.id),
  ]);

  return <PaymentsWorkspace business={business} automation={automation} />;
}
