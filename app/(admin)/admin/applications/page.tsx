import type { Metadata } from "next";
import { requireAdminOrganization } from "@/lib/auth";
import { getBusinessWorkspaceData } from "@/lib/business-data";
import { ApplicationsWorkspace } from "@/components/admin/applications-workspace";

export const metadata: Metadata = {
  title: "Applications",
};

export default async function ApplicationsPage() {
  const organization = await requireAdminOrganization();
  const business = await getBusinessWorkspaceData(organization.id);

  return <ApplicationsWorkspace business={business} />;
}
