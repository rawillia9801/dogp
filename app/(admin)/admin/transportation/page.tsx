import type { Metadata } from "next";
import { requireAdminOrganization } from "@/lib/auth";
import { getAutomationWorkspaceData } from "@/lib/automation-data";
import { getBreederWorkspaceData } from "@/lib/breeder-data";
import { getBusinessWorkspaceData } from "@/lib/business-data";
import { TransportationWorkspace } from "@/components/admin/transportation-workspace";

export const metadata: Metadata = {
  title: "Transportation",
};

export default async function TransportationPage() {
  const organization = await requireAdminOrganization();
  const [business, breeder, automation] = await Promise.all([
    getBusinessWorkspaceData(organization.id),
    getBreederWorkspaceData(organization.id),
    getAutomationWorkspaceData(organization.id),
  ]);

  return <TransportationWorkspace business={business} breeder={breeder} automation={automation} />;
}
