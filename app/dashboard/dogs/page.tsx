import Link from "next/link";
import { Search, ShieldCheck, Sparkles } from "lucide-react";
import { getDogsRegistryData } from "@/lib/dogs-data";
import { deleteDogRecord } from "./actions";
import { DeleteDogButton } from "./delete-dog-button";

export default async function DogsRegistryPage() {
  const data = await getDogsRegistryData();

  return (
    <main className="min-h-screen bg-[#f6f3ec] text-[#132238] p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-xs tracking-[0.28em] uppercase text-[#b38728] font-semibold">Foundation Records</p>
            <h1 className="text-5xl font-black tracking-tight mt-2" style={{ fontFamily: 'Georgia, serif' }}>Dogs Registry</h1>
            <p className="text-[#526172] mt-3 text-lg">{data.organizationName} • every breeding dog, keeper, retiree, and prospect in one controlled registry.</p>
          </div>
          <div className="flex gap-3">
            <Link href="/dashboard" className="rounded-full border border-[#d8cfbf] bg-white px-6 py-3 font-semibold shadow-sm">Back Dashboard</Link>
            <Link href="/dashboard/dogs/new" className="rounded-full bg-[#2f5d3f] text-white px-6 py-3 font-semibold shadow-lg">+ Add Dog</Link>
          </div>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <StatCard label="Total Dogs" value={data.stats.total} />
          <StatCard label="Active Sires" value={data.stats.activeSires} />
          <StatCard label="Active Dams" value={data.stats.activeDams} />
          <StatCard label="Puppies" value={data.stats.puppies} />
          <StatCard label="Retired" value={data.stats.retired} />
          <StatCard label="Eligible" value={data.stats.eligible} />
        </section>

        <section className="rounded-[30px] border border-[#e2d9ca] bg-white p-5 shadow-[0_20px_60px_rgba(19,34,56,0.05)]">
          <div className="mb-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 rounded-[24px] bg-[#fcfbf8] p-5 border border-[#eee5d8]">
            <div>
              <p className="text-lg font-black">Program Dog Directory</p>
              <p className="text-sm text-[#6b7785] mt-1">Cleaner breeder-facing records with premium controls and protected registry actions.</p>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-[#e2d9ca] bg-white px-4 py-3 text-sm text-[#7b8794] min-w-[260px]">
              <Search className="h-4 w-4" />
              Search + filters being wired next
            </div>
          </div>

          {data.dogs.length === 0 ? (
            <div className="p-14 text-center">Empty Registry</div>
          ) : (
            <div className="space-y-4">
              {data.dogs.map((dog) => (
                <div key={dog.id} className="rounded-[26px] border border-[#eee5d8] bg-[#fcfbf8] p-5 shadow-sm transition hover:shadow-md">
                  <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr_1fr_1fr_auto] gap-5 items-center">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[#e9f0e7] to-[#dbe7d7] flex items-center justify-center text-2xl font-black text-[#2f5d3f]">{dog.callName.slice(0,1).toUpperCase()}</div>
                      <div>
                        <p className="text-lg font-black">{dog.callName}</p>
                        <p className="text-sm text-[#6b7785]">{dog.registeredName || 'No registered name entered'}</p>
                        <div className="mt-2 flex gap-2 flex-wrap">
                          <span className="rounded-full bg-white border border-[#e2d9ca] px-3 py-1 text-[11px] font-bold capitalize">{dog.sex || 'unknown'}</span>
                          <span className="rounded-full bg-white border border-[#e2d9ca] px-3 py-1 text-[11px] font-bold capitalize">{dog.role.replace(/_/g, ' ')}</span>
                          <span className="rounded-full bg-white border border-[#e2d9ca] px-3 py-1 text-[11px] font-bold capitalize">{dog.status}</span>
                        </div>
                      </div>
                    </div>
                    <div><p className="text-xs uppercase tracking-[0.22em] text-[#8a7757] font-semibold">Registry</p><p className="text-sm mt-2 text-[#4f5d6b]">{dog.registry || '—'}</p></div>
                    <div><p className="text-xs uppercase tracking-[0.22em] text-[#8a7757] font-semibold">Date of Birth</p><p className="text-sm mt-2 text-[#4f5d6b]">{dog.dateOfBirth || '—'}</p></div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.22em] text-[#8a7757] font-semibold">Program Notes</p>
                      <p className="text-sm mt-2 text-[#4f5d6b]">{dog.provenStatus || dog.notes || 'No internal notes yet'}</p>
                      <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#eef5eb] px-3 py-1 text-xs font-bold text-[#2f5d3f]"><ShieldCheck className="h-3.5 w-3.5" /> Registry Protected</div>
                    </div>
                    <div className="flex flex-col gap-2 min-w-[110px]">
                      <Link href={`/dashboard/dogs/${dog.id}/edit`} className="rounded-full border border-[#d8cfbf] bg-white px-4 py-2 text-center text-xs font-semibold">Edit</Link>
                      <form action={deleteDogRecord}><input type="hidden" name="dog_id" value={dog.id} /><DeleteDogButton /></form>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-[28px] border border-[#e2d9ca] bg-gradient-to-r from-[#2f5d3f] to-[#466f54] p-6 text-white shadow-xl">
          <div className="flex items-center gap-3"><Sparkles className="h-5 w-5 text-[#d9c27b]" /><p className="font-bold">Registry Intelligence Layer Coming Next</p></div>
        </section>
      </div>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: number | string }) {
  return <div className="rounded-[24px] border border-[#e2d9ca] bg-white p-5 shadow-sm"><p className="text-[11px] uppercase tracking-[0.22em] text-[#8a7757] font-semibold">{label}</p><p className="text-4xl font-black mt-3" style={{ fontFamily: 'Georgia, serif' }}>{value}</p></div>;
}
