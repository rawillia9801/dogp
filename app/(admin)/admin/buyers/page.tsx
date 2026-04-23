import type { Metadata } from "next";
import { requireAdminOrganization } from "@/lib/auth";
import { getAutomationWorkspaceData } from "@/lib/automation-data";
import { getBreederWorkspaceData } from "@/lib/breeder-data";
import { getBusinessWorkspaceData } from "@/lib/business-data";
import { BuyersWorkspace } from "@/components/admin/buyers-workspace";

export const metadata: Metadata = {
  title: "Buyers",
};

export default async function BuyersPage() {
  const organization = await requireAdminOrganization();
  const [business, breeder, automation] = await Promise.all([
    getBusinessWorkspaceData(organization.id),
    getBreederWorkspaceData(organization.id),
    getAutomationWorkspaceData(organization.id),
  ]);

  return <BuyersWorkspace business={business} breeder={breeder} automation={automation} />;
}
