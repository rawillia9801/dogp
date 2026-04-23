import type { AutomationWorkspaceData } from "@/lib/automation-data";
import type { BreederWorkspaceData } from "@/lib/breeder-data";
import type { BusinessWorkspaceData } from "@/lib/business-data";
import { AutomationWorkspaceClient } from "@/components/admin/automation-workspace-client";

export function AutomationWorkspace({
  automation,
  business,
  breeder,
}: {
  automation: AutomationWorkspaceData;
  business: BusinessWorkspaceData;
  breeder: BreederWorkspaceData;
}) {
  return (
    <AutomationWorkspaceClient
      key={`${automation.templates.map((template) => template.updatedAt).join(",")}|${automation.rules.map((rule) => rule.updatedAt).join(",")}|${automation.logs[0]?.updatedAt ?? "no-log"}`}
      automation={automation}
      business={business}
      breeder={breeder}
    />
  );
}
