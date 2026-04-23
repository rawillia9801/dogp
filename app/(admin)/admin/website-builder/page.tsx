import type { Metadata } from "next";
import { requireAdminOrganization } from "@/lib/auth";
import { getAiWorkspaceData } from "@/lib/ai-data";
import { WebsiteBuilderWorkspaceClient } from "@/components/admin/website-builder-workspace-client";

export const metadata: Metadata = {
  title: "Website Builder",
};

export default async function WebsiteBuilderPage() {
  const organization = await requireAdminOrganization();
  const ai = await getAiWorkspaceData(organization.id);

  return <WebsiteBuilderWorkspaceClient websites={ai.breederWebsites} />;
}
