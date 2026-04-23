import { NextRequest, NextResponse } from "next/server";
import { getOptionalAdminOrganization } from "@/lib/auth";
import { sendTestEmail } from "@/lib/automation-service";

type TestPayload = {
  templateKey?: string;
  buyerId?: string | null;
};

export async function POST(request: NextRequest) {
  const organization = await getOptionalAdminOrganization();

  if (!organization) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as TestPayload;

  if (!body.templateKey) {
    return NextResponse.json({ error: "Template key is required." }, { status: 400 });
  }

  try {
    const result = await sendTestEmail(organization.id, body.templateKey, body.buyerId ?? null);
    return NextResponse.json({ ok: true, result });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Test email failed." },
      { status: 500 },
    );
  }
}
