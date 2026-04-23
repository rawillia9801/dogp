import {
  PawPrint,
  PlusCircle,
  Users,
} from "lucide-react";
import type { AutomationWorkspaceData } from "@/lib/automation-data";
import type { BreederWorkspaceData } from "@/lib/breeder-data";
import type { BusinessWorkspaceData } from "@/lib/business-data";
import { puppiesForBuyer } from "@/lib/business-data";
import type { Buyer, BuyerApplication, BuyerDocument, BuyerPayment, NoticeLog, TransportationRequest } from "@/types";
import {
  ActivityLine,
  BusinessSearch,
  BuyerDirectoryRow,
  GuidedPanel,
  MetricCell,
  compactDate,
  currency,
} from "@/components/admin/business-ui";
import { FieldRow, Panel, StatusPill, WorkspaceHeader, displayText, formatDate, toneForStatus } from "@/components/admin/workspace-ui";

export function BuyersWorkspace({
  business,
  breeder,
  automation,
}: {
  business: BusinessWorkspaceData;
  breeder: BreederWorkspaceData;
  automation: AutomationWorkspaceData;
}) {
  const selectedBuyer = business.buyers[0] ?? null;
  const selectedPuppies = puppiesForBuyer(breeder.puppies, selectedBuyer?.id);
  const buyerPayments = selectedBuyer
    ? business.payments.filter((payment) => payment.buyerId === selectedBuyer.id)
    : [];
  const buyerDocuments = selectedBuyer
    ? business.documents.filter((document) => document.buyerId === selectedBuyer.id)
    : [];
  const buyerApplications = selectedBuyer
    ? business.applications.filter((application) => application.buyerId === selectedBuyer.id)
    : [];
  const buyerTransportation = selectedBuyer
    ? business.transportation.filter((request) => request.buyerId === selectedBuyer.id)
    : [];
  const paid = buyerPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const plan = selectedBuyer
    ? business.paymentPlans.find((item) => item.buyerId === selectedBuyer.id) ?? null
    : null;
  const balance = Math.max((plan?.totalPrice ?? selectedPuppies.reduce((sum, puppy) => sum + (puppy.price ?? 0), 0)) - paid, 0);
  const buyerNoticeLogs = selectedBuyer
    ? automation.logs.filter((log) => log.buyerId === selectedBuyer.id)
    : [];
  const lastNotice = buyerNoticeLogs.find((log) => ["sent", "delivered", "failed"].includes(log.deliveryStatus)) ?? null;
  const nextNotice = buyerNoticeLogs.find((log) => ["pending", "scheduled", "queued"].includes(log.deliveryStatus)) ?? null;
  const paymentStatus = balance <= 0 ? "Paid" : plan?.nextDueDate ? "Active Plan" : "Open Balance";

  return (
    <div>
      <WorkspaceHeader
        eyebrow="Buyer operations"
        title="Buyers"
        description="A breeder CRM for buyer files, puppy matches, applications, payments, documents, and delivery coordination."
        actions={
          <button className="inline-flex h-10 items-center gap-2 rounded-md border border-gold/35 bg-gold px-4 text-sm font-semibold text-[#20160c] shadow-gold">
            <PlusCircle className="size-4" />
            Add Buyer
          </button>
        }
      />

      <div className="mt-8 grid gap-5 2xl:grid-cols-[320px_1fr_340px]">
        <Panel className="p-4" title="Buyer Directory" eyebrow="CRM pipeline">
          <BusinessSearch label="Find buyer" searchLabel="Search buyers" />
          <div className="mt-3 flex flex-wrap gap-2">
            {["lead", "approved", "active", "completed"].map((status) => (
              <StatusPill key={status} tone={toneForStatus(status)}>{status}</StatusPill>
            ))}
          </div>
          <div className="mt-4 space-y-2">
            {business.buyers.length > 0 ? (
              business.buyers.map((buyer) => (
                <BuyerDirectoryRow
                  key={buyer.id}
                  buyer={buyer}
                  selected={selectedBuyer?.id === buyer.id}
                  metric={`${puppiesForBuyer(breeder.puppies, buyer.id).length} linked puppies`}
                />
              ))
            ) : (
              <GuidedPanel
                icon={<Users className="size-4" />}
                title="Create your first buyer file"
                body="Capture the family profile, contact details, puppy interests, and approval status in one operating record."
              />
            )}
          </div>
        </Panel>

        <main className="space-y-5">
          {selectedBuyer ? (
            <>
              <Panel className="p-5">
                <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">Buyer workspace</p>
                    <h2 className="mt-2 text-3xl font-semibold tracking-tight text-stone-50">{selectedBuyer.fullName}</h2>
                    <p className="mt-2 text-sm leading-6 text-stone-400">{displayText(selectedBuyer.notes)}</p>
                  </div>
                  <StatusPill tone={toneForStatus(selectedBuyer.status)}>{selectedBuyer.status}</StatusPill>
                </div>
                <div className="mt-5 grid gap-3 md:grid-cols-4">
                  <MetricCell label="Puppies" value={selectedPuppies.length} detail="Linked records" />
                  <MetricCell label="Paid" value={currency(paid)} detail="Ledger total" />
                  <MetricCell label="Balance" value={currency(balance)} detail="Open amount" />
                  <MetricCell label="Documents" value={buyerDocuments.length} detail="Buyer file" />
                </div>
              </Panel>

              <div className="flex gap-2 overflow-x-auto border-b border-white/[0.08] pb-2">
                {["Profile", "Puppies", "Payments", "Documents", "Transportation", "Activity"].map((tab, index) => (
                  <span
                    key={tab}
                    className={index === 0 ? "whitespace-nowrap rounded-md border border-gold/25 bg-gold/10 px-3 py-2 text-sm font-semibold text-gold-soft" : "whitespace-nowrap rounded-md border border-white/[0.06] bg-white/[0.025] px-3 py-2 text-sm text-stone-400"}
                  >
                    {tab}
                  </span>
                ))}
              </div>

              <div className="grid gap-5 xl:grid-cols-[1fr_0.9fr]">
                <Panel className="p-5" title="Profile" eyebrow="Contact and address">
                  <FieldRow label="Email" value={selectedBuyer.email} />
                  <FieldRow label="Phone" value={selectedBuyer.phone} />
                  <FieldRow label="Address" value={formatAddress(selectedBuyer)} />
                  <FieldRow label="Created" value={formatDate(selectedBuyer.createdAt.slice(0, 10))} />
                </Panel>

                <Panel className="p-5" title="Linked Puppies" eyebrow="Placement context">
                  <div className="space-y-3">
                    {selectedPuppies.length > 0 ? (
                      selectedPuppies.map((puppy) => (
                        <div key={puppy.id} className="flex items-center justify-between gap-3 rounded-md border border-white/[0.06] bg-white/[0.025] p-3">
                          <div className="flex items-center gap-3">
                            <span className="flex size-9 items-center justify-center rounded-full border border-gold/20 bg-gold/10 text-sm font-semibold text-gold">
                              {(puppy.callName ?? puppy.puppyName ?? "P").slice(0, 1).toUpperCase()}
                            </span>
                            <div>
                              <p className="font-medium text-stone-100">{puppy.callName ?? puppy.puppyName ?? "Puppy record"}</p>
                              <p className="text-xs text-stone-500">{displayText(puppy.color)} / {displayText(puppy.coat)}</p>
                            </div>
                          </div>
                          <StatusPill tone={toneForStatus(puppy.status)}>{puppy.status}</StatusPill>
                        </div>
                      ))
                    ) : (
                      <GuidedPanel
                        icon={<PawPrint className="size-4" />}
                        title="Link a puppy match"
                        body="Connect this buyer file to an available puppy, reservation, or retained placement review."
                      />
                    )}
                  </div>
                </Panel>
              </div>

              <Panel className="p-5" title="Financial Summary" eyebrow="Buyer account">
                <div className="grid gap-3 md:grid-cols-3">
                  <MetricCell label="Plan total" value={currency(plan?.totalPrice)} detail={plan ? `${plan.months} months / ${plan.apr}% APR` : "Plan terms ready"} />
                  <MetricCell label="Deposit" value={currency(plan?.deposit)} detail="Required start" />
                  <MetricCell label="Next due" value={plan?.nextDueDate ? compactDate(plan.nextDueDate) : "Schedule"} detail="Payment control" />
                </div>
              </Panel>

              <Panel className="p-5" title="Notice Status" eyebrow="Buyer communication">
                <div className="grid gap-3 md:grid-cols-3">
                  <MetricCell
                    label="Last notice sent"
                    value={lastNotice ? compactDate(lastNotice.sentAt ?? lastNotice.createdAt) : "Ready"}
                    detail={lastNotice ? humanize(lastNotice.noticeType) : "No delivery logged yet"}
                  />
                  <MetricCell
                    label="Next scheduled notice"
                    value={nextNotice ? compactDate(nextNotice.scheduledAt ?? nextNotice.createdAt) : "Clear"}
                    detail={nextNotice ? humanize(nextNotice.noticeType) : "No notice scheduled"}
                  />
                  <MetricCell
                    label="Payment status"
                    value={paymentStatus}
                    detail={balance > 0 ? `${currency(balance)} open` : "Buyer ledger is current"}
                  />
                </div>
              </Panel>
            </>
          ) : (
            <GuidedPanel
              icon={<Users className="size-4" />}
              title="Create your first buyer file"
              body="Start with contact details, then connect puppy matches, application decisions, payments, documents, and transportation."
            />
          )}
        </main>

        <aside className="space-y-5">
          <Panel className="p-5" title="Activity Timeline" eyebrow="Buyer movement">
            <div className="relative">
              <div className="absolute bottom-4 left-[15px] top-4 w-px bg-gradient-to-b from-gold/50 via-white/[0.08] to-transparent" />
              {buildActivity(selectedBuyer, buyerPayments, buyerDocuments, buyerApplications, buyerTransportation, buyerNoticeLogs).map((item) => (
                <ActivityLine key={item.id} title={item.title} detail={item.detail} date={item.date} tone={item.tone} complete={item.complete} />
              ))}
            </div>
          </Panel>
        </aside>
      </div>
    </div>
  );
}

