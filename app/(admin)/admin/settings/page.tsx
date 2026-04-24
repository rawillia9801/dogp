import type { Metadata } from "next";
import { requireAdminOrganization, updateOrganizationAction } from "@/lib/auth";
import { SubmitButton } from "@/components/ui/submit-button";
import { Surface } from "@/components/ui/surface";

export const metadata: Metadata = {
  title: "Settings",
};

export default async function SettingsPage() {
  const organization = await requireAdminOrganization();

  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-gold">Settings</p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight text-stone-50">
        Breeder settings
      </h1>
      <Surface className="mt-8 p-6">
        <form action={updateOrganizationAction} className="grid gap-5">
          <label>
            <span className="text-xs uppercase tracking-[0.18em] text-stone-500">Business name</span>
            <input name="name" defaultValue={organization.name} required className="form-input mt-2" />
          </label>
          <label>
            <span className="text-xs uppercase tracking-[0.18em] text-stone-500">Legal name</span>
            <input name="legalName" defaultValue={organization.legalName ?? ""} className="form-input mt-2" />
          </label>
          <label>
            <span className="text-xs uppercase tracking-[0.18em] text-stone-500">Email</span>
            <input name="email" type="email" defaultValue={organization.email ?? ""} className="form-input mt-2" />
          </label>
          <label>
            <span className="text-xs uppercase tracking-[0.18em] text-stone-500">Phone</span>
            <input name="phone" defaultValue={organization.phone ?? ""} className="form-input mt-2" />
          </label>
          <label>
            <span className="text-xs uppercase tracking-[0.18em] text-stone-500">Website</span>
            <input name="website" defaultValue={organization.website ?? ""} className="form-input mt-2" />
          </label>
          <label>
            <span className="text-xs uppercase tracking-[0.18em] text-stone-500">Timezone</span>
            <input name="timezone" defaultValue={organization.timezone ?? ""} className="form-input mt-2" />
          </label>
          <SubmitButton className="max-w-xs">Save Settings</SubmitButton>
        </form>
      </Surface>
    </div>
  );
}
