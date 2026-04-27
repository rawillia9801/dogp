import Link from "next/link";
import { MapPin, Plus, Route, Truck } from "lucide-react";
import { getDashboardData } from "@/lib/dashboard-data";
import { getBusinessWorkspaceData } from "@/lib/business-data";
import { requireOrganization } from "@/lib/auth";

export default async function TransportationPage() {
  const organization = await requireOrganization();
  const data = await getDashboardData();
  const business = await getBusinessWorkspaceData(organization.id);
  const requests = business.transportation;

  return (
    <main className="min-h-screen bg-[#f6f3ec] p-6 text-[#132238] md:p-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#b38728]">Delivery Desk</p>
            <h1 className="mt-2 text-5xl font-black tracking-tight" style={{ fontFamily: "Georgia, serif" }}>Transportation Workspace</h1>
            <p className="mt-3 text-lg text-[#526172]">{data.organizationName} • pickup, delivery, flight nanny, mileage, fees, and buyer coordination.</p>
          </div>
          <div className="flex gap-3">
            <Link href="/dashboard" className="rounded-full border border-[#d8cfbf] bg-white px-6 py-3 font-semibold shadow-sm">Back Dashboard</Link>
          </div>
        </div>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Stat label="Requests" value={requests.length} icon={Truck} />
          <Stat label="Scheduled" value={requests.filter((item) => item.date).length} icon={Route} />
          <Stat label="Locations" value={requests.filter((item) => item.location).length} icon={MapPin} />
        </section>

        <section className="rounded-[30px] border border-[#e2d9ca] bg-white p-6 shadow-[0_20px_60px_rgba(19,34,56,0.05)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8a7757]">Live transport requests</p>
              <p className="mt-2 text-sm text-[#6b7785]">Read from buyer_transportation_requests through the schema-aligned business workspace data layer.</p>
            </div>
            <Plus className="h-5 w-5 text-[#2f5d3f]" />
          </div>
          {requests.length === 0 ? (
            <div className="mt-6 rounded-[24px] border border-[#eee5d8] bg-[#fcfbf8] p-6 text-center">
              <Truck className="mx-auto h-10 w-10 text-[#2f5d3f]" />
              <p className="mt-4 font-black">No transportation requests yet</p>
              <p className="mt-2 text-sm text-[#6b7785]">Pickup and delivery records will appear here after buyer requests or breeder entries are created.</p>
            </div>
          ) : (
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {requests.map((request) => (
                <div key={request.id} className="rounded-[24px] border border-[#eee5d8] bg-[#fcfbf8] p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xl font-black capitalize">{request.type}</p>
                      <p className="mt-1 text-sm text-[#6b7785]">{request.date || "No date set"}</p>
                    </div>
                    <span className="rounded-full border border-[#e2d9ca] bg-white px-3 py-1 text-[11px] font-bold">{request.location || "Location TBD"}</span>
                  </div>
                  <p className="mt-4 text-sm text-[#5d6c7d]">{request.notes || "No transportation notes yet."}</p>
                  <div className="mt-4 flex gap-2 text-xs font-bold text-[#526172]"><span>{request.miles ?? 0} miles</span><span>•</span><span>${request.fee ?? 0} fee</span></div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function Stat({ label, value, icon: Icon }: { label: string; value: number | string; icon: typeof Truck }) {
  return <div className="rounded-[24px] border border-[#e2d9ca] bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8a7757]">{label}</p><Icon className="h-5 w-5 text-[#2f5d3f]" /></div><p className="mt-3 text-4xl font-black" style={{ fontFamily: "Georgia, serif" }}>{value}</p></div>;
}
