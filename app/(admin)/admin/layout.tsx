import type { ReactNode } from "react";
import { requireAdminOrganization } from "@/lib/auth";
import { AdminShell } from "@/components/layout/admin-shell";

export default async function Layout({ children }: { children: ReactNode }) {
  const organization = await requireAdminOrganization();
  return <AdminShell organization={organization}>{children}</AdminShell>;
}
