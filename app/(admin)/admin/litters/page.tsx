import type { Metadata } from "next";
import { requireAdminOrganization } from "@/lib/auth";
import { getBreederWorkspaceData } from "@/lib/breeder-data";
import { LittersWorkspace } from "@/components/admin/litters-workspace";

export const metadata: Metadata = {
  title: "Litters",
};

export default async function LittersPage() {
  const organization = await requireAdminOrganization();
  const data = await getBreederWorkspaceData(organization.id);

  return <LittersWorkspace data={data} />;
}
