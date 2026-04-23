import type { ReactNode } from "react";
import { BellRing, Eye, FileSignature, FileText, FolderOpen, Link2, MailCheck, UploadCloud } from "lucide-react";
import type { SubscriptionContext } from "@/lib/auth";
import type { AutomationWorkspaceData } from "@/lib/automation-data";
import type { BusinessWorkspaceData } from "@/lib/business-data";
import { getUpgradeCopy, hasFeatureAccess } from "@/lib/upgrade";
import type { BuyerDocument } from "@/types";
import { BusinessSearch, GuidedPanel, MetricCell, compactDate } from "@/components/admin/business-ui";
import { FieldRow, Panel, StatusPill, WorkspaceHeader, formatDate, toneForStatus } from "@/components/admin/workspace-ui";
import { UpgradeActionButton } from "@/components/admin/upgrade-modal";

export function DocumentsWorkspace({
  business,
  automation,
  subscription,
}: {
  business: BusinessWorkspaceData;
  automation?: AutomationWorkspaceData;
  subscription: SubscriptionContext;
}) {
  const selectedDocument = business.documents[0] ?? null;
  const selectedBuyer = selectedDocument
    ? business.buyers.find((buyer) => buyer.id === selectedDocument.buyerId) ?? null
    : business.buyers[0] ?? null;
  const contracts = business.documents.filter((document) => document.category === "contracts").length;
  const visible = business.documents.filter((document) => document.visibleToUser).length;
  const signed = business.documents.filter((document) => document.signedAt).length;
  const documentNoticeLogs = selectedDocument && automation
    ? automation.logs.filter((log) => log.relatedType === "document" && log.relatedId === selectedDocument.id)
    : [];
  const latestNotice = documentNoticeLogs[0] ?? null;
  const aiLocked = !hasFeatureAccess(subscription.planKey, "ai_documents");
  const aiCopy = getUpgradeCopy("ai_documents");

  return (
    <div>
      <WorkspaceHeader
        eyebrow="Document control"
        title="Documents"
        description="Contracts, payment plans, health files, delivery paperwork, buyer visibility, and signature status in one workspace."
        actions={
          <>
            <UpgradeActionButton
              locked={aiLocked}
              title={aiCopy.title}
              body={aiCopy.body}
              primaryLabel={aiCopy.primaryLabel}
              secondaryLabel={aiCopy.secondaryLabel}
              currentPlan={subscription.planKey}
              suggestedPlan={aiCopy.suggestedPlan}
              sourceArea="/admin/documents:ai-documents"
              featureKey="ai_documents"
              href="/admin/documents/ai"
              className="inline-flex h-10 items-center gap-2 rounded-md border border-white/[0.12] bg-white/[0.04] px-4 text-sm font-semibold text-stone-100"
            >
              <FileSignature className="size-4" />
              AI Documents
            </UpgradeActionButton>
            <button className="inline-flex h-10 items-center gap-2 rounded-md border border-gold/35 bg-gold px-4 text-sm font-semibold text-[#20160c] shadow-gold">
              <UploadCloud className="size-4" />
              Upload File
            </button>
          </>
        }
      />

      <div className="mt-8 grid gap-5 xl:grid-cols-[360px_1fr]">
        <Panel className="p-4" title="Document List" eyebrow="File cabinet">
          <BusinessSearch label="Find document" searchLabel="Search documents" />
          <div className="mt-3 flex flex-wrap gap-2">
            {["contracts", "payment plan", "health", "delivery"].map((category) => (
              <StatusPill key={category} tone="gold">{category}</StatusPill>
            ))}
          </div>
          <div className="mt-4 space-y-2">
            {business.documents.length > 0 ? (
              business.documents.map((document) => (
                <DocumentRow key={document.id} document={document} selected={selectedDocument?.id === document.id} />
              ))
            ) : (
              <GuidedPanel
                icon={<FolderOpen className="size-4" />}
                title="Create the document file"
                body="Upload scanned files, organize buyer documents, and track visibility and signature status."
              />
            )}
          </div>
        </Panel>

        <main className="space-y-5">
          <Panel className="p-5" title="Document Detail" eyebrow="Review and access">
            {selectedDocument ? (
              <>
                <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">{selectedDocument.category}</p>
                    <h2 className="mt-2 text-3xl font-semibold tracking-tight text-stone-50">{selectedDocument.title}</h2>
                    <p className="mt-2 text-sm text-stone-500">{selectedBuyer?.fullName ?? "Buyer file ready"}</p>
                  </div>
                  <StatusPill tone={toneForStatus(selectedDocument.status)}>{selectedDocument.status}</StatusPill>
                </div>
                <div className="grid gap-3 md:grid-cols-3">
                  <MetricCell label="Buyer visible" value={selectedDocument.visibleToUser ? "Visible" : "Workspace"} detail="Portal access" />
                  <MetricCell label="Signed" value={selectedDocument.signedAt ? "Signed" : "Pending"} detail={selectedDocument.signedAt ? formatDate(selectedDocument.signedAt.slice(0, 10)) : "Signature tracking"} />
                  <MetricCell label="File access" value={selectedDocument.fileUrl ? "Linked" : "Ready"} detail="Upload link or file record" />
                </div>
                <div className="mt-5 grid gap-x-8 gap-y-1 md:grid-cols-2">
                  <FieldRow label="Category" value={selectedDocument.category} />
                  <FieldRow label="Status" value={selectedDocument.status} />
                  <FieldRow label="Updated" value={formatDate(selectedDocument.updatedAt.slice(0, 10))} />
                  <FieldRow label="File URL" value={selectedDocument.fileUrl ? "Available" : "File ready to attach"} />
                </div>
                <div className="mt-5 grid gap-3 md:grid-cols-3">
                  <DocAction icon={<UploadCloud className="size-4" />} label="Upload scanned file" />
                  <DocAction icon={<FileSignature className="size-4" />} label="Prepare buyer document" />
                  <DocAction icon={<Eye className="size-4" />} label="Toggle buyer visibility" />
                </div>
              </>
            ) : (
              <GuidedPanel
                icon={<FileText className="size-4" />}
                title="Build the buyer document file"
                body="Start with contracts, payment terms, health files, and delivery paperwork tied to buyer records."
              />
            )}
          </Panel>

          <div className="grid gap-5 lg:grid-cols-3">
            <Panel className="p-5" title="Status Tracking" eyebrow="Document readiness">
              <MetricCell label="Contracts" value={contracts} detail="Purchase and placement" />
            </Panel>
            <Panel className="p-5" title="Buyer Portal" eyebrow="Visibility">
              <MetricCell label="Visible files" value={visible} detail="Shared with buyers" />
            </Panel>
            <Panel className="p-5" title="Signatures" eyebrow="Completion">
              <MetricCell label="Signed files" value={signed} detail="Completed documents" />
            </Panel>
          </div>

          <Panel className="p-5" title="Document Notices" eyebrow="Buyer communication">
            <div className="grid gap-3 md:grid-cols-4">
              <NoticeMetric icon={<BellRing className="size-4" />} label="Automation" value={automation?.settings?.documentNoticesEnabled === false ? "Paused" : "Active"} />
              <NoticeMetric icon={<MailCheck className="size-4" />} label="Buyer notified" value={latestNotice ? toneText(latestNotice.deliveryStatus) : selectedDocument?.visibleToUser ? "Ready" : "Workspace"} />
              <NoticeMetric icon={<FileSignature className="size-4" />} label="Signed notice" value={selectedDocument?.signedAt ? "Ready" : "Tracking"} />
              <NoticeMetric icon={<FileText className="size-4" />} label="History" value={`${documentNoticeLogs.length} notices`} />
            </div>
          </Panel>
        </main>
      </div>
    </div>
  );
}

