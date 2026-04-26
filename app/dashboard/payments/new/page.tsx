import Link from "next/link";

export default function NewPaymentPage() {
  return (
    <main className="min-h-screen bg-[#f6f3ec] text-[#132238] p-8 md:p-12">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs tracking-[0.28em] uppercase text-[#b38728] font-semibold">Revenue Entry</p>
            <h1 className="text-5xl font-black tracking-tight mt-2" style={{ fontFamily: 'Georgia, serif' }}>Log a breeder payment</h1>
            <p className="text-[#526172] mt-3 text-lg">Capture deposits, installment receipts, final balances, invoice references, and finance notes.</p>
          </div>
          <Link href="/dashboard/payments" className="rounded-full border border-[#d8cfbf] bg-white px-6 py-3 font-semibold shadow-sm">Back to Payments</Link>
        </div>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-5 rounded-[32px] border border-[#e2d9ca] bg-white p-8 shadow-[0_20px_60px_rgba(19,34,56,0.06)]">
          <Field label="Buyer Name" />
          <Field label="Payment Amount" />
          <Field label="Payment Date" type="date" />
          <Field label="Payment Type" />
          <Field label="Invoice / Contract Ref" />
          <Field label="Remaining Balance" />
          <Field label="Method" />
          <Field label="Assigned Puppy / Litter" />
          <div className="md:col-span-2"><label className="text-xs uppercase tracking-[0.22em] text-[#8a7757] font-semibold">Finance Notes</label><textarea rows={5} className="mt-2 w-full rounded-2xl border border-[#ddd2c0] bg-[#fcfbf8] px-4 py-3 outline-none" /></div>
          <div className="md:col-span-2 flex justify-end"><button className="rounded-full bg-[#2f5d3f] text-white px-7 py-3 font-semibold shadow-lg">Save Payment</button></div>
        </form>
      </div>
    </main>
  );
}
function Field({ label, type = 'text' }: { label: string; type?: string }) { return <div><label className="text-xs uppercase tracking-[0.22em] text-[#8a7757] font-semibold">{label}</label><input type={type} className="mt-2 w-full rounded-2xl border border-[#ddd2c0] bg-[#fcfbf8] px-4 py-3 outline-none" /></div>; }
