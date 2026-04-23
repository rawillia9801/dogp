import { NextRequest, NextResponse } from "next/server";
import { getOptionalAdminOrganization } from "@/lib/auth";
import { getChiChiResponse } from "@/lib/ai-service";

export async function POST(request: NextRequest) {
  const organization = await getOptionalAdminOrganization();

  if (!organization) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as { message?: string };

  if (!body.message || body.message.trim().length === 0) {
    return NextResponse.json({ error: "A message is required." }, { status: 400 });
  }

  try {
    const response = await getChiChiResponse({
      organization,
      message: body.message,
    });

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "ChiChi could not complete that request." },
      { status: 500 },
    );
  }
}
