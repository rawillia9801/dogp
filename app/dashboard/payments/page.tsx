import Link from "next/link";
import { AlertTriangle, CreditCard, DollarSign, Receipt } from "lucide-react";
import { getDashboardData } from "@/lib/dashboard-data";
import { getPaymentsWorkspaceData } from "@/lib/ops-data";

export default async function PaymentsPage() {
  const data = await getDashboardData();
  const payments = await getPaymentsWorkspaceData();

  return (
    <main className="min-h-screen bg-[#f6f3ec] text-[#132238] p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div><p className="text-xs tracking-[0.28em] uppercase text-[#b38728] font-semibold">Revenue Control</p><h1 className="text-5xl font-black tracking-tight mt-2" style={{ fontFamily: 'Georgia, serif' }}>Payments Center</h1><p className="text-[#526172] mt-3 text-lg">{data.organizationName} • every invoice, installment, overdue account, and breeder receivable in one ledger.</p></div>
          <div className="flex gap-3"><Link href="/dashboard" className="rounded-full border border-[#d8cfbf] bg-white px-6 py-3 font-semibold shadow-sm">Back Dashboard</Link><Link href="/dashboard/payments/new" className="rounded-full bg-[#2f5d3f] text-white px-6 py-3 font-semibold shadow-lg">+ Log Payment</Link></div>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <MoneyCard label="Open Balances" value={`$${data.money.openBalances}`} icon={DollarSign} />
          <MoneyCard label="Due Soon" value={data.money.dueSoon} icon={Receipt} />
          <MoneyCard label="Overdue" value={data.money.overdue} icon={AlertTriangle} />
          <MoneyCard label="Payment Plans" value={data.counts.buyers} icon={CreditCard} />
        </section>

        <section className="rounded-[30px] border border-[#e2d9ca] bg-white p-6 shadow-[0_20px_60px_rgba(19,34,56,0.05)]">
          <p className="text-xs uppercase tracking-[0.22em] text-[#8a7757] font-semibold">Recent breeder payments</p>
          {payments.length === 0 ? <div className="mt-6 rounded-[24px] border border-[#eee5d8] bg-[#fcfbf8] p-6 text-center"><p className="font-black">No payments logged yet</p></div> : <div className="mt-5 space-y-4">{payments.map((payment: any) => <div key={payment.id} className="rounded-[24px] border border-[#eee5d8] bg-[#fcfbf8] p-5 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4"><div><p className="text-xl font-black">{payment.buyers.full_name}</p><p className="text-sm text-[#6b7785] mt-1">{payment.payment_date}</p></div><div className="flex gap-3 flex-wrap"><span className="rounded-full bg-white border border-[#e2d9ca] px-3 py-1 text-[11px] font-bold uppercase">{payment.type}</span><span className="rounded-full bg-white border border-[#e2d9ca] px-3 py-1 text-[11px] font-bold uppercase">{payment.method}</span><span className="rounded-full bg-[#eef5eb] px-4 py-2 text-sm font-black text-[#2f5d3f]">${payment.amount}</span></div></div>)}</div>}
        </section>
      </div>
    </main>
  );
}
function MoneyCard({ label, value, icon: Icon }: { label: string; value: number | string; icon: typeof DollarSign }) { return <div className="rounded-[24px] border border-[#e2d9ca] bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><p className="text-[11px] uppercase tracking-[0.22em] text-[#8a7757] font-semibold">{label}</p><Icon className="h-5 w-5 text-[#2f5d3f]" /></div><p className="text-4xl font-black mt-3" style={{ fontFamily: 'Georgia, serif' }}>{value}</p></div>; }
