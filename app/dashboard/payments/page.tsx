import Link from "next/link";
import { AlertTriangle, CreditCard, DollarSign, Receipt } from "lucide-react";
import { getDashboardData } from "@/lib/dashboard-data";
import { getPaymentsWorkspaceData } from "@/lib/ops-data";
import { deletePaymentRecord } from "./actions";
import { DeleteRecordButton } from "@/app/dashboard/record-buttons";

export default async function PaymentsPage() {
  const data = await getDashboardData();
  const payments = await getPaymentsWorkspaceData();

  return (
    <main className="min-h-screen bg-[#f6f3ec] p-6 text-[#132238] md:p-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div><p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#b38728]">Revenue Control</p><h1 className="mt-2 text-5xl font-black tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>Payments Center</h1><p className="mt-3 text-lg text-[#526172]">{data.organizationName} • every payment, buyer account, puppy balance, and breeder receivable in one ledger.</p></div>
          <div className="flex gap-3"><Link href="/dashboard" className="rounded-full border border-[#d8cfbf] bg-white px-6 py-3 font-semibold shadow-sm">Back Dashboard</Link><Link href="/dashboard/payments/new" className="rounded-full bg-[#2f5d3f] px-6 py-3 font-semibold text-white shadow-lg">+ Log Payment</Link></div>
        </div>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <MoneyCard label="Open Balances" value={`$${data.money.openBalances}`} icon={DollarSign} />
          <MoneyCard label="Due Soon" value={data.money.dueSoon} icon={Receipt} />
          <MoneyCard label="Overdue" value={data.money.overdue} icon={AlertTriangle} />
          <MoneyCard label="Payments Logged" value={data.counts.payments} icon={CreditCard} />
        </section>

        <section className="rounded-[30px] border border-[#e2d9ca] bg-white p-6 shadow-[0_20px_60px_rgba(19,34,56,0.05)]">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8a7757]">Recent breeder payments</p>
          {payments.length === 0 ? <div className="mt-6 rounded-[24px] border border-[#eee5d8] bg-[#fcfbf8] p-6 text-center"><p className="font-black">No payments logged yet</p></div> : <div className="mt-5 space-y-4">{payments.map((payment: any) => { const puppy = payment.buyer_payment_accounts?.puppies; const puppyName = puppy?.call_name ?? puppy?.puppy_name ?? null; return <div key={payment.id} className="rounded-[24px] border border-[#eee5d8] bg-[#fcfbf8] p-5 shadow-sm"><div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"><div><p className="text-xl font-black">{payment.buyers.full_name}</p><p className="mt-1 text-sm text-[#6b7785]">{payment.payment_date}{puppyName ? ` • ${puppyName}` : ""}</p></div><div className="flex flex-wrap gap-3"><span className="rounded-full border border-[#e2d9ca] bg-white px-3 py-1 text-[11px] font-bold uppercase">{payment.type}</span><span className="rounded-full border border-[#e2d9ca] bg-white px-3 py-1 text-[11px] font-bold uppercase">{payment.method}</span><span className="rounded-full bg-[#eef5eb] px-4 py-2 text-sm font-black text-[#2f5d3f]">${payment.amount}</span></div></div><div className="mt-4 grid gap-3 rounded-2xl border border-[#eee5d8] bg-white p-3 text-sm md:grid-cols-2"><div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8a7757]">Account Balance</p><p className="mt-1 font-black text-[#132238]">${payment.buyer_payment_accounts?.balance ?? 0}</p></div><div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8a7757]">Status</p><p className="mt-1 font-black capitalize text-[#132238]">{payment.status}</p></div></div><div className="mt-4 flex max-w-[220px] gap-2"><Link href={`/dashboard/payments/${payment.id}/edit`} className="flex-1 rounded-full border border-[#d8cfbf] bg-white px-4 py-2 text-center text-xs font-semibold">Edit</Link><form action={deletePaymentRecord} className="flex-1"><input type="hidden" name="payment_id" value={payment.id} /><DeleteRecordButton label="Delete" confirmMessage="Delete this payment record?" /></form></div></div>; })}</div>}
        </section>
      </div>
    </main>
  );
}
function MoneyCard({ label, value, icon: Icon }: { label: string; value: number | string; icon: typeof DollarSign }) { return <div className="rounded-[24px] border border-[#e2d9ca] bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8a7757]">{label}</p><Icon className="h-5 w-5 text-[#2f5d3f]" /></div><p className="mt-3 text-4xl font-black" style={{ fontFamily: 'Georgia, serif' }}>{value}</p></div>; }