function buildActivity(
  buyer: Buyer | null,
  payments: BuyerPayment[],
  documents: BuyerDocument[],
  applications: BuyerApplication[],
  transportation: TransportationRequest[],
  notices: NoticeLog[],
) {
  if (!buyer) {
    return [
      {
        id: "buyer-file",
        title: "Buyer file setup",
        detail: "Create the CRM record to begin payment, document, and delivery tracking.",
        date: "Ready",
        tone: "gold" as const,
        complete: false,
      },
    ];
  }

  const activity = [
    ...paymentItems(payments),
    ...documentItems(documents),
    ...applicationItems(applications),
    ...transportationItems(transportation),
    ...noticeItems(notices),
  ].sort((a, b) => new Date(b.rawDate ?? "1970-01-01").getTime() - new Date(a.rawDate ?? "1970-01-01").getTime());

  return activity.length > 0
    ? activity
    : [
        {
          id: "buyer-ready",
          title: "Buyer file opened",
          detail: "Add application, payment, document, and transportation activity as the placement progresses.",
          date: compactDate(buyer.createdAt.slice(0, 10)),
          tone: "gold" as const,
          complete: true,
        },
      ];
}

function paymentItems(payments: import("@/types").BuyerPayment[]) {
  return payments.map((payment) => ({
    id: `payment-${payment.id}`,
    title: `${payment.type} payment`,
    detail: `${currency(payment.amount)} via ${payment.method ?? "recorded method"}`,
    date: compactDate(payment.paymentDate),
    rawDate: payment.paymentDate,
    tone: toneForStatus(payment.status) as "gold" | "green" | "blue" | "red" | "neutral",
    complete: payment.status !== "pending",
  }));
}

