import type { ReactNode } from "react";
import { PublicHeader } from "@/components/layout/public-header";

export default async function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F8F7F3] text-[#1F2933]">
      <PublicHeader />
      {children}
    </div>
  );
}
