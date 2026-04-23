import { createSupabaseServerClient } from "@/lib/supabase";
import type { BreederWebsite, GeneratedDocument } from "@/types";

type GeneratedDocumentRow = {
  id: string;
  breeder_id: string;
  document_type: string;
  state: string;
  content_text: string;
  pdf_url: string | null;
  created_at: string;
  updated_at: string;
};

type BreederWebsiteRow = {
  id: string;
  breeder_id: string;
  site_json: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
};

export type AiWorkspaceData = {
  generatedDocuments: GeneratedDocument[];
  breederWebsites: BreederWebsite[];
};

const emptyAiWorkspaceData: AiWorkspaceData = {
  generatedDocuments: [],
  breederWebsites: [],
};

export async function getAiWorkspaceData(organizationId: string): Promise<AiWorkspaceData> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return emptyAiWorkspaceData;
  }

  const [documentsResult, websitesResult] = await Promise.all([
    supabase
      .from("generated_documents")
      .select("*")
      .eq("breeder_id", organizationId)
      .order("created_at", { ascending: false })
      .returns<GeneratedDocumentRow[]>(),
    supabase
      .from("breeder_websites")
      .select("*")
      .eq("breeder_id", organizationId)
      .order("created_at", { ascending: false })
      .returns<BreederWebsiteRow[]>(),
  ]);

  return {
    generatedDocuments: (documentsResult.data ?? []).map(mapGeneratedDocument),
    breederWebsites: (websitesResult.data ?? []).map(mapBreederWebsite),
  };
}

function mapGeneratedDocument(row: GeneratedDocumentRow): GeneratedDocument {
  return {
    id: row.id,
    breederId: row.breeder_id,
    documentType: row.document_type,
    state: row.state,
    contentText: row.content_text,
    pdfUrl: row.pdf_url,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapBreederWebsite(row: BreederWebsiteRow): BreederWebsite {
  return {
    id: row.id,
    breederId: row.breeder_id,
    siteJson: row.site_json ?? {},
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
