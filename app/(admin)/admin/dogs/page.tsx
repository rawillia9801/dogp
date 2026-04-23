import type { Metadata } from "next";
import { requireAdminOrganization } from "@/lib/auth";
import { getBreederWorkspaceData } from "@/lib/breeder-data";
import { DogsWorkspace } from "@/components/admin/dogs-workspace";

export const metadata: Metadata = {
  title: "Dogs",
};

export default async function DogsPage() {
  const organization = await requireAdminOrganization();
  const data = await getBreederWorkspaceData(organization.id);

  return <DogsWorkspace data={data} />;
}