function documentItems(documents: import("@/types").BuyerDocument[]) {
  return documents.map((document) => ({
    id: `document-${document.id}`,
    title: document.title,
    detail: `${document.category} / ${document.visibleToUser ? "buyer visible" : "workspace only"}`,
    date: compactDate(document.signedAt?.slice(0, 10) ?? document.updatedAt.slice(0, 10)),
    rawDate: document.signedAt?.slice(0, 10) ?? document.updatedAt.slice(0, 10),
    tone: toneForStatus(document.status) as "gold" | "green" | "blue" | "red" | "neutral",
    complete: Boolean(document.signedAt),
  }));
}

function applicationItems(applications: import("@/types").BuyerApplication[]) {
  return applications.map((application) => ({
    id: `application-${application.id}`,
    title: "Application review",
    detail: `${application.status} intake record`,
    date: compactDate(application.createdAt.slice(0, 10)),
    rawDate: application.createdAt.slice(0, 10),
    tone: toneForStatus(application.status) as "gold" | "green" | "blue" | "red" | "neutral",
    complete: application.status === "approved",
  }));
}

function transportationItems(transportation: import("@/types").TransportationRequest[]) {
  return transportation.map((request) => ({
    id: `transportation-${request.id}`,
    title: `${request.type} coordination`,
    detail: request.location ?? "Delivery location ready to confirm",
    date: compactDate(request.date),
    rawDate: request.date,
    tone: "blue" as const,
    complete: Boolean(request.date),
  }));
}

function noticeItems(notices: NoticeLog[]) {
  return notices.map((notice) => ({
    id: `notice-${notice.id}`,
    title: humanize(notice.noticeType),
    detail: notice.deliveryStatus === "failed"
      ? notice.failureReason ?? "Delivery issue recorded"
      : "Notice logged in buyer communication history",
    date: compactDate(notice.sentAt ?? notice.scheduledAt ?? notice.createdAt),
    rawDate: notice.sentAt ?? notice.scheduledAt ?? notice.createdAt,
    tone: toneForStatus(notice.deliveryStatus) as "gold" | "green" | "blue" | "red" | "neutral",
    complete: notice.deliveryStatus === "sent" || notice.deliveryStatus === "delivered",
  }));
}

function formatAddress(buyer: Buyer) {
  const parts = [buyer.addressLine1, buyer.addressLine2, buyer.city, buyer.state, buyer.postalCode]
    .filter(Boolean)
    .join(", ");

  return parts || "Address ready to capture";
}

function humanize(value: string) {
  return value.replaceAll("_", " ");
}
