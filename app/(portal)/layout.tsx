import type { ReactNode } from "react";
import { requireOrganization } from "@/lib/auth";
import { PortalShell } from "@/components/layout/portal-shell";

export default async function PortalGroupLayout({ children }: { children: ReactNode }) {
  const organization = await requireOrganization();
  return <PortalShell organization={organization}>{children}</PortalShell>;
}
