import { createSupabaseAdminClient, createSupabaseServerClient } from "@/lib/supabase";

export type DashboardData = {
  organizationName: string;
  counts: {
    dogs: number;
    breedings: number;
    pregnancies: number;
    litters: number;
    puppies: number;
    availablePuppies: number;
    reservedPuppies: number;
    buyers: number;
    applications: number;
    documentsPending: number;
    transportation: number;
    tasksOpen: number;
    alertsOpen: number;
    eventsUpcoming: number;
    payments: number;
  };
  money: {
    openBalances: number;
    dueSoon: number;
    overdue: number;
  };
  activation: {
    hasDog: boolean;
    hasBreeding: boolean;
    hasPuppy: boolean;
    hasBuyer: boolean;
    hasPayment: boolean;
  };
  tasks: Array<{ title: string; detail: string; tag: string; priority: string }>;
  alerts: Array<{ title: string; detail: string; severity: string }>;
  events: Array<{ title: string; date: string; tag: string }>;
};

const EMPTY_DASHBOARD_DATA: DashboardData = {
  organizationName: "Your breeding program",
  counts: { dogs: 0, breedings: 0, pregnancies: 0, litters: 0, puppies: 0, availablePuppies: 0, reservedPuppies: 0, buyers: 0, applications: 0, documentsPending: 0, transportation: 0, tasksOpen: 0, alertsOpen: 0, eventsUpcoming: 0, payments: 0 },
  money: { openBalances: 0, dueSoon: 0, overdue: 0 },
  activation: { hasDog: false, hasBreeding: false, hasPuppy: false, hasBuyer: false, hasPayment: false },
  tasks: [],
  alerts: [],
  events: [],
};

type AdminClient = NonNullable<ReturnType<typeof createSupabaseAdminClient>>;

export async function getDashboardData(): Promise<DashboardData> {
  const server = await createSupabaseServerClient();
  const admin = createSupabaseAdminClient();
  if (!server || !admin) return EMPTY_DASHBOARD_DATA;

  const { data: userData } = await server.auth.getUser();
  const user = userData.user;
  if (!user) return EMPTY_DASHBOARD_DATA;

  const organization = await findOrganizationForUser(admin, user.id, user.email ?? null);
  if (!organization) return EMPTY_DASHBOARD_DATA;

  const organizationId = organization.id;
  const today = new Date();
  const sevenDaysFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const [
    branding,
    dogs,
    breedings,
    pregnancies,
    litters,
    puppies,
    availablePuppies,
    reservedPuppies,
    buyers,
    buyerApplications,
    applications,
    buyerDocumentsPending,
    contractsPending,
    documentsPending,
    transportation,
    transportationRequests,
    breederTasksOpen,
    breedingTasksOpen,
    alertsOpen,
    breederEventsUpcoming,
    breedingEventsUpcoming,
    paymentCount,
    paymentAccounts,
    paymentPlansDueSoon,
    breederTaskRows,
    breedingTaskRows,
    alertRows,
    breederEventRows,
    breedingEventRows,
  ] = await Promise.all([
    admin.from("breeder_branding").select("business_name").eq("organization_id", organizationId).maybeSingle(),
    countRows(admin, "breeding_dogs", organizationId),
    countRows(admin, "breeding_pairings", organizationId),
    countRows(admin, "breeding_pregnancies", organizationId, "status", ["suspected", "confirmed", "active"]),
    countRows(admin, "litters", organizationId),
    countRows(admin, "puppies", organizationId),
    countRows(admin, "puppies", organizationId, "status", ["available"]),
    countRows(admin, "puppies", organizationId, "status", ["reserved", "pending", "sold"]),
    countRows(admin, "buyers", organizationId),
    countRows(admin, "buyer_applications", organizationId, "status", ["submitted", "new", "pending"]),
    countRows(admin, "applications", organizationId, "status", ["submitted", "new", "pending"]),
    countRows(admin, "buyer_documents", organizationId, "status", ["draft", "uploaded", "pending", "sent"]),
    countRows(admin, "contracts", organizationId, "status", ["draft", "sent", "pending"]),
    countRows(admin, "documents", organizationId, "status", ["draft", "sent", "pending"]),
    countRows(admin, "transportation", organizationId),
    countRows(admin, "buyer_transportation_requests", organizationId, "status", ["requested", "scheduled", "pending"]),
    countRows(admin, "breeder_tasks", organizationId, "status", ["open", "pending"]),
    countRows(admin, "breeding_tasks", organizationId, "status", ["open", "pending"]),
    countRows(admin, "breeding_alerts", organizationId, "status", ["open"]),
    countDateRows(admin, "breeder_events", organizationId, "event_date", today, sevenDaysFromNow),
    countDateRows(admin, "breeding_calendar_events", organizationId, "event_date", today, sevenDaysFromNow),
    countRows(admin, "buyer_payments", organizationId),
    admin.from("buyer_payment_accounts").select("balance").eq("organization_id", organizationId),
    admin.from("buyer_payment_plans").select("next_due_date,status").eq("organization_id", organizationId).in("status", ["active", "pending"]),
    admin.from("breeder_tasks").select("title,priority,status,due_date,related_type,notes").eq("organization_id", organizationId).in("status", ["open", "pending"]).order("due_date", { ascending: true, nullsFirst: false }).limit(4),
    admin.from("breeding_tasks").select("title,priority,status,due_date,task_type,description").eq("organization_id", organizationId).in("status", ["open", "pending"]).order("due_date", { ascending: true, nullsFirst: false }).limit(4),
    admin.from("breeding_alerts").select("title,detail,severity").eq("organization_id", organizationId).eq("status", "open").order("created_at", { ascending: false }).limit(3),
    admin.from("breeder_events").select("title,event_type,event_date,status").eq("organization_id", organizationId).gte("event_date", isoDate(today)).order("event_date", { ascending: true }).limit(3),
    admin.from("breeding_calendar_events").select("title,event_type,event_date,status").eq("organization_id", organizationId).gte("event_date", isoDate(today)).order("event_date", { ascending: true }).limit(3),
  ]);

  const openBalances = sumBalances(paymentAccounts.data);
  const dueSoon = countDueSoon(paymentPlansDueSoon.data, today, sevenDaysFromNow);
  const overdue = countOverdue(paymentPlansDueSoon.data, today);
  const applicationCount = buyerApplications + applications;
  const pendingDocuments = buyerDocumentsPending + contractsPending + documentsPending;
  const transportCount = transportation + transportationRequests;
  const tasksOpen = breederTasksOpen + breedingTasksOpen;
  const eventsUpcoming = breederEventsUpcoming + breedingEventsUpcoming;
  const businessName = branding.data?.business_name?.trim() || organization.name;

  return {
    organizationName: businessName,
    counts: { dogs, breedings, pregnancies, litters, puppies, availablePuppies, reservedPuppies, buyers, applications: applicationCount, documentsPending: pendingDocuments, transportation: transportCount, tasksOpen, alertsOpen, eventsUpcoming, payments: paymentCount },
    money: { openBalances, dueSoon, overdue },
    activation: { hasDog: dogs > 0, hasBreeding: breedings > 0 || pregnancies > 0, hasPuppy: puppies > 0, hasBuyer: buyers > 0, hasPayment: paymentCount > 0 || openBalances > 0 || dueSoon > 0 || overdue > 0 },
    tasks: [...mapBreederTasks(breederTaskRows.data), ...mapBreedingTasks(breedingTaskRows.data)].slice(0, 4),
    alerts: mapAlerts(alertRows.data),
    events: [...mapEvents(breederEventRows.data), ...mapEvents(breedingEventRows.data)].slice(0, 3),
  };
}

