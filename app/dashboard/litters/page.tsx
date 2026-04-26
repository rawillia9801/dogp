import Link from "next/link";
import { Baby, CalendarClock, HeartPulse, PawPrint, Plus, ShieldCheck, Sparkles } from "lucide-react";
import { getDashboardData } from "@/lib/dashboard-data";
import { getLittersWorkspaceData } from "@/lib/ops-data";

export default async function LittersPage() {
  const data = await getDashboardData();
  const litters = await getLittersWorkspaceData();

  return (
    <main className="min-h-screen bg-[#f6f3ec] text-[#132238] p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <Header title="Litters Workspace" subtitle={`${data.organizationName} • plan, whelp, track, and close each litter with confidence.`} cta="Create Litter" href="/dashboard/litters/new" />

        <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard label="Total Litters" value={data.counts.litters} icon={Baby} />
          <StatCard label="Puppies" value={data.counts.puppies} icon={PawPrint} />
          <StatCard label="Available" value={data.counts.availablePuppies} icon={ShieldCheck} />
          <StatCard label="Reserved" value={data.counts.reservedPuppies} icon={HeartPulse} />
        </section>

        <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <Card>
            <SectionLabel>Whelping command</SectionLabel>
            <h2 className="mt-3 text-3xl font-black" style={{ fontFamily: "Georgia, serif" }}>Current litter board</h2>
            <p className="mt-2 text-[#5d6c7d]">Live litter records now appear here after creation.</p>
            {litters.length === 0 ? (
              <div className="mt-6 rounded-[24px] border border-[#e7ddce] bg-[#fcfbf8] p-6 text-center">
                <Baby className="mx-auto h-10 w-10 text-[#2f5d3f]" />
                <p className="mt-4 font-black">No litters yet</p>
                <p className="mt-2 text-sm text-[#6b7785]">Use Create Litter to start turning this board into live whelping intelligence.</p>
                <Link href="/dashboard/litters/new" className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#2f5d3f] px-5 py-3 text-sm font-bold text-white"><Plus className="h-4 w-4" />Create Litter</Link>
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {litters.map((litter) => (
                  <div key={litter.id} className="rounded-[24px] border border-[#eee5d8] bg-[#fcfbf8] p-5 shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div>
                        <p className="text-xl font-black">{litter.litter_name}</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <Badge>{litter.status || "planned"}</Badge>
                          <Badge>Expected {litter.expected_size || "—"}</Badge>
                          <Badge>Goal {litter.reservation_goal ?? "—"}</Badge>
                        </div>
                      </div>
                      <div className="rounded-2xl bg-white border border-[#e2d9ca] px-4 py-3 text-sm text-[#4f5d6b]">
                        <p><b>Due:</b> {litter.due_date || "—"}</p>
                        <p><b>Whelp:</b> {litter.whelp_date || "—"}</p>
                      </div>
                    </div>
                    <p className="mt-4 text-sm leading-6 text-[#5d6c7d] whitespace-pre-line">{litter.notes || "No notes yet."}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card>
            <SectionLabel>Next milestones</SectionLabel>
            <div className="mt-4 space-y-3">
              <Milestone icon={CalendarClock} title="Due dates" text="Upcoming whelping windows appear from each litter record." />
              <Milestone icon={PawPrint} title="Puppy inventory" text="Available, reserved, retained, and placed counts roll up here." />
              <Milestone icon={Sparkles} title="Go-home readiness" text="Documents, balances, transport, and buyer steps will connect here." />
            </div>
          </Card>
        </section>
      </div>
    </main>
  );
}

function Header({ title, subtitle, cta, href }: { title: string; subtitle: string; cta: string; href: string }) { return <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"><div><p className="text-xs tracking-[0.28em] uppercase text-[#b38728] font-semibold">Breeder Operations</p><h1 className="text-5xl font-black tracking-tight mt-2" style={{ fontFamily: "Georgia, serif" }}>{title}</h1><p className="text-[#526172] mt-3 text-lg">{subtitle}</p></div><div className="flex gap-3"><Link href="/dashboard" className="rounded-full border border-[#d8cfbf] bg-white px-6 py-3 font-semibold shadow-sm">Back Dashboard</Link><Link href={href} className="rounded-full bg-[#2f5d3f] text-white px-6 py-3 font-semibold shadow-lg">+ {cta}</Link></div></div>; }
function Card({ children }: { children: React.ReactNode }) { return <div className="rounded-[30px] border border-[#e2d9ca] bg-white p-6 shadow-[0_20px_60px_rgba(19,34,56,0.05)]">{children}</div>; }
function SectionLabel({ children }: { children: React.ReactNode }) { return <p className="text-xs uppercase tracking-[0.22em] text-[#8a7757] font-semibold">{children}</p>; }
function Badge({ children }: { children: React.ReactNode }) { return <span className="rounded-full bg-white border border-[#e2d9ca] px-3 py-1 text-[11px] font-bold capitalize">{children}</span>; }
function StatCard({ label, value, icon: Icon }: { label: string; value: number | string; icon: typeof Baby }) { return <div className="rounded-[24px] border border-[#e2d9ca] bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><p className="text-[11px] uppercase tracking-[0.22em] text-[#8a7757] font-semibold">{label}</p><Icon className="h-5 w-5 text-[#2f5d3f]" /></div><p className="text-4xl font-black mt-3" style={{ fontFamily: "Georgia, serif" }}>{value}</p></div>; }
function Milestone({ icon: Icon, title, text }: { icon: typeof Baby; title: string; text: string }) { return <div className="rounded-2xl border border-[#eee5d8] bg-[#fcfbf8] p-4 flex gap-3"><Icon className="h-5 w-5 text-[#b38728] shrink-0" /><div><p className="font-black">{title}</p><p className="text-sm text-[#6b7785] mt-1">{text}</p></div></div>; }
