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

type BuyerRow = {
  id: string;
  organization_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  status: string;
  notes: string | null;
  address_line_1: string | null;
  address_line_2: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
  created_at: string;
  updated_at: string;
};

type ApplicationRow = {
  id: string;
  organization_id: string;
  buyer_id: string | null;
  status: string;
  answers: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
};

type PaymentRow = {
  id: string;
  organization_id: string;
  buyer_id: string;
  amount: number;
  payment_date: string | null;
  type: string;
  method: string | null;
  status: string;
  created_at: string;
  updated_at: string;
};

type PlanRow = {
  id: string;
  organization_id: string;
  buyer_id: string;
  total_price: number;
  deposit: number;
  monthly_amount: number;
  months: number;
  apr: number;
  next_due_date: string | null;
  created_at: string;
  updated_at: string;
};

type DocumentRow = {
  id: string;
  organization_id: string;
  buyer_id: string | null;
  title: string;
  category: string;
  file_url: string | null;
  status: string;
  signed_at: string | null;
  visible_to_user: boolean;
  created_at: string;
  updated_at: string;
};

type TransportationRow = {
  id: string;
  organization_id: string;
  buyer_id: string | null;
  puppy_id: string | null;
  type: string;
  date: string | null;
  location: string | null;
  miles: number | null;
  fee: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type BusinessWorkspaceData = {
  buyers: Buyer[];
  applications: BuyerApplication[];
  payments: BuyerPayment[];
  paymentPlans: PaymentPlan[];
  documents: BuyerDocument[];
  transportation: TransportationRequest[];
};

const emptyBusinessData: BusinessWorkspaceData = {
  buyers: [],
  applications: [],
  payments: [],
  paymentPlans: [],
  documents: [],
  transportation: [],
};

export async function getBusinessWorkspaceData(
  organizationId: string,
): Promise<BusinessWorkspaceData> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return emptyBusinessData;
  }

  const [
    buyersResult,
    applicationsResult,
    paymentsResult,
    plansResult,
    documentsResult,
    transportationResult,
  ] = await Promise.all([
    supabase
      .from("buyers")
      .select("*")
      .eq("organization_id", organizationId)
      .order("updated_at", { ascending: false })
      .returns<BuyerRow[]>(),
    supabase
      .from("applications")
      .select("*")
      .eq("organization_id", organizationId)
      .order("created_at", { ascending: false })
      .returns<ApplicationRow[]>(),
    supabase
      .from("payments")
      .select("*")
      .eq("organization_id", organizationId)
      .order("payment_date", { ascending: false, nullsFirst: false })
      .returns<PaymentRow[]>(),
    supabase
      .from("payment_plans")
      .select("*")
      .eq("organization_id", organizationId)
      .order("next_due_date", { ascending: true, nullsFirst: false })
      .returns<PlanRow[]>(),
    supabase
      .from("documents")
      .select("*")
      .eq("organization_id", organizationId)
      .order("updated_at", { ascending: false })
      .returns<DocumentRow[]>(),
    supabase
      .from("transportation")
      .select("*")
      .eq("organization_id", organizationId)
      .order("date", { ascending: true, nullsFirst: false })
      .returns<TransportationRow[]>(),
  ]);

  return {
    buyers: (buyersResult.data ?? []).map(mapBuyer),
    applications: (applicationsResult.data ?? []).map(mapApplication),
    payments: (paymentsResult.data ?? []).map(mapPayment),
    paymentPlans: (plansResult.data ?? []).map(mapPlan),
    documents: (documentsResult.data ?? []).map(mapDocument),
    transportation: (transportationResult.data ?? []).map(mapTransportation),
  };
}

export function puppiesForBuyer(puppies: Puppy[], buyerId: string | null | undefined) {
  return buyerId ? puppies.filter((puppy) => puppy.buyerId === buyerId) : [];
}

function mapBuyer(row: BuyerRow): Buyer {
  return {
    id: row.id,
    organizationId: row.organization_id,
    fullName: row.full_name,
    email: row.email,
    phone: row.phone,
    status: row.status,
    notes: row.notes,
    addressLine1: row.address_line_1,
    addressLine2: row.address_line_2,
    city: row.city,
    state: row.state,
    postalCode: row.postal_code,
    country: row.country,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapApplication(row: ApplicationRow): BuyerApplication {
  return {
    id: row.id,
    organizationId: row.organization_id,
    buyerId: row.buyer_id,
    status: row.status,
    answers: row.answers ?? {},
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapPayment(row: PaymentRow): BuyerPayment {
  return {
    id: row.id,
    organizationId: row.organization_id,
    buyerId: row.buyer_id,
    amount: row.amount,
    paymentDate: row.payment_date,
    type: row.type,
    method: row.method,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapPlan(row: PlanRow): PaymentPlan {
  return {
    id: row.id,
    organizationId: row.organization_id,
    buyerId: row.buyer_id,
    totalPrice: row.total_price,
    deposit: row.deposit,
    monthlyAmount: row.monthly_amount,
    months: row.months,
    apr: row.apr,
    nextDueDate: row.next_due_date,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapDocument(row: DocumentRow): BuyerDocument {
  return {
    id: row.id,
    organizationId: row.organization_id,
    buyerId: row.buyer_id,
    title: row.title,
    category: row.category,
    fileUrl: row.file_url,
    status: row.status,
    signedAt: row.signed_at,
    visibleToUser: row.visible_to_user,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapTransportation(row: TransportationRow): TransportationRequest {
  return {
    id: row.id,
    organizationId: row.organization_id,
    buyerId: row.buyer_id,
    puppyId: row.puppy_id,
    type: row.type,
    date: row.date,
    location: row.location,
    miles: row.miles,
    fee: row.fee,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
