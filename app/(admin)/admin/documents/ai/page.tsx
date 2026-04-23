import type { Metadata } from "next";
import { requireAdminOrganization } from "@/lib/auth";
import { getAiWorkspaceData } from "@/lib/ai-data";
import { AiDocumentWorkspaceClient } from "@/components/admin/ai-document-workspace-client";

export const metadata: Metadata = {
  title: "AI Documents",
};

export default async function AiDocumentsPage() {
  const organization = await requireAdminOrganization();
  const ai = await getAiWorkspaceData(organization.id);

  return <AiDocumentWorkspaceClient documents={ai.generatedDocuments} />;
}
