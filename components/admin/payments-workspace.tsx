import type { ReactNode } from "react";
import { BadgeDollarSign, BellRing, CalendarClock, CreditCard, MailCheck, PlusCircle, ReceiptText, WalletCards } from "lucide-react";
import type { AutomationWorkspaceData } from "@/lib/automation-data";
import type { BusinessWorkspaceData } from "@/lib/business-data";
import type { Buyer } from "@/types";
import {
  BusinessSearch,
  BuyerDirectoryRow,
  GuidedPanel,
  MetricCell,
  compactDate,
  currency,
} from "@/components/admin/business-ui";
import { FieldRow, Panel, StatusPill, WorkspaceHeader, formatDate, toneForStatus } from "@/components/admin/workspace-ui";

export function PaymentsWorkspace({
  business,
  automation,
}: {
  business: BusinessWorkspaceData;
  automation?: AutomationWorkspaceData;
}) {
  const selectedBuyer = business.buyers.find((buyer) =>
    business.payments.some((payment) => payment.buyerId === buyer.id) ||
    business.paymentPlans.some((plan) => plan.buyerId === buyer.id),
  ) ?? business.buyers[0] ?? null;
  const buyerPayments = selectedBuyer
    ? business.payments.filter((payment) => payment.buyerId === selectedBuyer.id)
    : [];
  const plan = selectedBuyer
    ? business.paymentPlans.find((item) => item.buyerId === selectedBuyer.id) ?? null
    : null;
  const paid = buyerPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const totalPrice = plan?.totalPrice ?? 0;
  const balance = Math.max(totalPrice - paid, 0);
  const paymentNoticeLogs = selectedBuyer && automation
    ? automation.logs.filter((log) =>
        log.buyerId === selectedBuyer.id &&
        (log.noticeType.startsWith("payment_") || log.relatedType === "payment" || log.relatedType === "payment_plan"),
      )
    : [];
  const lastNotice = paymentNoticeLogs.find((log) => log.sentAt || log.createdAt) ?? null;
  const nextNotice = paymentNoticeLogs.find((log) => ["scheduled", "queued"].includes(log.deliveryStatus)) ?? null;

  return (
    <div>
      <WorkspaceHeader
        eyebrow="Financial control"
        title="Payments"
        description="Buyer account ledgers, payment plans, balances, due dates, and accounting notices for breeder operations."
        actions={
          <button className="inline-flex h-10 items-center gap-2 rounded-md border border-gold/35 bg-gold px-4 text-sm font-semibold text-[#20160c] shadow-gold">
            <PlusCircle className="size-4" />
            Record Payment
          </button>
        }
      />

      <div className="mt-8 grid gap-5 2xl:grid-cols-[320px_1fr_340px]">
        <Panel className="p-4" title="Buyer Accounts" eyebrow="Ledger directory">
          <BusinessSearch label="Find account" searchLabel="Search buyer accounts" />
          <div className="mt-4 space-y-2">
            {business.buyers.length > 0 ? (
              business.buyers.map((buyer) => (
                <BuyerDirectoryRow
                  key={buyer.id}
                  buyer={buyer}
                  selected={selectedBuyer?.id === buyer.id}
                  metric={accountMetric(buyer, business)}
                />
              ))
            ) : (
              <GuidedPanel
                icon={<WalletCards className="size-4" />}
                title="Create a buyer account"
                body="Add a buyer file, then attach deposits, installments, adjustments, and payment plan terms."
              />
            )}
          </div>
        </Panel>

        <main className="space-y-5">
          {selectedBuyer ? (
            <>
              <Panel className="p-5" title="Selected Account" eyebrow="Financial position">
                <div className="mb-5 flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-3xl font-semibold tracking-tight text-stone-50">{selectedBuyer.fullName}</h2>
                    <p className="mt-1 text-sm text-stone-500">{selectedBuyer.email}</p>
                  </div>
                  <StatusPill tone={balance > 0 ? "gold" : "green"}>{balance > 0 ? "open balance" : "settled"}</StatusPill>
                </div>
                <div className="grid gap-3 md:grid-cols-3">
                  <MetricCell label="Total price" value={currency(totalPrice)} detail="Buyer plan amount" />
                  <MetricCell label="Paid" value={currency(paid)} detail={`${buyerPayments.length} ledger entries`} />
                  <MetricCell label="Balance" value={currency(balance)} detail="Remaining account value" />
                </div>
                <div className="mt-5 grid gap-x-8 gap-y-1 md:grid-cols-2">
                  <FieldRow label="Deposit" value={currency(plan?.deposit)} />
                  <FieldRow label="Monthly amount" value={currency(plan?.monthlyAmount)} />
                  <FieldRow label="Months" value={plan?.months ?? "Term ready"} />
                  <FieldRow label="APR" value={plan ? `${plan.apr}%` : "Rate ready"} />
                </div>
              </Panel>

              <Panel className="p-5" title="Ledger Table" eyebrow="Payments and adjustments">
                <div className="overflow-x-auto rounded-lg border border-white/[0.08]">
                  <div className="min-w-[760px]">
                    <div className="grid grid-cols-[120px_1fr_120px_120px_120px] gap-3 border-b border-white/[0.08] bg-white/[0.035] px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
                      <span>Date</span>
                      <span>Type</span>
                      <span>Amount</span>
                      <span>Method</span>
                      <span>Status</span>
                    </div>
                    <div className="divide-y divide-white/[0.06]">
                      {buyerPayments.length > 0 ? (
                        buyerPayments.map((payment) => (
                          <div key={payment.id} className="grid grid-cols-[120px_1fr_120px_120px_120px] gap-3 px-4 py-3 text-sm">
                            <span className="text-stone-400">{compactDate(payment.paymentDate)}</span>
                            <span className="font-medium text-stone-100">{payment.type}</span>
                            <span className="font-semibold text-stone-50">{currency(payment.amount)}</span>
                            <span className="text-stone-400">{payment.method ?? "Recorded"}</span>
                            <StatusPill tone={toneForStatus(payment.status)}>{payment.status}</StatusPill>
                          </div>
                        ))
                      ) : (
                        <div className="p-4">
                          <GuidedPanel
                            icon={<ReceiptText className="size-4" />}
                            title="Record a payment or create a plan"
                            body="Track deposits, installments, credits, and adjustments against the selected buyer account."
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Panel>
            </>
          ) : (
            <GuidedPanel
              icon={<BadgeDollarSign className="size-4" />}
              title="Open financial control"
              body="Create a buyer account to manage total price, deposits, installments, balances, and due dates."
            />
          )}
        </main>

        <aside className="space-y-5">
          <Panel className="p-5" title="Payment Plan Details" eyebrow="Terms and notices">
            <div className="space-y-3">
              <PlanLine icon={<CreditCard className="size-4" />} label="Next due date" value={plan?.nextDueDate ? formatDate(plan.nextDueDate) : "Schedule"} />
              <PlanLine icon={<WalletCards className="size-4" />} label="Monthly amount" value={currency(plan?.monthlyAmount)} />
              <PlanLine icon={<CalendarClock className="size-4" />} label="Term" value={plan ? `${plan.months} months` : "Term ready"} />
              <PlanLine icon={<BadgeDollarSign className="size-4" />} label="APR" value={plan ? `${plan.apr}%` : "Rate ready"} />
            </div>
          </Panel>

          <Panel className="p-5" title="Notices" eyebrow="Account signals">
            <div className="space-y-3">
              <Notice label="Balance control" value={balance > 0 ? currency(balance) : "Settled"} tone={balance > 0 ? "gold" : "green"} />
              <Notice label="Ledger coverage" value={`${buyerPayments.length} entries`} tone="blue" />
              <Notice label="Plan status" value={plan ? "Active terms" : "Terms ready"} tone={plan ? "green" : "gold"} />
            </div>
          </Panel>

          <Panel className="p-5" title="Payment Notices" eyebrow="Automation">
            <div className="space-y-3">
              <PlanLine icon={<BellRing className="size-4" />} label="Next reminder" value={nextNotice?.scheduledAt ? formatDate(nextNotice.scheduledAt.slice(0, 10)) : plan?.nextDueDate ? formatDate(plan.nextDueDate) : "Schedule ready"} />
              <PlanLine icon={<MailCheck className="size-4" />} label="Last notice" value={lastNotice ? formatDate((lastNotice.sentAt ?? lastNotice.createdAt).slice(0, 10)) : "Ready to log"} />
              <PlanLine icon={<ReceiptText className="size-4" />} label="History" value={`${paymentNoticeLogs.length} notices`} />
              <Notice label="Automation" value={automation?.settings?.paymentNoticesEnabled === false ? "Paused" : "Active"} tone={automation?.settings?.paymentNoticesEnabled === false ? "gold" : "green"} />
            </div>
          </Panel>
        </aside>
      </div>
    </div>
  );
}

function accountMetric(buyer: Buyer, business: BusinessWorkspaceData) {
  const paid = business.payments
    .filter((payment) => payment.buyerId === buyer.id)
    .reduce((sum, payment) => sum + payment.amount, 0);

  return `${currency(paid)} paid`;
}

function PlanLine({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md border border-white/[0.06] bg-white/[0.025] px-3 py-2.5">
      <span className="flex items-center gap-2 text-sm text-stone-300">
        <span className="text-gold">{icon}</span>
        {label}
      </span>
      <span className="text-sm font-semibold text-stone-50">{value}</span>
    </div>
  );
}

function Notice({ label, value, tone }: { label: string; value: string; tone: "gold" | "green" | "blue" }) {
  return (
    <div className="flex items-center justify-between border-b border-white/[0.06] py-3 last:border-0">
      <span className="text-sm text-stone-300">{label}</span>
      <StatusPill tone={tone}>{value}</StatusPill>
    </div>
  );
}
