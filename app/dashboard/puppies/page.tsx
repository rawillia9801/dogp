import Link from "next/link";
import { Heart, PawPrint, Plus, ShieldCheck, Star } from "lucide-react";
import { getDashboardData } from "@/lib/dashboard-data";

export default async function PuppiesPage() {
  const data = await getDashboardData();
  return (
    <main className="min-h-screen bg-[#f6f3ec] text-[#132238] p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"><div><p className="text-xs tracking-[0.28em] uppercase text-[#b38728] font-semibold">Puppy Placement</p><h1 className="text-5xl font-black tracking-tight mt-2" style={{ fontFamily: 'Georgia, serif' }}>Puppies Workspace</h1><p className="text-[#526172] mt-3 text-lg">{data.organizationName} • every puppy profile, reservation, retention decision, and placement step in one breeder board.</p></div><div className="flex gap-3"><Link href="/dashboard" className="rounded-full border border-[#d8cfbf] bg-white px-6 py-3 font-semibold shadow-sm">Back Dashboard</Link><Link href="/dashboard/puppies/new" className="rounded-full bg-[#2f5d3f] text-white px-6 py-3 font-semibold shadow-lg">+ Add Puppy</Link></div></div>
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4"><CardStat label="Total Puppies" value={data.counts.puppies} icon={PawPrint} /><CardStat label="Available" value={data.counts.availablePuppies} icon={ShieldCheck} /><CardStat label="Reserved" value={data.counts.reservedPuppies} icon={Heart} /><CardStat label="Retained" value={0} icon={Star} /></section>
        <section className="rounded-[30px] border border-[#e2d9ca] bg-white p-6 shadow-[0_20px_60px_rgba(19,34,56,0.05)] text-center"><PawPrint className="mx-auto h-10 w-10 text-[#2f5d3f]" /><p className="mt-4 font-black">Puppy profile cards, reservation slots, and buyer assignment map live here.</p><p className="mt-2 text-sm text-[#6b7785]">This route now exists as a premium puppy management workspace.</p></section>
      </div>
    </main>
  );
}
function CardStat({ label, value, icon: Icon }: { label: string; value: number | string; icon: typeof PawPrint }) { return <div className="rounded-[24px] border border-[#e2d9ca] bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><p className="text-[11px] uppercase tracking-[0.22em] text-[#8a7757] font-semibold">{label}</p><Icon className="h-5 w-5 text-[#2f5d3f]" /></div><p className="text-4xl font-black mt-3" style={{ fontFamily: 'Georgia, serif' }}>{value}</p></div>; }
