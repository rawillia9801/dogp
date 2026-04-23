import type { ReactNode } from "react";
import { PublicHeader } from "@/components/layout/public-header";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-app text-stone-100">
      <PublicHeader />
      {children}
    </div>
  );
}
