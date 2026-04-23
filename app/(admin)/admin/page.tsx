import type { Metadata } from "next";
import { requireAdminOrganization } from "@/lib/auth";
import { getBreederWorkspaceData } from "@/lib/breeder-data";
import { DashboardWorkspace } from "@/components/admin/dashboard-workspace";

export const metadata: Metadata = {
  title: "Admin",
};

export default async function AdminDashboardPage() {
  const organization = await requireAdminOrganization();
  const data = await getBreederWorkspaceData(organization.id);

  return <DashboardWorkspace data={data} />;
}
