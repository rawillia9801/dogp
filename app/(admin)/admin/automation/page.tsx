import type { Metadata } from "next";
import { requireAdminOrganization } from "@/lib/auth";
import { getAutomationWorkspaceData } from "@/lib/automation-data";
import { getBreederWorkspaceData } from "@/lib/breeder-data";
import { getBusinessWorkspaceData } from "@/lib/business-data";
import { AutomationWorkspace } from "@/components/admin/automation-workspace";

export const metadata: Metadata = {
  title: "Automation",
};

export default async function AutomationPage() {
  const organization = await requireAdminOrganization();
  const [automation, business, breeder] = await Promise.all([
    getAutomationWorkspaceData(organization.id),
    getBusinessWorkspaceData(organization.id),
    getBreederWorkspaceData(organization.id),
  ]);

  return <AutomationWorkspace automation={automation} business={business} breeder={breeder} />;
}
