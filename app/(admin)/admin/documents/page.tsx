import type { Metadata } from "next";
import { requireAdminOrganization } from "@/lib/auth";
import { getAutomationWorkspaceData } from "@/lib/automation-data";
import { getBusinessWorkspaceData } from "@/lib/business-data";
import { DocumentsWorkspace } from "@/components/admin/documents-workspace";

export const metadata: Metadata = {
  title: "Documents",
};

export default async function DocumentsPage() {
  const organization = await requireAdminOrganization();
  const [business, automation] = await Promise.all([
    getBusinessWorkspaceData(organization.id),
    getAutomationWorkspaceData(organization.id),
  ]);

  return <DocumentsWorkspace business={business} automation={automation} />;
}
