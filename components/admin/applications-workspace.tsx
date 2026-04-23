import type { ReactNode } from "react";
import { CheckCircle2, ClipboardCheck, FileCheck2, PlusCircle, ShieldX, UserRoundCheck } from "lucide-react";
import type { BusinessWorkspaceData } from "@/lib/business-data";
import type { Buyer, BuyerApplication } from "@/types";
import { BusinessSearch, GuidedPanel, MetricCell, compactDate } from "@/components/admin/business-ui";
import { FieldRow, Panel, StatusPill, WorkspaceHeader, displayText, formatDate, toneForStatus } from "@/components/admin/workspace-ui";

export function ApplicationsWorkspace({ business }: { business: BusinessWorkspaceData }) {
  const selectedApplication = business.applications[0] ?? null;
  const selectedBuyer = selectedApplication
    ? business.buyers.find((buyer) => buyer.id === selectedApplication.buyerId) ?? null
    : business.buyers[0] ?? null;
  const submitted = business.applications.filter((application) => application.status === "submitted").length;
  const approved = business.applications.filter((application) => application.status === "approved").length;
  const denied = business.applications.filter((application) => application.status === "denied").length;

  return (
    <div>
      <WorkspaceHeader
        eyebrow="Intake pipeline"
        title="Applications"
        description="Application review, buyer approval, and conversion control for breeder placement decisions."
        actions={
          <button className="inline-flex h-10 items-center gap-2 rounded-md border border-gold/35 bg-gold px-4 text-sm font-semibold text-[#20160c] shadow-gold">
            <PlusCircle className="size-4" />
            Open Intake
          </button>
        }
      />

      <div className="mt-8 grid gap-5 xl:grid-cols-[1fr_420px]">
        <main className="space-y-5">
          <Panel className="p-5" title="Application Queue" eyebrow="Submitted reviews">
            <div className="mb-4 grid gap-3 md:grid-cols-3">
              <MetricCell label="Submitted" value={submitted} detail="Awaiting breeder review" />
              <MetricCell label="Approved" value={approved} detail="Buyer-ready files" />
              <MetricCell label="Denied" value={denied} detail="Closed intake records" />
            </div>
            <BusinessSearch label="Find applicant" searchLabel="Search applications" />
            <div className="mt-4 overflow-hidden rounded-lg border border-white/[0.08]">
              <div className="grid grid-cols-[1.1fr_120px_120px_170px] gap-3 border-b border-white/[0.08] bg-white/[0.035] px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
                <span>Applicant</span>
                <span>Status</span>
                <span>Date</span>
                <span>Quick actions</span>
              </div>
              <div className="divide-y divide-white/[0.06]">
                {business.applications.length > 0 ? (
                  business.applications.map((application) => {
                    const buyer = buyerForApplication(application, business.buyers);
                    return (
                      <div key={application.id} className="grid grid-cols-[1.1fr_120px_120px_170px] gap-3 px-4 py-3 text-sm">
                        <div>
                          <p className="font-medium text-stone-100">{buyer?.fullName ?? "Applicant file"}</p>
                          <p className="mt-1 text-xs text-stone-500">{buyer?.email ?? "Email ready to capture"}</p>
                        </div>
                        <StatusPill tone={toneForStatus(application.status)}>{application.status}</StatusPill>
                        <span className="text-stone-400">{compactDate(application.createdAt.slice(0, 10))}</span>
                        <div className="flex flex-wrap gap-2">
                          <button className="rounded-md border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-xs font-semibold text-emerald-200">
                            Approve
                          </button>
                          <button className="rounded-md border border-red-400/20 bg-red-400/10 px-2.5 py-1 text-xs font-semibold text-red-200">
                            Deny
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-4">
                    <GuidedPanel
                      icon={<ClipboardCheck className="size-4" />}
                      title="Open the intake pipeline"
                      body="Create application records to review family fit, home environment, timing, and puppy preferences."
                    />
                  </div>
                )}
              </div>
            </div>
          </Panel>
        </main>

        <aside className="space-y-5">
          <Panel className="p-5" title="Application Detail" eyebrow="Approval workspace">
            {selectedApplication ? (
              <>
                <div className="mb-5 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xl font-semibold text-stone-50">{selectedBuyer?.fullName ?? "Applicant file"}</p>
                    <p className="mt-1 text-sm text-stone-500">{formatDate(selectedApplication.createdAt.slice(0, 10))}</p>
                  </div>
                  <StatusPill tone={toneForStatus(selectedApplication.status)}>{selectedApplication.status}</StatusPill>
                </div>
                <div className="grid gap-2">
                  {answerRows(selectedApplication).map((row) => (
                    <FieldRow key={row.label} label={row.label} value={row.value} />
                  ))}
                </div>
                <div className="mt-5 grid gap-2">
                  <ActionButton icon={<CheckCircle2 className="size-4" />} label="Approve Application" tone="green" />
                  <ActionButton icon={<ShieldX className="size-4" />} label="Deny Application" tone="red" />
                  <ActionButton icon={<UserRoundCheck className="size-4" />} label="Convert to Buyer" tone="gold" />
                </div>
              </>
            ) : (
              <GuidedPanel
                icon={<FileCheck2 className="size-4" />}
                title="Review the next applicant"
                body="Select an intake record to inspect responses, approve placement fit, or convert the applicant into a buyer file."
              />
            )}
          </Panel>
        </aside>
      </div>
    </div>
  );
}

function ActionButton({
  icon,
  label,
  tone,
}: {
  icon: ReactNode;
  label: string;
  tone: "gold" | "green" | "red";
}) {
  const tones = {
    gold: "border-gold/25 bg-gold/10 text-gold-soft",
    green: "border-emerald-400/20 bg-emerald-400/10 text-emerald-200",
    red: "border-red-400/20 bg-red-400/10 text-red-200",
  };

  return (
    <button className={`inline-flex items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm font-semibold ${tones[tone]}`}>
      {icon}
      {label}
    </button>
  );
}

function buyerForApplication(application: BuyerApplication, buyers: Buyer[]) {
  return buyers.find((buyer) => buyer.id === application.buyerId) ?? null;
}

function answerRows(application: BuyerApplication) {
  const entries = Object.entries(application.answers);

  if (entries.length > 0) {
    return entries.slice(0, 8).map(([key, value]) => ({
      label: key.replace(/_/g, " "),
      value: typeof value === "string" || typeof value === "number" ? String(value) : JSON.stringify(value),
    }));
  }

  return [
    { label: "Home environment", value: "Response ready for review" },
    { label: "Puppy goals", value: "Preference profile ready to capture" },
    { label: "Timing", value: "Placement window ready to confirm" },
    { label: "Experience", value: displayText(null) },
  ];
}
