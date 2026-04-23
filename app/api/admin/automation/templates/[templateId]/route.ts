import { NextRequest, NextResponse } from "next/server";
import { getOptionalAdminOrganization } from "@/lib/auth";
import { updateEmailTemplate } from "@/lib/automation-service";

type TemplatePayload = {
  subject?: string;
  body?: string;
  variables?: string[];
  isActive?: boolean;
};

export async function PATCH(request: NextRequest, context: { params: Promise<{ templateId: string }> }) {
  const organization = await getOptionalAdminOrganization();

  if (!organization) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { templateId } = await context.params;
  const body = (await request.json().catch(() => ({}))) as TemplatePayload;

  if (!body.subject || !body.body) {
    return NextResponse.json({ error: "Invalid template update payload." }, { status: 400 });
  }

  try {
    await updateEmailTemplate(organization.id, {
      id: templateId,
      subject: body.subject,
      body: body.body,
      variables: body.variables ?? [],
      isActive: body.isActive ?? true,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Template update failed." },
      { status: 500 },
    );
  }
}
