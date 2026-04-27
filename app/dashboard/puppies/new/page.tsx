import { createPuppyRecord } from "@/app/dashboard/puppies/actions";

export default function NewPuppyPage() {
  return (
    <main className="min-h-screen bg-[#f6f3ec] text-[#132238] p-6 md:p-10">
      <div className="mx-auto max-w-4xl rounded-[28px] border border-[#e2d9ca] bg-white p-8 shadow-[0_20px_60px_rgba(19,34,56,0.05)]">
        <p className="text-xs tracking-[0.28em] uppercase text-[#b38728] font-semibold">Puppy Intake</p>
        <h1 className="text-4xl font-black mt-2" style={{ fontFamily: 'Georgia, serif' }}>Add Puppy Profile</h1>
        <form action={createPuppyRecord} className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="puppy_name" placeholder="Registered Puppy Name" className="rounded-xl border p-3" />
          <input name="call_name" placeholder="Call Name" className="rounded-xl border p-3" />
          <input name="litter_name" placeholder="Litter Name" className="rounded-xl border p-3" />
          <input name="buyer_name" placeholder="Assigned Buyer (optional)" className="rounded-xl border p-3" />
          <input name="date_of_birth" type="date" className="rounded-xl border p-3" />
          <select name="sex" className="rounded-xl border p-3"><option value="">Sex</option><option>male</option><option>female</option></select>
          <input name="color" placeholder="Color" className="rounded-xl border p-3" />
          <input name="coat" placeholder="Coat" className="rounded-xl border p-3" />
          <input name="pattern" placeholder="Pattern" className="rounded-xl border p-3" />
          <select name="status" className="rounded-xl border p-3"><option>available</option><option>reserved</option><option>pending</option><option>sold</option><option>retained</option></select>
          <input name="registry" placeholder="Registry / AKC #" className="rounded-xl border p-3" />
          <input name="photo_url" placeholder="Photo URL" className="rounded-xl border p-3" />
          <input name="price" placeholder="Price" className="rounded-xl border p-3" />
          <input name="deposit" placeholder="Deposit" className="rounded-xl border p-3" />
          <input name="balance" placeholder="Balance (optional)" className="rounded-xl border p-3" />
          <input name="description" placeholder="Description" className="rounded-xl border p-3 md:col-span-2" />
          <textarea name="notes" placeholder="Notes" className="rounded-xl border p-3 md:col-span-2 min-h-[120px]" />
          <label><input type="checkbox" name="is_public" defaultChecked /> Public Listing</label>
          <label><input type="checkbox" name="portal_visible" defaultChecked /> Buyer Portal Visible</label>
          <label><input type="checkbox" name="retained_for_program" /> Retained For Program</label>
          <label><input type="checkbox" name="go_home_ready" /> Go Home Ready</label>
          <button className="md:col-span-2 rounded-xl bg-[#2f5d3f] px-6 py-4 text-white font-bold">Save Puppy</button>
        </form>
      </div>
    </main>
  );
}
