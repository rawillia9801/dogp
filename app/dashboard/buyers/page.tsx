import Link from "next/link";
import { DollarSign, FileText, ShieldCheck, Users } from "lucide-react";
import { getDashboardData } from "@/lib/dashboard-data";
import { getBuyersWorkspaceData } from "@/lib/ops-data";

export default async function BuyersPage() {
  const data = await getDashboardData();
  const buyers = await getBuyersWorkspaceData();

  return (
    <main className="min-h-screen bg-[#f6f3ec] text-[#132238] p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div><p className="text-xs tracking-[0.28em] uppercase text-[#b38728] font-semibold">Breeder Sales CRM</p><h1 className="text-5xl font-black tracking-tight mt-2" style={{ fontFamily: 'Georgia, serif' }}>Buyer Command Center</h1><p className="text-[#526172] mt-3 text-lg">{data.organizationName} • applications, approvals, balances, documents, and communication in one protected place.</p></div>
          <div className="flex gap-3"><Link href="/dashboard" className="rounded-full border border-[#d8cfbf] bg-white px-6 py-3 font-semibold shadow-sm">Back Dashboard</Link><Link href="/dashboard/buyers/new" className="rounded-full bg-[#2f5d3f] text-white px-6 py-3 font-semibold shadow-lg">+ Add Buyer</Link></div>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Stat label="Total Buyers" value={data.counts.buyers} icon={Users} />
          <Stat label="Applications" value={data.counts.applications} icon={FileText} />
          <Stat label="Open Docs" value={data.counts.documentsPending} icon={ShieldCheck} />
          <Stat label="Open Balances" value={`$${data.money.openBalances}`} icon={DollarSign} />
        </section>

        <section className="rounded-[30px] border border-[#e2d9ca] bg-white p-6 shadow-[0_20px_60px_rgba(19,34,56,0.05)]">
          <p className="text-xs uppercase tracking-[0.22em] text-[#8a7757] font-semibold">Live buyer families</p>
          {buyers.length === 0 ? <div className="mt-6 rounded-[24px] border border-[#eee5d8] bg-[#fcfbf8] p-6 text-center"><Users className="mx-auto h-9 w-9 text-[#2f5d3f]" /><p className="mt-4 font-black">No buyers created yet</p></div> : <div className="mt-5 space-y-4">{buyers.map((buyer) => <div key={buyer.id} className="rounded-[24px] border border-[#eee5d8] bg-[#fcfbf8] p-5 shadow-sm"><div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4"><div><p className="text-xl font-black">{buyer.full_name}</p><p className="text-sm text-[#6b7785] mt-1">{buyer.email}</p><div className="mt-2 flex gap-2 flex-wrap"><span className="rounded-full bg-white border border-[#e2d9ca] px-3 py-1 text-[11px] font-bold capitalize">{buyer.status}</span><span className="rounded-full bg-white border border-[#e2d9ca] px-3 py-1 text-[11px] font-bold">{buyer.city || '—'} {buyer.state || ''}</span></div></div><div className="rounded-2xl bg-white border border-[#e2d9ca] px-4 py-3 text-sm">{buyer.phone || 'No phone'}</div></div><p className="mt-4 text-sm whitespace-pre-line text-[#5d6c7d]">{buyer.notes || 'No notes yet.'}</p></div>)}</div>}
        </section>
      </div>
    </main>
  );
}
function Stat({ label, value, icon: Icon }: { label: string; value: number | string; icon: typeof Users }) { return <div className="rounded-[24px] border border-[#e2d9ca] bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><p className="text-[11px] uppercase tracking-[0.22em] text-[#8a7757] font-semibold">{label}</p><Icon className="h-5 w-5 text-[#2f5d3f]" /></div><p className="text-4xl font-black mt-3" style={{ fontFamily: 'Georgia, serif' }}>{value}</p></div>; }
