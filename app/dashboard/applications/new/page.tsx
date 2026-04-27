import Link from "next/link";
import { createBuyerApplicationRecord } from "../actions";

export default function NewApplicationPage() {
  return (
    <main className="min-h-screen bg-[#f6f3ec] p-6 text-[#132238] md:p-10">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#b38728]">Applicant Intake</p>
            <h1 className="mt-2 text-5xl font-black tracking-tight" style={{ fontFamily: "Georgia, serif" }}>New Buyer Application</h1>
            <p className="mt-3 text-lg text-[#526172]">Create a breeder screening application and auto-link the family into your buyer CRM.</p>
          </div>
          <Link href="/dashboard/applications" className="rounded-full border border-[#d8cfbf] bg-white px-6 py-3 font-semibold shadow-sm">Back</Link>
        </div>

        <form action={createBuyerApplicationRecord} className="grid grid-cols-1 gap-5 rounded-[32px] border border-[#e2d9ca] bg-white p-8 shadow-[0_20px_60px_rgba(19,34,56,0.06)] md:grid-cols-2">
          <Field label="Buyer Name" name="buyer_name" required />
          <Field label="Email" name="email" type="email" required />
          <Field label="Phone" name="phone" />
          <Field label="City, State" name="city_state" />
          <Field label="Desired Breed" name="desired_breed" />
          <Field label="Desired Sex" name="desired_sex" />
          <Field label="Desired Color" name="desired_color" />
          <Field label="Home Type" name="home_type" />
          <Field label="Fenced Yard" name="fenced_yard" />
          <Select label="Status" name="status" options={["submitted", "pending", "approved", "denied", "waitlist"]} />
          <div className="md:col-span-2"><label className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8a7757]">Notes</label><textarea name="notes" rows={6} className="mt-2 w-full rounded-2xl border border-[#ddd2c0] bg-[#fcfbf8] px-4 py-3 outline-none" /></div>
          <div className="md:col-span-2 flex justify-end"><button className="rounded-full bg-[#2f5d3f] px-7 py-3 font-bold text-white shadow-lg">Save Application</button></div>
        </form>
      </div>
    </main>
  );
}

function Field({ label, name, type = "text", required = false }: { label: string; name: string; type?: string; required?: boolean }) {
  return <div><label className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8a7757]">{label}</label><input required={required} type={type} name={name} className="mt-2 w-full rounded-2xl border border-[#ddd2c0] bg-[#fcfbf8] px-4 py-3 outline-none" /></div>;
}
function Select({ label, name, options }: { label: string; name: string; options: string[] }) {
  return <div><label className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8a7757]">{label}</label><select name={name} className="mt-2 w-full rounded-2xl border border-[#ddd2c0] bg-[#fcfbf8] px-4 py-3 outline-none">{options.map((option) => <option key={option} value={option}>{option}</option>)}</select></div>;
}
