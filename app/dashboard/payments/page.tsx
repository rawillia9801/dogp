import Link from "next/link";
import { AlertTriangle, CreditCard, DollarSign, Plus, Receipt } from "lucide-react";
import { getDashboardData } from "@/lib/dashboard-data";

export default async function PaymentsPage() {
  const data = await getDashboardData();

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

        <section className="grid gap-5 lg:grid-cols-2">
          <div className="rounded-[30px] border border-[#e2d9ca] bg-white p-6 shadow-[0_20px_60px_rgba(19,34,56,0.05)]">
            <p className="text-xs uppercase tracking-[0.22em] text-[#8a7757] font-semibold">Collections board</p>
            <div className="mt-5 space-y-3">
              <FinanceRow title="Incoming deposits" text="Reservation and waitlist payments populate here." />
              <FinanceRow title="Installment plans" text="Scheduled buyer installments and due dates populate here." />
              <FinanceRow title="Overdue intervention" text="Late accounts requiring breeder follow-up populate here." />
            </div>
          </div>
          <div className="rounded-[30px] border border-[#e2d9ca] bg-gradient-to-br from-[#2f5d3f] to-[#466f54] p-6 text-white shadow-xl">
            <p className="font-bold">Payment intelligence layer active</p>
            <p className="mt-3 text-white/80">This page is now positioned as a finance workspace rather than a raw transactions screen. Next layer will include buyer-by-buyer receivable cards and quick collect actions.</p>
            <Link href="/dashboard/payments/new" className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-[#2f5d3f]"><Plus className="h-4 w-4" />Log breeder payment</Link>
          </div>
        </section>
      </div>
    </main>
  );
}
function MoneyCard({ label, value, icon: Icon }: { label: string; value: number | string; icon: typeof DollarSign }) { return <div className="rounded-[24px] border border-[#e2d9ca] bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><p className="text-[11px] uppercase tracking-[0.22em] text-[#8a7757] font-semibold">{label}</p><Icon className="h-5 w-5 text-[#2f5d3f]" /></div><p className="text-4xl font-black mt-3" style={{ fontFamily: 'Georgia, serif' }}>{value}</p></div>; }
function FinanceRow({ title, text }: { title: string; text: string }) { return <div className="rounded-2xl border border-[#eee5d8] bg-[#fcfbf8] p-5"><p className="font-black">{title}</p><p className="text-sm mt-2 text-[#6b7785]">{text}</p></div>; }
