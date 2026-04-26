import Link from "next/link";
import { createLitterRecord } from "../actions";

export default function NewLitterPage() {
  return (
    <main className="min-h-screen bg-[#f6f3ec] text-[#132238] p-8 md:p-12">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs tracking-[0.28em] uppercase text-[#b38728] font-semibold">Litter Intake</p>
            <h1 className="text-5xl font-black tracking-tight mt-2" style={{ fontFamily: 'Georgia, serif' }}>Create a new litter</h1>
            <p className="text-[#526172] mt-3 text-lg">Record sire, dam, dates, puppy counts, deposits, and internal notes for this breeding outcome.</p>
          </div>
          <Link href="/dashboard/litters" className="rounded-full border border-[#d8cfbf] bg-white px-6 py-3 font-semibold shadow-sm">Back to Litters</Link>
        </div>

        <form action={createLitterRecord} className="grid grid-cols-1 md:grid-cols-2 gap-5 rounded-[32px] border border-[#e2d9ca] bg-white p-8 shadow-[0_20px_60px_rgba(19,34,56,0.06)]">
          <Field label="Litter Name" name="litter_name" />
          <Field label="Sire" name="sire" />
          <Field label="Dam" name="dam" />
          <Field label="Breeding Date" name="breeding_date" type="date" />
          <Field label="Due Date" name="due_date" type="date" />
          <Field label="Whelp Date" name="whelp_date" type="date" />
          <Field label="Puppies Born" name="puppies_born" type="number" />
          <Field label="Available Spots" name="available_spots" type="number" />
          <Field label="Reserved Spots" name="reserved_spots" type="number" />
          <Field label="Deposit Collected" name="deposit_collected" />
          <div className="md:col-span-2"><label className="text-xs uppercase tracking-[0.22em] text-[#8a7757] font-semibold">Litter Notes</label><textarea name="notes" rows={5} className="mt-2 w-full rounded-2xl border border-[#ddd2c0] bg-[#fcfbf8] px-4 py-3 outline-none" /></div>
          <div className="md:col-span-2 flex justify-end"><button className="rounded-full bg-[#2f5d3f] text-white px-7 py-3 font-semibold shadow-lg">Save Litter</button></div>
        </form>
      </div>
    </main>
  );
}
function Field({ label, name, type = 'text' }: { label: string; name: string; type?: string }) { return <div><label className="text-xs uppercase tracking-[0.22em] text-[#8a7757] font-semibold">{label}</label><input name={name} type={type} className="mt-2 w-full rounded-2xl border border-[#ddd2c0] bg-[#fcfbf8] px-4 py-3 outline-none" /></div>; }
