import type { Metadata } from "next";
import { requireAdminOrganization } from "@/lib/auth";
import { getBreederWorkspaceData } from "@/lib/breeder-data";
import { BreedingProgramWorkspace } from "@/components/admin/breeding-program-workspace";

export const metadata: Metadata = {
  title: "Breeding Program",
};

export default async function BreedingProgramPage() {
  const organization = await requireAdminOrganization();
  const data = await getBreederWorkspaceData(organization.id);

  return <BreedingProgramWorkspace data={data} />;
}
