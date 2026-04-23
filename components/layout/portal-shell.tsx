import Link from "next/link";
import type { ReactNode } from "react";
import { logoutAction, type OrganizationContext } from "@/lib/auth";

const portalNav = ["My Puppy", "Payments", "Documents", "Messages", "Updates"];

export function PortalShell({
  children,
  organization,
}: {
  children: ReactNode;
  organization: OrganizationContext;
}) {
  return (
    <div className="min-h-screen bg-[#f7f1e8] text-[#2b2118]">
      <header className="border-b border-[#dfcbae] bg-[#fffaf2]/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Link href="/portal">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8a602d]">
              {organization.name}
            </p>
            <p className="text-xl font-semibold">Buyer Portal</p>
          </Link>
          <nav className="hidden gap-5 text-sm font-medium text-[#6e5b43] md:flex">
            {portalNav.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </nav>
          <form action={logoutAction}>
            <button className="rounded-md border border-[#d6be9b] px-3 py-2 text-sm font-medium">
              Logout
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-8">{children}</main>
    </div>
  );
}
