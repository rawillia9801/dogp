import { createSupabaseServerClient } from "@/lib/supabase";
import type {
  Buyer,
  BuyerApplication,
  BuyerDocument,
  BuyerPayment,
  PaymentPlan,
  Puppy,
  TransportationRequest,
} from "@/types";

type BuyerRow = { id: string; organization_id: string; full_name: string | null; email: string | null; phone: string | null; status: string; notes: string | null; address_line1: string | null; address_line2: string | null; city: string | null; state: string | null; postal_code: string | null; created_at: string; updated_at: string; };
type ApplicationRow = { id: string; organization_id: string; buyer_id: string | null; status: string; answers?: Record<string, unknown> | null; application_data?: Record<string, unknown> | null; created_at: string; updated_at: string; };
type PaymentRow = { id: string; organization_id: string; buyer_id: string; amount: number; payment_date: string; payment_type: string | null; payment_method: string | null; status: string; note: string | null; created_at: string; updated_at: string; };
type PlanRow = { id: string; organization_id: string; buyer_id: string; payment_account_id: string; apr_percent: number | null; term_months: number | null; monthly_amount: number | null; next_due_date: string | null; created_at: string; updated_at: string; buyer_payment_accounts?: { sale_price: number | null; deposit_amount: number | null; balance: number | null } | null; };
type DocumentRow = { id: string; organization_id: string; buyer_id: string | null; title: string | null; category: string | null; file_url: string | null; status: string; signed_at: string | null; visible_to_user?: boolean | null; visible_to_buyer?: boolean | null; created_at: string; updated_at: string; };
type TransportationRow = { id: string; organization_id: string; buyer_id: string | null; puppy_id: string | null; type?: string | null; request_type?: string | null; date?: string | null; delivery_date?: string | null; location?: string | null; location_text?: string | null; miles: number | null; fee: number | null; notes: string | null; created_at: string; updated_at: string; };

export type BusinessWorkspaceData = { buyers: Buyer[]; applications: BuyerApplication[]; payments: BuyerPayment[]; paymentPlans: PaymentPlan[]; documents: BuyerDocument[]; transportation: TransportationRequest[]; };
const emptyBusinessData: BusinessWorkspaceData = { buyers: [], applications: [], payments: [], paymentPlans: [], documents: [], transportation: [] };

export async function getBusinessWorkspaceData(organizationId: string): Promise<BusinessWorkspaceData> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return emptyBusinessData;

  const [buyersResult, applicationsResult, paymentsResult, plansResult, documentsResult, transportationResult] = await Promise.all([
    supabase.from("buyers").select("*").eq("organization_id", organizationId).order("updated_at", { ascending: false }).returns<BuyerRow[]>(),
    supabase.from("buyer_applications").select("*").eq("organization_id", organizationId).order("created_at", { ascending: false }).returns<ApplicationRow[]>(),
    supabase.from("buyer_payments").select("*").eq("organization_id", organizationId).order("payment_date", { ascending: false }).returns<PaymentRow[]>(),
    supabase.from("buyer_payment_plans").select("*,buyer_payment_accounts(sale_price,deposit_amount,balance)").eq("organization_id", organizationId).order("next_due_date", { ascending: true, nullsFirst: false }).returns<PlanRow[]>(),
    supabase.from("buyer_documents").select("*").eq("organization_id", organizationId).order("updated_at", { ascending: false }).returns<DocumentRow[]>(),
    supabase.from("buyer_transportation_requests").select("*").eq("organization_id", organizationId).order("delivery_date", { ascending: true, nullsFirst: false }).returns<TransportationRow[]>(),
  ]);

  return { buyers: (buyersResult.data ?? []).map(mapBuyer), applications: (applicationsResult.data ?? []).map(mapApplication), payments: (paymentsResult.data ?? []).map(mapPayment), paymentPlans: (plansResult.data ?? []).map(mapPlan), documents: (documentsResult.data ?? []).map(mapDocument), transportation: (transportationResult.data ?? []).map(mapTransportation) };
}

export function puppiesForBuyer(puppies: Puppy[], buyerId: string | null | undefined) { return buyerId ? puppies.filter((puppy) => puppy.buyerId === buyerId) : []; }
function mapBuyer(row: BuyerRow): Buyer { return { id: row.id, organizationId: row.organization_id, fullName: row.full_name ?? "Unnamed Buyer", email: row.email ?? "", phone: row.phone, status: row.status, notes: row.notes, addressLine1: row.address_line1, addressLine2: row.address_line2, city: row.city, state: row.state, postalCode: row.postal_code, country: null, createdAt: row.created_at, updatedAt: row.updated_at }; }
function mapApplication(row: ApplicationRow): BuyerApplication { return { id: row.id, organizationId: row.organization_id, buyerId: row.buyer_id, status: row.status, answers: row.answers ?? row.application_data ?? {}, createdAt: row.created_at, updatedAt: row.updated_at }; }
function mapPayment(row: PaymentRow): BuyerPayment { return { id: row.id, organizationId: row.organization_id, buyerId: row.buyer_id, amount: row.amount, paymentDate: row.payment_date, type: row.payment_type ?? "payment", method: row.payment_method, status: row.status, createdAt: row.created_at, updatedAt: row.updated_at }; }
function mapPlan(row: PlanRow): PaymentPlan { const account = row.buyer_payment_accounts; const totalPrice = Number(account?.sale_price ?? 0); const deposit = Number(account?.deposit_amount ?? 0); return { id: row.id, organizationId: row.organization_id, buyerId: row.buyer_id, totalPrice, deposit, monthlyAmount: Number(row.monthly_amount ?? 0), months: Number(row.term_months ?? 1), apr: Number(row.apr_percent ?? 0), nextDueDate: row.next_due_date, createdAt: row.created_at, updatedAt: row.updated_at }; }
function mapDocument(row: DocumentRow): BuyerDocument { return { id: row.id, organizationId: row.organization_id, buyerId: row.buyer_id, title: row.title ?? "Document", category: row.category ?? "documents", fileUrl: row.file_url, status: row.status, signedAt: row.signed_at, visibleToUser: Boolean(row.visible_to_buyer ?? row.visible_to_user), createdAt: row.created_at, updatedAt: row.updated_at }; }
function mapTransportation(row: TransportationRow): TransportationRequest { return { id: row.id, organizationId: row.organization_id, buyerId: row.buyer_id, puppyId: row.puppy_id, type: row.request_type ?? row.type ?? "pickup", date: row.delivery_date ?? row.date ?? null, location: row.location_text ?? row.location ?? null, miles: row.miles, fee: row.fee, notes: row.notes, createdAt: row.created_at, updatedAt: row.updated_at }; }
