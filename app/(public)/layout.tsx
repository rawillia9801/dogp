import type { ReactNode } from "react";

export default async function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F8F7F3] text-[#1F2933]">
      {children}
    </div>
  );
}
