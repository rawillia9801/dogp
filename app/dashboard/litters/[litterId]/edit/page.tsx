import Link from "next/link";
import { notFound } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase";
import { getCurrentOrganizationId } from "@/lib/dogs-data";
import { updateLitterRecord } from "../../actions";
import { SaveRecordButton } from "@/app/dashboard/record-buttons";

export default async function EditLitterPage({ params }: { params: Promise<{ litterId: string }> }) {
  const { litterId } = await params;
  const admin = createSupabaseAdminClient();
  const organizationId = await getCurrentOrganizationId();
  if (!admin || !organizationId) notFound();
  const { data: litter } = await admin.from("litters").select("*").eq("id", litterId).eq("organization_id", organizationId).maybeSingle();
  if (!litter) notFound();
  return <main className="min-h-screen bg-[#f6f3ec] text-[#132238] p-8 md:p-12"><div className="max-w-5xl mx-auto space-y-8"><div className="flex items-center justify-between"><div><p className="text-xs tracking-[0.28em] uppercase text-[#b38728] font-semibold">Litter Intake</p><h1 className="text-5xl font-black tracking-tight mt-2" style={{ fontFamily: 'Georgia, serif' }}>Edit litter</h1></div><Link href="/dashboard/litters" className="rounded-full border border-[#d8cfbf] bg-white px-6 py-3 font-semibold shadow-sm">Back to Litters</Link></div><form action={updateLitterRecord} className="grid grid-cols-1 md:grid-cols-2 gap-5 rounded-[32px] border border-[#e2d9ca] bg-white p-8 shadow-[0_20px_60px_rgba(19,34,56,0.06)]"><input type="hidden" name="litter_id" value={litter.id} /><Field label="Litter Name" name="litter_name" defaultValue={litter.litter_name || ''} /><Field label="Breeding Date" name="breeding_date" type="date" defaultValue={litter.breeding_date || ''} /><Field label="Due Date" name="due_date" type="date" defaultValue={litter.due_date || ''} /><Field label="Whelp Date" name="whelp_date" type="date" defaultValue={litter.whelp_date || ''} /><Field label="Expected Size" name="expected_size" defaultValue={litter.expected_size || ''} /><Field label="Reservation Goal" name="reservation_goal" defaultValue={String(litter.reservation_goal || '')} /><div className="md:col-span-2"><label className="text-xs uppercase tracking-[0.22em] text-[#8a7757] font-semibold">Notes</label><textarea name="notes" rows={8} defaultValue={litter.notes || ''} className="mt-2 w-full rounded-2xl border border-[#ddd2c0] bg-[#fcfbf8] px-4 py-3 outline-none" /></div><div className="md:col-span-2 flex justify-end"><SaveRecordButton idleText="Save Litter Changes" pendingText="Saving Litter..." /></div></form></div></main>; }
function Field({ label, name, type = 'text', defaultValue = '' }: { label: string; name: string; type?: string; defaultValue?: string }) { return <div><label className="text-xs uppercase tracking-[0.22em] text-[#8a7757] font-semibold">{label}</label><input name={name} defaultValue={defaultValue} type={type} className="mt-2 w-full rounded-2xl border border-[#ddd2c0] bg-[#fcfbf8] px-4 py-3 outline-none" /></div>; }
