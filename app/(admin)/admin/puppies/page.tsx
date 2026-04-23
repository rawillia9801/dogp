import type { Metadata } from "next";
import { requireAdminOrganization } from "@/lib/auth";
import { getAutomationWorkspaceData } from "@/lib/automation-data";
import { getBreederWorkspaceData } from "@/lib/breeder-data";
import { PuppiesWorkspace } from "@/components/admin/puppies-workspace";

export const metadata: Metadata = {
  title: "Puppies",
};

export default async function PuppiesPage() {
  const organization = await requireAdminOrganization();
  const [data, automation] = await Promise.all([
    getBreederWorkspaceData(organization.id),
    getAutomationWorkspaceData(organization.id),
  ]);

  return <PuppiesWorkspace data={data} automation={automation} />;
}
