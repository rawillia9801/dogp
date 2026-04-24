import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return (
    <div className="rounded-lg border border-[#dfcbae] bg-[#fffaf2] p-6 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8a602d]">
        Your dashboard
      </p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight">Account overview</h1>
      <p className="mt-4 max-w-2xl leading-7 text-[#6e5b43]">
        Your dashboard keeps puppy details, account updates, documents, messages, and family
        resources in one calm protected space.
      </p>
    </div>
  );
}