async function findOrganizationForUser(admin: AdminClient, userId: string, email: string | null) {
  const { data: membership } = await admin.from("organization_users").select("organization_id, organizations(id,name)").eq("auth_user_id", userId).eq("is_active", true).limit(1).maybeSingle();
  const memberOrganization = Array.isArray(membership?.organizations) ? membership?.organizations[0] : membership?.organizations;
  if (memberOrganization) return memberOrganization as { id: string; name: string };
  if (!email) return null;
  const { data: organization } = await admin.from("organizations").select("id,name").eq("email", email).order("created_at", { ascending: false }).limit(1).maybeSingle();
  return organization;
}

async function countRows(admin: AdminClient, table: string, organizationId: string, filterColumn?: string, filterValues?: string[]) {
  let query = admin.from(table).select("id", { count: "exact", head: true }).eq("organization_id", organizationId);
  if (filterColumn && filterValues?.length) query = query.in(filterColumn, filterValues);
  const { count, error } = await query;
  if (error) console.error(`Dashboard count failed for ${table}`, error.message);
  return count ?? 0;
}

async function countDateRows(admin: AdminClient, table: string, organizationId: string, dateColumn: string, start: Date, end: Date) {
  const { count, error } = await admin.from(table).select("id", { count: "exact", head: true }).eq("organization_id", organizationId).gte(dateColumn, isoDate(start)).lte(dateColumn, isoDate(end));
  if (error) console.error(`Dashboard date count failed for ${table}`, error.message);
  return count ?? 0;
}

function sumBalances(rows: Array<{ balance: number | string | null }> | null) { return (rows ?? []).reduce((total, row) => total + Number(row.balance ?? 0), 0); }
function countDueSoon(rows: Array<{ next_due_date: string | null }> | null, start: Date, end: Date) { return (rows ?? []).filter((row) => row.next_due_date && new Date(row.next_due_date) >= start && new Date(row.next_due_date) <= end).length; }
function countOverdue(rows: Array<{ next_due_date: string | null }> | null, today: Date) { return (rows ?? []).filter((row) => row.next_due_date && new Date(row.next_due_date) < today).length; }
function mapBreederTasks(rows: Array<{ title: string | null; priority: string | null; related_type: string | null; notes: string | null }> | null) { return (rows ?? []).map((row) => ({ title: row.title ?? "Open task", detail: row.notes ?? "Review this task and mark it complete when finished.", tag: row.related_type ?? "Task", priority: row.priority ?? "normal" })); }
function mapBreedingTasks(rows: Array<{ title: string | null; priority: string | null; task_type: string | null; description: string | null }> | null) { return (rows ?? []).map((row) => ({ title: row.title ?? "Breeding task", detail: row.description ?? "Review this breeding program task.", tag: row.task_type ?? "Breeding", priority: row.priority ?? "normal" })); }
function mapAlerts(rows: Array<{ title: string | null; detail: string | null; severity: string | null }> | null) { return (rows ?? []).map((row) => ({ title: row.title ?? "Open alert", detail: row.detail ?? "Review this alert.", severity: row.severity ?? "info" })); }
function mapEvents(rows: Array<{ title: string | null; event_type: string | null; event_date: string | null }> | null) { return (rows ?? []).map((row) => ({ title: row.title ?? "Upcoming event", date: row.event_date ?? "Upcoming", tag: row.event_type ?? "Calendar" })); }
function isoDate(date: Date) { return date.toISOString().slice(0, 10); }
