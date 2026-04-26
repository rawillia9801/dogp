import Link from "next/link";
import { notFound } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase";
import { getCurrentOrganizationId } from "@/lib/dogs-data";
import { updateDogRecord } from "../../actions";

export default async function EditDogPage({ params }: { params: Promise<{ dogId: string }> }) {
  const { dogId } = await params;
  const admin = createSupabaseAdminClient();
  const organizationId = await getCurrentOrganizationId();

  if (!admin || !organizationId) {
    notFound();
  }

  const { data: dog } = await admin
    .from("breeding_dogs")
    .select("id,call_name,registered_name,sex,role,status,date_of_birth,color,coat,registry,breeding_eligibility,proven_status,notes")
    .eq("id", dogId)
    .eq("organization_id", organizationId)
    .maybeSingle();

  if (!dog) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#f6f3ec] text-[#132238] p-8 md:p-12">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs tracking-[0.28em] uppercase text-[#b38728] font-semibold">Dog Registry Intake</p>
            <h1 className="text-5xl font-black tracking-tight mt-2" style={{ fontFamily: 'Georgia, serif' }}>Edit dog record</h1>
            <p className="text-[#526172] mt-3 text-lg">Update this dog's registry details, breeding status, and notes.</p>
          </div>
          <Link href="/dashboard/dogs" className="rounded-full border border-[#d8cfbf] bg-white px-6 py-3 font-semibold shadow-sm">Back to Dogs</Link>
        </div>

        <form action={updateDogRecord} className="grid grid-cols-1 md:grid-cols-2 gap-5 rounded-[32px] border border-[#e2d9ca] bg-white p-8 shadow-[0_20px_60px_rgba(19,34,56,0.06)]">
          <input type="hidden" name="dog_id" value={dog.id} />
          <Field label="Call Name" name="call_name" required defaultValue={dog.call_name || ""} />
          <Field label="Registered Name" name="registered_name" defaultValue={dog.registered_name || ""} />
          <SelectField label="Sex" name="sex" options={["female", "male", "unknown"]} defaultValue={dog.sex || "unknown"} />
          <SelectField label="Program Role" name="role" options={["dam", "sire", "keeper", "prospect", "puppy", "retired"]} defaultValue={dog.role || "dam"} />
          <SelectField label="Status" name="status" options={["active", "watch", "hold", "retired", "sold"]} defaultValue={dog.status || "active"} />
          <Field label="Date of Birth" name="date_of_birth" type="date" defaultValue={dog.date_of_birth || ""} />
          <Field label="Color" name="color" defaultValue={dog.color || ""} />
          <Field label="Coat" name="coat" defaultValue={dog.coat || ""} />
          <Field label="Registry" name="registry" defaultValue={dog.registry || ""} />
          <Field label="Breeding Eligibility" name="breeding_eligibility" defaultValue={dog.breeding_eligibility || "pending"} />
          <Field label="Proven Status" name="proven_status" defaultValue={dog.proven_status || ""} />
          <div className="md:col-span-2">
            <label className="text-xs uppercase tracking-[0.22em] text-[#8a7757] font-semibold">Notes</label>
            <textarea name="notes" rows={5} defaultValue={dog.notes || ""} className="mt-2 w-full rounded-2xl border border-[#ddd2c0] bg-[#fcfbf8] px-4 py-3 outline-none" />
          </div>
          <div className="md:col-span-2 flex justify-end">
            <button className="rounded-full bg-[#2f5d3f] text-white px-8 py-4 font-semibold shadow-lg">Save Changes</button>
          </div>
        </form>
      </div>
    </main>
  );
}

function Field({ label, name, type = 'text', required = false, defaultValue = '' }: { label: string; name: string; type?: string; required?: boolean; defaultValue?: string }) {
  return (
    <div>
      <label className="text-xs uppercase tracking-[0.22em] text-[#8a7757] font-semibold">{label}</label>
      <input required={required} defaultValue={defaultValue} type={type} name={name} className="mt-2 w-full rounded-2xl border border-[#ddd2c0] bg-[#fcfbf8] px-4 py-3 outline-none" />
    </div>
  );
}

function SelectField({ label, name, options, defaultValue }: { label: string; name: string; options: string[]; defaultValue: string }) {
  return (
    <div>
      <label className="text-xs uppercase tracking-[0.22em] text-[#8a7757] font-semibold">{label}</label>
      <select defaultValue={defaultValue} name={name} className="mt-2 w-full rounded-2xl border border-[#ddd2c0] bg-[#fcfbf8] px-4 py-3 outline-none">
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>
  );
}
