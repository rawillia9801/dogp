import Link from "next/link";
import { notFound } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase";
import { getCurrentOrganizationId } from "@/lib/dogs-data";
import { updatePaymentRecord } from "../../actions";
import { SaveRecordButton } from "@/app/dashboard/record-buttons";

export default async function EditPaymentPage({ params }: { params: Promise<{ paymentId: string }> }) {
  const { paymentId } = await params;
  const admin = createSupabaseAdminClient();
  const organizationId = await getCurrentOrganizationId();
  if (!admin || !organizationId) notFound();

  const { data: payment } = await admin
    .from("buyer_payments")
    .select("id,amount,payment_date,payment_type,payment_method,buyer_id,buyers(full_name)")
    .eq("id", paymentId)
    .eq("organization_id", organizationId)
    .maybeSingle();
  if (!payment) notFound();

  return (
    <main className="min-h-screen bg-[#f6f3ec] p-8 text-[#132238] md:p-12">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#b38728]">Revenue Entry</p>
            <h1 className="mt-2 text-5xl font-black tracking-tight" style={{ fontFamily: "Georgia, serif" }}>Edit payment record</h1>
          </div>
          <Link href="/dashboard/payments" className="rounded-full border border-[#d8cfbf] bg-white px-6 py-3 font-semibold shadow-sm">Back to Payments</Link>
        </div>
        <form action={updatePaymentRecord} className="grid grid-cols-1 gap-5 rounded-[32px] border border-[#e2d9ca] bg-white p-8 shadow-[0_20px_60px_rgba(19,34,56,0.06)] md:grid-cols-2">
          <input type="hidden" name="payment_id" value={payment.id} />
          <Field label="Buyer Name" name="buyer_name" defaultValue={(payment as any).buyers?.full_name || ""} />
          <Field label="Payment Amount" name="payment_amount" defaultValue={String(payment.amount || "")} />
          <Field label="Payment Date" name="payment_date" type="date" defaultValue={payment.payment_date || ""} />
          <Field label="Payment Type" name="payment_type" defaultValue={payment.payment_type || ""} />
          <Field label="Method" name="method" defaultValue={payment.payment_method || ""} />
          <div className="flex justify-end md:col-span-2"><SaveRecordButton idleText="Save Payment Changes" pendingText="Saving Payment..." /></div>
        </form>
      </div>
    </main>
  );
}
function Field({ label, name, type = "text", defaultValue = "" }: { label: string; name: string; type?: string; defaultValue?: string }) { return <div><label className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8a7757]">{label}</label><input name={name} defaultValue={defaultValue} type={type} className="mt-2 w-full rounded-2xl border border-[#ddd2c0] bg-[#fcfbf8] px-4 py-3 outline-none" /></div>; }
