import Link from "next/link";
import { notFound } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase";
import { getCurrentOrganizationId } from "@/lib/dogs-data";
import { updateBuyerRecord } from "../../actions";
import { SaveRecordButton } from "@/app/dashboard/record-buttons";

export default async function EditBuyerPage({ params }: { params: Promise<{ buyerId: string }> }) {
  const { buyerId } = await params;
  const admin = createSupabaseAdminClient();
  const organizationId = await getCurrentOrganizationId();
  if (!admin || !organizationId) notFound();

  const { data: buyer } = await admin.from("buyers").select("id,full_name,email,phone,status,city,state,notes").eq("id", buyerId).eq("organization_id", organizationId).maybeSingle();
  if (!buyer) notFound();

  return (
    <main className="min-h-screen bg-[#f6f3ec] text-[#132238] p-8 md:p-12"><div className="max-w-5xl mx-auto space-y-8"><div className="flex items-center justify-between"><div><p className="text-xs tracking-[0.28em] uppercase text-[#b38728] font-semibold">Buyer Intake</p><h1 className="text-5xl font-black tracking-tight mt-2" style={{ fontFamily: 'Georgia, serif' }}>Edit buyer family</h1></div><Link href="/dashboard/buyers" className="rounded-full border border-[#d8cfbf] bg-white px-6 py-3 font-semibold shadow-sm">Back to Buyers</Link></div><form action={updateBuyerRecord} className="grid grid-cols-1 md:grid-cols-2 gap-5 rounded-[32px] border border-[#e2d9ca] bg-white p-8 shadow-[0_20px_60px_rgba(19,34,56,0.06)]"><input type="hidden" name="buyer_id" value={buyer.id} /><Field label="Buyer Name" name="buyer_name" defaultValue={buyer.full_name || ""} /><Field label="Email" name="email" type="email" defaultValue={buyer.email || ""} /><Field label="Phone" name="phone" defaultValue={buyer.phone || ""} /><Field label="City / State" name="city_state" defaultValue={`${buyer.city || ""}${buyer.state ? `, ${buyer.state}` : ""}`} /><Field label="Application Status" name="application_status" defaultValue={buyer.status || "lead"} /><div className="md:col-span-2"><label className="text-xs uppercase tracking-[0.22em] text-[#8a7757] font-semibold">Internal Notes</label><textarea name="notes" rows={8} defaultValue={buyer.notes || ""} className="mt-2 w-full rounded-2xl border border-[#ddd2c0] bg-[#fcfbf8] px-4 py-3 outline-none" /></div><div className="md:col-span-2 flex justify-end"><SaveRecordButton idleText="Save Buyer Changes" pendingText="Saving Buyer..." /></div></form></div></main>
  );
}
function Field({ label, name, type = 'text', defaultValue = '' }: { label: string; name: string; type?: string; defaultValue?: string }) { return <div><label className="text-xs uppercase tracking-[0.22em] text-[#8a7757] font-semibold">{label}</label><input name={name} defaultValue={defaultValue} type={type} className="mt-2 w-full rounded-2xl border border-[#ddd2c0] bg-[#fcfbf8] px-4 py-3 outline-none" /></div>; }
