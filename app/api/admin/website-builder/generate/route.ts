import { NextRequest, NextResponse } from "next/server";
import { getOptionalAdminOrganization } from "@/lib/auth";
import { generateWebsiteDraft } from "@/lib/ai-service";

export async function POST(request: NextRequest) {
  const organization = await getOptionalAdminOrganization();

  if (!organization) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as {
    kennelName?: string;
    location?: string;
    breeds?: string;
    tone?: string;
    services?: string;
  };

  if (!body.kennelName || !body.location || !body.breeds || !body.tone || !body.services) {
    return NextResponse.json({ error: "Kennel name, location, breeds, tone, and services are required." }, { status: 400 });
  }

  try {
    const website = await generateWebsiteDraft({
      organization,
      input: {
        kennelName: body.kennelName,
        location: body.location,
        breeds: body.breeds,
        tone: body.tone,
        services: body.services,
      },
    });

    return NextResponse.json({ ok: true, website });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Website generation failed." },
      { status: 500 },
    );
  }
}
