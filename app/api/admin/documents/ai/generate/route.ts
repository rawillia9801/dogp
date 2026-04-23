import { NextRequest, NextResponse } from "next/server";
import { getOptionalAdminOrganization } from "@/lib/auth";
import { generateDocumentDraft } from "@/lib/ai-service";

export async function POST(request: NextRequest) {
  const organization = await getOptionalAdminOrganization();

  if (!organization) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as {
    state?: string;
    documentType?: string;
    refundPolicy?: string;
    healthTerms?: string;
    paymentStructure?: string;
    breederGuarantees?: string;
    buyerResponsibilities?: string;
  };

  if (!body.state || !body.documentType) {
    return NextResponse.json({ error: "State and document type are required." }, { status: 400 });
  }

  try {
    const document = await generateDocumentDraft({
      organization,
      documentType: body.documentType,
      state: body.state,
      options: {
        refundPolicy: body.refundPolicy ?? "",
        healthTerms: body.healthTerms ?? "",
        paymentStructure: body.paymentStructure ?? "",
        breederGuarantees: body.breederGuarantees ?? "",
        buyerResponsibilities: body.buyerResponsibilities ?? "",
      },
    });

    return NextResponse.json({ ok: true, document });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Document generation failed." },
      { status: 500 },
    );
  }
}
