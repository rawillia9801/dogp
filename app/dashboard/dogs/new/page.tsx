import Link from "next/link";
import { createDogRecord } from "../actions";

export default function NewDogPage() {
  return (
    <main className="min-h-screen bg-[#f6f3ec] text-[#132238] p-8 md:p-12">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs tracking-[0.28em] uppercase text-[#b38728] font-semibold">Dog Registry Intake</p>
            <h1 className="text-5xl font-black tracking-tight mt-2" style={{ fontFamily: 'Georgia, serif' }}>Add a foundation dog</h1>
            <p className="text-[#526172] mt-3 text-lg">Create the sire, dam, keeper, or future breeding prospect that powers the rest of the workspace.</p>
          </div>
          <Link href="/dashboard/dogs" className="rounded-full border border-[#d8cfbf] bg-white px-6 py-3 font-semibold shadow-sm">Back to Dogs</Link>
        </div>

        <form action={createDogRecord} className="grid grid-cols-1 md:grid-cols-2 gap-5 rounded-[32px] border border-[#e2d9ca] bg-white p-8 shadow-[0_20px_60px_rgba(19,34,56,0.06)]">
          <Field label="Call Name" name="call_name" required />
          <Field label="Registered Name" name="registered_name" />
          <SelectField label="Sex" name="sex" options={["female", "male", "unknown"]} />
          <SelectField label="Program Role" name="role" options={["dam", "sire", "keeper", "prospect", "puppy", "retired"]} />
          <SelectField label="Status" name="status" options={["active", "watch", "hold", "retired", "sold"]} />
          <Field label="Date of Birth" name="date_of_birth" type="date" />
          <Field label="Color" name="color" />
          <Field label="Coat" name="coat" />
          <Field label="Registry" name="registry" />
          <Field label="Bloodline" name="bloodline" />
          <SelectField label="Breeding Eligibility" name="breeding_eligibility" options={["eligible", "pending", "hold"]} />
          <Field label="Proven Status" name="proven_status" />
          <div className="md:col-span-2">
            <label className="text-xs uppercase tracking-[0.22em] text-[#8a7757] font-semibold">Notes</label>
            <textarea name="notes" rows={5} className="mt-2 w-full rounded-2xl border border-[#ddd2c0] bg-[#fcfbf8] px-4 py-3 outline-none" />
          </div>
          <div className="md:col-span-2 flex justify-end">
            <button className="rounded-full bg-[#2f5d3f] text-white px-8 py-4 font-semibold shadow-lg">Save Dog Record</button>
          </div>
        </form>
      </div>
    </main>
  );
}

function Field({ label, name, type = 'text', required = false }: { label: string; name: string; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="text-xs uppercase tracking-[0.22em] text-[#8a7757] font-semibold">{label}</label>
      <input required={required} type={type} name={name} className="mt-2 w-full rounded-2xl border border-[#ddd2c0] bg-[#fcfbf8] px-4 py-3 outline-none" />
    </div>
  );
}

function SelectField({ label, name, options }: { label: string; name: string; options: string[] }) {
  return (
    <div>
      <label className="text-xs uppercase tracking-[0.22em] text-[#8a7757] font-semibold">{label}</label>
      <select name={name} className="mt-2 w-full rounded-2xl border border-[#ddd2c0] bg-[#fcfbf8] px-4 py-3 outline-none">
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>
  );
}
