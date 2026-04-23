import { NextResponse } from "next/server";
import { getOptionalAdminOrganization } from "@/lib/auth";
import { runAutomationEngine } from "@/lib/automation-service";

export async function POST() {
  const organization = await getOptionalAdminOrganization();

  if (!organization) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await runAutomationEngine(organization.id);
    return NextResponse.json({ ok: true, result });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Automation run failed." },
      { status: 500 },
    );
  }
}
