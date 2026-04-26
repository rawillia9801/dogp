import Link from "next/link";
import { createBuyerRecord } from "../actions";

export default function NewBuyerPage() {
  return (
    <main className="min-h-screen bg-[#f6f3ec] text-[#132238] p-8 md:p-12">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs tracking-[0.28em] uppercase text-[#b38728] font-semibold">Buyer Intake</p>
            <h1 className="text-5xl font-black tracking-tight mt-2" style={{ fontFamily: 'Georgia, serif' }}>Add a buyer family</h1>
            <p className="text-[#526172] mt-3 text-lg">Capture application details, puppy interest, payment commitments, and internal breeder notes.</p>
          </div>
          <Link href="/dashboard/buyers" className="rounded-full border border-[#d8cfbf] bg-white px-6 py-3 font-semibold shadow-sm">Back to Buyers</Link>
        </div>

        <form action={createBuyerRecord} className="grid grid-cols-1 md:grid-cols-2 gap-5 rounded-[32px] border border-[#e2d9ca] bg-white p-8 shadow-[0_20px_60px_rgba(19,34,56,0.06)]">
          <Field label="Buyer Name" name="buyer_name" />
          <Field label="Email" name="email" type="email" />
          <Field label="Phone" name="phone" />
          <Field label="City / State" name="city_state" />
          <Field label="Desired Breed" name="desired_breed" />
          <Field label="Desired Sex" name="desired_sex" />
          <Field label="Desired Color" name="desired_color" />
          <Field label="Budget" name="budget" />
          <Field label="Deposit Paid" name="deposit_paid" />
          <Field label="Balance Due" name="balance_due" />
          <Field label="Application Status" name="application_status" />
          <Field label="Assigned Litter" name="assigned_litter" />
          <div className="md:col-span-2"><label className="text-xs uppercase tracking-[0.22em] text-[#8a7757] font-semibold">Internal Notes</label><textarea name="notes" rows={5} className="mt-2 w-full rounded-2xl border border-[#ddd2c0] bg-[#fcfbf8] px-4 py-3 outline-none" /></div>
          <div className="md:col-span-2 flex justify-end"><button className="rounded-full bg-[#2f5d3f] text-white px-7 py-3 font-semibold shadow-lg">Save Buyer</button></div>
        </form>
      </div>
    </main>
  );
}
function Field({ label, name, type = 'text' }: { label: string; name: string; type?: string }) { return <div><label className="text-xs uppercase tracking-[0.22em] text-[#8a7757] font-semibold">{label}</label><input name={name} type={type} className="mt-2 w-full rounded-2xl border border-[#ddd2c0] bg-[#fcfbf8] px-4 py-3 outline-none" /></div>; }
