import Link from "next/link";
import { getDogsRegistryData } from "@/lib/dogs-data";
import { deleteDogRecord } from "./actions";

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

        <section className="rounded-[30px] border border-[#e2d9ca] bg-white shadow-[0_20px_60px_rgba(19,34,56,0.05)] overflow-hidden">
          <div className="grid grid-cols-9 gap-4 px-6 py-4 text-[11px] uppercase tracking-[0.22em] text-[#8a7757] font-semibold border-b border-[#eee5d8]">
            <div>Call Name</div>
            <div>Registered</div>
            <div>Sex</div>
            <div>Role</div>
            <div>Status</div>
            <div>DOB</div>
            <div>Registry</div>
            <div>Program Notes</div>
            <div>Actions</div>
          </div>

          {data.dogs.length === 0 ? (
            <div className="p-14 text-center">
              <h3 className="text-3xl font-black" style={{ fontFamily: 'Georgia, serif' }}>No dogs in registry yet</h3>
              <p className="text-[#5d6c7d] mt-3">Start by adding your first sire, dam, or keeper prospect. This unlocks live breeding program intelligence.</p>
              <Link href="/dashboard/dogs/new" className="inline-block mt-6 rounded-full bg-[#2f5d3f] text-white px-6 py-3 font-semibold">Create First Dog</Link>
            </div>
          ) : (
            data.dogs.map((dog) => (
              <div key={dog.id} className="grid grid-cols-9 gap-4 px-6 py-5 border-b border-[#f1ebdf] items-center text-sm">
                <div className="font-bold text-base">{dog.callName}</div>
                <div>{dog.registeredName || '—'}</div>
                <div className="capitalize">{dog.sex || '—'}</div>
                <div className="capitalize">{dog.role.replace(/_/g, ' ')}</div>
                <div className="capitalize">{dog.status}</div>
                <div>{dog.dateOfBirth || '—'}</div>
                <div>{dog.registry || '—'}</div>
                <div>{dog.provenStatus || dog.notes || '—'}</div>
                <div className="flex flex-col gap-2">
                  <Link href={`/dashboard/dogs/${dog.id}/edit`} className="rounded-full border border-[#d8cfbf] bg-[#fcfbf8] px-4 py-2 text-center text-xs font-semibold">Edit</Link>
                  <form action={deleteDogRecord}>
                    <input type="hidden" name="dog_id" value={dog.id} />
                    <button type="submit" className="w-full rounded-full bg-[#8b2e2e] text-white px-4 py-2 text-xs font-semibold">Delete</button>
                  </form>
                </div>
              </div>
            ))
          )}
        </section>
      </div>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-[24px] border border-[#e2d9ca] bg-white p-5 shadow-sm">
      <p className="text-[11px] uppercase tracking-[0.22em] text-[#8a7757] font-semibold">{label}</p>
      <p className="text-4xl font-black mt-3" style={{ fontFamily: 'Georgia, serif' }}>{value}</p>
    </div>
  );
}
