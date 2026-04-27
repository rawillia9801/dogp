import Link from "next/link";
import { HeartPulse, CalendarClock, ShieldCheck, Sparkles } from "lucide-react";
import { getDashboardData } from "@/lib/dashboard-data";

export default async function BreedingProgramPage() {
  const data = await getDashboardData();

  return (
    <main className="min-h-screen bg-[#f6f3ec] text-[#132238] p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-xs tracking-[0.28em] uppercase text-[#b38728] font-semibold">Pairing Engine</p>
            <h1 className="text-5xl font-black tracking-tight mt-2" style={{ fontFamily: 'Georgia, serif' }}>Breeding Program</h1>
            <p className="text-[#526172] mt-3 text-lg">{data.organizationName} • planned pairings, pregnancy pipeline, litter goals, and reservation forecasting.</p>
          </div>
          <div className="flex gap-3"><Link href="/dashboard" className="rounded-full border border-[#d8cfbf] bg-white px-6 py-3 font-semibold shadow-sm">Back Dashboard</Link></div>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Stat label="Active Pairings" value={data.counts.breedings} icon={HeartPulse} />
          <Stat label="Pregnancies" value={data.counts.pregnancies} icon={CalendarClock} />
          <Stat label="Litters Planned" value={data.counts.litters} icon={ShieldCheck} />
          <Stat label="Reservations" value={data.counts.reservedPuppies} icon={Sparkles} />
        </section>

        <section className="rounded-[30px] border border-[#e2d9ca] bg-white p-8 shadow-[0_20px_60px_rgba(19,34,56,0.05)]">
          <p className="text-xs uppercase tracking-[0.22em] text-[#8a7757] font-semibold">Breeding command board</p>
          <h2 className="mt-3 text-3xl font-black" style={{ fontFamily: 'Georgia, serif' }}>This module is now live.</h2>
          <p className="mt-3 text-[#5d6c7d] leading-7">Your subscriber route was missing entirely, which is why the sidebar link 404'd. This page is now wired and reading live breeding counts from dashboard data. Full pairing CRUD is next layer.</p>
        </section>
      </div>
    </main>
  );
}

function Stat({ label, value, icon: Icon }: any) { return <div className="rounded-[24px] border border-[#e2d9ca] bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><p className="text-[11px] uppercase tracking-[0.22em] text-[#8a7757] font-semibold">{label}</p><Icon className="h-5 w-5 text-[#2f5d3f]" /></div><p className="text-4xl font-black mt-3" style={{ fontFamily: 'Georgia, serif' }}>{value}</p></div>; }
