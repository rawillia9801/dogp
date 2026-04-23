import type { ReactNode } from "react";
import { BellRing, CalendarDays, Fuel, Hotel, MailCheck, MapPin, PlusCircle, Route, ShieldCheck, Ticket, Truck } from "lucide-react";
import type { AutomationWorkspaceData } from "@/lib/automation-data";
import type { BreederWorkspaceData } from "@/lib/breeder-data";
import type { BusinessWorkspaceData } from "@/lib/business-data";
import type { TransportationRequest } from "@/types";
import { BusinessSearch, GuidedPanel, MetricCell, compactDate, currency } from "@/components/admin/business-ui";
import { FieldRow, Panel, StatusPill, WorkspaceHeader, displayText, formatDate } from "@/components/admin/workspace-ui";

export function TransportationWorkspace({
  business,
  breeder,
  automation,
}: {
  business: BusinessWorkspaceData;
  breeder: BreederWorkspaceData;
  automation?: AutomationWorkspaceData;
}) {
  const selectedRequest = business.transportation[0] ?? null;
  const selectedBuyer = selectedRequest
    ? business.buyers.find((buyer) => buyer.id === selectedRequest.buyerId) ?? null
    : business.buyers[0] ?? null;
  const selectedPuppy = selectedRequest
    ? breeder.puppies.find((puppy) => puppy.id === selectedRequest.puppyId) ?? null
    : null;
  const fuel = estimateFuel(selectedRequest?.miles ?? 0);
  const tolls = estimateTolls(selectedRequest?.miles ?? 0);
  const hotel = estimateHotel(selectedRequest?.miles ?? 0);
  const transportationNoticeLogs = selectedRequest && automation
    ? automation.logs.filter((log) => log.relatedType === "transportation" && log.relatedId === selectedRequest.id)
    : [];
  const nextReminder = transportationNoticeLogs.find((log) => ["scheduled", "queued"].includes(log.deliveryStatus)) ?? null;

  return (
    <div>
      <WorkspaceHeader
        eyebrow="Delivery logistics"
        title="Transportation"
        description="Pickup, meet-point, and delivery coordination with mileage, fee control, buyer context, and travel cost planning."
        actions={
          <button className="inline-flex h-10 items-center gap-2 rounded-md border border-gold/35 bg-gold px-4 text-sm font-semibold text-[#20160c] shadow-gold">
            <PlusCircle className="size-4" />
            Add Request
          </button>
        }
      />

      <div className="mt-8 grid gap-5 2xl:grid-cols-[340px_1fr_320px]">
        <Panel className="p-4" title="Request List" eyebrow="Logistics queue">
          <BusinessSearch label="Find request" searchLabel="Search transportation requests" />
          <div className="mt-4 space-y-2">
            {business.transportation.length > 0 ? (
              business.transportation.map((request) => (
                <RequestRow key={request.id} request={request} selected={selectedRequest?.id === request.id} />
              ))
            ) : (
              <GuidedPanel
                icon={<Truck className="size-4" />}
                title="Create a delivery plan"
                body="Coordinate pickup, meet-point, or delivery details with buyer, puppy, location, mileage, and fees."
              />
            )}
          </div>
        </Panel>

        <main className="space-y-5">
          {selectedRequest ? (
            <>
              <Panel className="p-5" title="Selected Request" eyebrow="Delivery coordination">
                <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <h2 className="text-3xl font-semibold tracking-tight text-stone-50">{selectedRequest.type} / {selectedBuyer?.fullName ?? "Buyer file"}</h2>
                    <p className="mt-2 text-sm leading-6 text-stone-400">{displayText(selectedRequest.notes)}</p>
                  </div>
                  <StatusPill tone={selectedRequest.date ? "green" : "gold"}>{selectedRequest.date ? "scheduled" : "planning"}</StatusPill>
                </div>
                <div className="grid gap-3 md:grid-cols-4">
                  <MetricCell label="Type" value={selectedRequest.type} detail="Service mode" />
                  <MetricCell label="Miles" value={selectedRequest.miles ?? 0} detail="Route estimate" />
                  <MetricCell label="Fee" value={currency(selectedRequest.fee)} detail="Buyer charge" />
                  <MetricCell label="Date" value={compactDate(selectedRequest.date)} detail="Schedule control" />
                </div>
                <div className="mt-5 grid gap-x-8 gap-y-1 md:grid-cols-2">
                  <FieldRow label="Buyer" value={selectedBuyer?.fullName ?? "Buyer file ready"} />
                  <FieldRow label="Puppy" value={selectedPuppy?.callName ?? selectedPuppy?.puppyName ?? "Puppy link ready"} />
                  <FieldRow label="Location" value={selectedRequest.location ?? "Location ready to confirm"} />
                  <FieldRow label="Date" value={formatDate(selectedRequest.date)} />
                </div>
              </Panel>

              <Panel className="p-5" title="Route Operations" eyebrow="Pickup and delivery control">
                <div className="grid gap-3 md:grid-cols-3">
                  <RouteStep icon={<MapPin className="size-4" />} label="Pickup" value="Kennel departure" />
                  <RouteStep icon={<Route className="size-4" />} label="Meet point" value={selectedRequest.location ?? "Confirm location"} />
                  <RouteStep icon={<ShieldCheck className="size-4" />} label="Handoff" value="Buyer confirmation" />
                </div>
              </Panel>
            </>
          ) : (
            <GuidedPanel
              icon={<Truck className="size-4" />}
              title="Plan the next delivery"
              body="Create a request to manage type, date, buyer, puppy, location, mileage, fees, and travel cost controls."
            />
          )}
        </main>

        <aside className="space-y-5">
          <Panel className="p-5" title="Cost Breakdown" eyebrow="Travel estimate">
            <div className="space-y-3">
              <CostLine icon={<Fuel className="size-4" />} label="Fuel estimate" value={currency(fuel)} />
              <CostLine icon={<Ticket className="size-4" />} label="Tolls" value={currency(tolls)} />
              <CostLine icon={<Hotel className="size-4" />} label="Hotel" value={currency(hotel)} />
              <CostLine icon={<Truck className="size-4" />} label="Total cost" value={currency(fuel + tolls + hotel)} strong />
            </div>
          </Panel>

          <Panel className="p-5" title="Schedule Signals" eyebrow="Logistics readiness">
            <div className="space-y-3">
              <Signal icon={<CalendarDays className="size-4" />} label="Scheduled" value={selectedRequest?.date ? compactDate(selectedRequest.date) : "Date ready"} />
              <Signal icon={<MapPin className="size-4" />} label="Location" value={selectedRequest?.location ?? "Confirm"} />
              <Signal icon={<Route className="size-4" />} label="Distance" value={`${selectedRequest?.miles ?? 0} miles`} />
            </div>
          </Panel>

          <Panel className="p-5" title="Transport Notices" eyebrow="Communication">
            <div className="space-y-3">
              <Signal icon={<BellRing className="size-4" />} label="Automation" value={automation?.settings?.transportationNoticesEnabled === false ? "Paused" : "Active"} />
              <Signal icon={<CalendarDays className="size-4" />} label="Upcoming reminder" value={nextReminder?.scheduledAt ? compactDate(nextReminder.scheduledAt) : selectedRequest?.date ? compactDate(selectedRequest.date) : "Schedule ready"} />
              <Signal icon={<MailCheck className="size-4" />} label="Timeline" value={`${transportationNoticeLogs.length} notices`} />
            </div>
          </Panel>
        </aside>
      </div>
    </div>
  );
}

