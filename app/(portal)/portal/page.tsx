import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portal",
};

export default function PortalPage() {
  return (
    <div className="rounded-lg border border-[#dfcbae] bg-[#fffaf2] p-6 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8a602d]">
        Buyer portal
      </p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight">Family portal</h1>
      <p className="mt-4 max-w-2xl leading-7 text-[#6e5b43]">
        Your breeder portal keeps puppy details, account updates, documents, messages, and family
        resources in a calm protected space.
      </p>
    </div>
  );
}
