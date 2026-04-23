import { NextResponse } from "next/server";
import { getOptionalAdminOrganization } from "@/lib/auth";
import { loadGeneratedDocumentPdf } from "@/lib/ai-service";

export async function GET(_: Request, context: { params: Promise<{ documentId: string }> }) {
  const organization = await getOptionalAdminOrganization();

  if (!organization) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { documentId } = await context.params;

  try {
    const pdf = await loadGeneratedDocumentPdf({
      organizationId: organization.id,
      documentId,
    });

    return new NextResponse(pdf, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="generated-document-${documentId}.pdf"`,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "PDF download failed." },
      { status: 500 },
    );
  }
}