function DocumentRow({ document, selected }: { document: BuyerDocument; selected: boolean }) {
  return (
    <div className={selected ? "rounded-md border border-gold/30 bg-gold/10 p-3" : "rounded-md border border-white/[0.06] bg-white/[0.025] p-3"}>
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-md border border-gold/20 bg-gold/10 text-gold">
          <FileText className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <p className="font-medium text-stone-100">{document.title}</p>
            <StatusPill tone={toneForStatus(document.status)}>{document.status}</StatusPill>
          </div>
          <p className="mt-1 text-xs uppercase tracking-[0.14em] text-stone-500">{document.category} / {compactDate(document.updatedAt.slice(0, 10))}</p>
        </div>
      </div>
    </div>
  );
}

function DocAction({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <button className="inline-flex items-center justify-center gap-2 rounded-md border border-gold/20 bg-gold/10 px-3 py-2 text-sm font-semibold text-gold-soft">
      {icon}
      {label}
      <Link2 className="size-3.5" />
    </button>
  );
}

function NoticeMetric({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-md border border-white/[0.06] bg-black/10 p-4">
      <span className="text-gold">{icon}</span>
      <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">{label}</p>
      <p className="mt-1 font-semibold text-stone-50">{value}</p>
    </div>
  );
}

function toneText(value: string) {
  return value.replaceAll("_", " ");
}