function RequestRow({ request, selected }: { request: TransportationRequest; selected: boolean }) {
  return (
    <div className={selected ? "rounded-md border border-gold/30 bg-gold/10 p-3" : "rounded-md border border-white/[0.06] bg-white/[0.025] p-3"}>
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-md border border-gold/20 bg-gold/10 text-gold">
          <Truck className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <p className="font-medium text-stone-100">{request.type}</p>
            <StatusPill tone={request.date ? "green" : "gold"}>{compactDate(request.date)}</StatusPill>
          </div>
          <p className="mt-1 truncate text-xs text-stone-500">{request.location ?? "Location ready to confirm"}</p>
        </div>
      </div>
    </div>
  );
}

function RouteStep({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-md border border-white/[0.06] bg-black/10 p-4">
      <span className="text-gold">{icon}</span>
      <p className="mt-3 font-medium text-stone-100">{label}</p>
      <p className="mt-1 text-sm text-stone-500">{value}</p>
    </div>
  );
}

function CostLine({ icon, label, value, strong = false }: { icon: ReactNode; label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-white/[0.06] py-3 last:border-0">
      <span className="flex items-center gap-2 text-sm text-stone-300">
        <span className="text-gold">{icon}</span>
        {label}
      </span>
      <span className={strong ? "font-semibold text-gold-soft" : "text-sm font-semibold text-stone-50"}>{value}</span>
    </div>
  );
}

function Signal({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md border border-white/[0.06] bg-white/[0.025] px-3 py-2.5">
      <span className="flex items-center gap-2 text-sm text-stone-300">
        <span className="text-gold">{icon}</span>
        {label}
      </span>
      <span className="text-sm font-semibold text-stone-50">{value}</span>
    </div>
  );
}

function estimateFuel(miles: number) {
  return miles * 0.22;
}

function estimateTolls(miles: number) {
  return miles > 120 ? 18 : miles > 40 ? 8 : 0;
}

function estimateHotel(miles: number) {
  return miles > 420 ? 165 : 0;
}
