import { NextRequest, NextResponse } from "next/server";
import { getOptionalAdminOrganization } from "@/lib/auth";
import { updateBreederWebsite } from "@/lib/ai-service";

export async function PATCH(request: NextRequest, context: { params: Promise<{ websiteId: string }> }) {
  const organization = await getOptionalAdminOrganization();

  if (!organization) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as { siteJson?: Record<string, unknown> };
  const { websiteId } = await context.params;

  if (!body.siteJson) {
    return NextResponse.json({ error: "Site data is required." }, { status: 400 });
  }

  try {
    await updateBreederWebsite({
      organizationId: organization.id,
      websiteId,
      siteJson: body.siteJson,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Website update failed." },
      { status: 500 },
    );
  }
}
