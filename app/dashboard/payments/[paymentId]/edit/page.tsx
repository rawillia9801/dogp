import Link from "next/link";
import { notFound } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase";
import { updatePaymentRecord } from "../../actions";
import { SaveRecordButton } from "@/app/dashboard/record-buttons";

export default async function EditPaymentPage({ params }: { params: Promise<{ paymentId: string }> }) {
  const { paymentId } = await params;
  const admin = createSupabaseAdminClient();
  if (!admin) notFound();

  const { data: payment } = await admin.from("buyer_payments").select("id,amount,payment_date,type,method,buyer_id,buyers(full_name)").eq("id", paymentId).maybeSingle();
  if (!payment) notFound();

  return (
    <main className="min-h-screen bg-[#f6f3ec] text-[#132238] p-8 md:p-12"><div className="max-w-5xl mx-auto space-y-8"><div className="flex items-center justify-between"><div><p className="text-xs tracking-[0.28em] uppercase text-[#b38728] font-semibold">Revenue Entry</p><h1 className="text-5xl font-black tracking-tight mt-2" style={{ fontFamily: 'Georgia, serif' }}>Edit payment record</h1></div><Link href="/dashboard/payments" className="rounded-full border border-[#d8cfbf] bg-white px-6 py-3 font-semibold shadow-sm">Back to Payments</Link></div><form action={updatePaymentRecord} className="grid grid-cols-1 md:grid-cols-2 gap-5 rounded-[32px] border border-[#e2d9ca] bg-white p-8 shadow-[0_20px_60px_rgba(19,34,56,0.06)]"><input type="hidden" name="payment_id" value={payment.id} /><Field label="Buyer Name" name="buyer_name" defaultValue={(payment as any).buyers?.full_name || ""} /><Field label="Payment Amount" name="payment_amount" defaultValue={String(payment.amount || "")} /><Field label="Payment Date" name="payment_date" type="date" defaultValue={payment.payment_date || ""} /><Field label="Payment Type" name="payment_type" defaultValue={payment.type || ""} /><Field label="Method" name="method" defaultValue={payment.method || ""} /><div className="md:col-span-2 flex justify-end"><SaveRecordButton idleText="Save Payment Changes" pendingText="Saving Payment..." /></div></form></div></main>
  );
}
function Field({ label, name, type = 'text', defaultValue = '' }: { label: string; name: string; type?: string; defaultValue?: string }) { return <div><label className="text-xs uppercase tracking-[0.22em] text-[#8a7757] font-semibold">{label}</label><input name={name} defaultValue={defaultValue} type={type} className="mt-2 w-full rounded-2xl border border-[#ddd2c0] bg-[#fcfbf8] px-4 py-3 outline-none" /></div>; }
