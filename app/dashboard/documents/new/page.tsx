import Link from "next/link";
import { createBuyerDocumentRecord } from "../actions";

export default function NewDocumentPage() {
  return (
    <main className="min-h-screen bg-[#f6f3ec] p-6 text-[#132238] md:p-10">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#b38728]">Document Intake</p>
            <h1 className="mt-2 text-5xl font-black tracking-tight" style={{ fontFamily: "Georgia, serif" }}>New Buyer Document</h1>
            <p className="mt-3 text-lg text-[#526172]">Create a buyer-facing contract, receipt, health document, or breeder paperwork record.</p>
          </div>
          <Link href="/dashboard/documents" className="rounded-full border border-[#d8cfbf] bg-white px-6 py-3 font-semibold shadow-sm">Back</Link>
        </div>

        <form action={createBuyerDocumentRecord} className="grid grid-cols-1 gap-5 rounded-[32px] border border-[#e2d9ca] bg-white p-8 shadow-[0_20px_60px_rgba(19,34,56,0.06)] md:grid-cols-2">
          <Field label="Document Title" name="title" required />
          <Field label="Buyer Name" name="buyer_name" />
          <Select label="Category" name="category" options={["contract", "health", "receipt", "invoice", "registration", "general"]} />
          <Select label="Status" name="status" options={["draft", "pending", "sent", "signed", "uploaded", "archived"]} />
          <Field label="File URL" name="file_url" />
          <label className="flex items-center gap-3 rounded-2xl border border-[#ddd2c0] bg-[#fcfbf8] px-4 py-3 text-sm font-semibold text-[#526172]"><input type="checkbox" name="visible_to_buyer" defaultChecked /> Visible to buyer</label>
          <div className="md:col-span-2"><label className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8a7757]">Notes</label><textarea name="notes" rows={6} className="mt-2 w-full rounded-2xl border border-[#ddd2c0] bg-[#fcfbf8] px-4 py-3 outline-none" /></div>
          <div className="md:col-span-2 flex justify-end"><button className="rounded-full bg-[#2f5d3f] px-7 py-3 font-bold text-white shadow-lg">Save Document</button></div>
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
