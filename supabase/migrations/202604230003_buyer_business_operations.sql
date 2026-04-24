-- =========================================================
-- MYDOGPORTAL.SITE
-- BUYER AND BUSINESS OPERATIONS
-- =========================================================

create table if not exists public.buyers (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  full_name text not null,
  email text not null,
  phone text,
  status text not null default 'lead',
  notes text,
  address_line_1 text,
  address_line_2 text,
  city text,
  state text,
  postal_code text,
  country text not null default 'United States',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_buyers_org on public.buyers(organization_id);
create index if not exists idx_buyers_org_status on public.buyers(organization_id, status);

drop trigger if exists trg_buyers_updated_at on public.buyers;
create trigger trg_buyers_updated_at
before update on public.buyers
for each row execute function public.set_updated_at();

alter table public.puppies
add column if not exists buyer_id uuid references public.buyers(id) on delete set null;

create index if not exists idx_puppies_buyer on public.puppies(buyer_id);

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  buyer_id uuid references public.buyers(id) on delete set null,
  status text not null default 'submitted',
  answers jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_applications_org on public.applications(organization_id);
create index if not exists idx_applications_buyer on public.applications(buyer_id);
create index if not exists idx_applications_status on public.applications(organization_id, status);

drop trigger if exists trg_applications_updated_at on public.applications;
create trigger trg_applications_updated_at
before update on public.applications
for each row execute function public.set_updated_at();

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  buyer_id uuid not null references public.buyers(id) on delete cascade,
  amount numeric(12,2) not null,
  payment_date date,
  type text not null default 'deposit',
  method text,
  status text not null default 'recorded',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_payments_org on public.payments(organization_id);
create index if not exists idx_payments_buyer on public.payments(buyer_id);
create index if not exists idx_payments_date on public.payments(organization_id, payment_date);

drop trigger if exists trg_payments_updated_at on public.payments;
create trigger trg_payments_updated_at
before update on public.payments
for each row execute function public.set_updated_at();

create table if not exists public.payment_plans (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  buyer_id uuid not null references public.buyers(id) on delete cascade,
  total_price numeric(12,2) not null default 0,
  deposit numeric(12,2) not null default 0,
  monthly_amount numeric(12,2) not null default 0,
  months integer not null default 1,
  apr numeric(5,2) not null default 0,
  next_due_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_payment_plans_org on public.payment_plans(organization_id);
create index if not exists idx_payment_plans_buyer on public.payment_plans(buyer_id);

drop trigger if exists trg_payment_plans_updated_at on public.payment_plans;
create trigger trg_payment_plans_updated_at
before update on public.payment_plans
for each row execute function public.set_updated_at();

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  buyer_id uuid references public.buyers(id) on delete set null,
  title text not null,
  category text not null default 'contracts',
  file_url text,
  status text not null default 'draft',
  signed_at timestamptz,
  visible_to_user boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_documents_org on public.documents(organization_id);
create index if not exists idx_documents_buyer on public.documents(buyer_id);
create index if not exists idx_documents_category on public.documents(organization_id, category);

drop trigger if exists trg_documents_updated_at on public.documents;
create trigger trg_documents_updated_at
before update on public.documents
for each row execute function public.set_updated_at();

create table if not exists public.transportation (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  buyer_id uuid references public.buyers(id) on delete set null,
  puppy_id uuid references public.puppies(id) on delete set null,
  type text not null default 'pickup',
  date date,
  location text,
  miles numeric(10,2),
  fee numeric(12,2),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_transportation_org on public.transportation(organization_id);
create index if not exists idx_transportation_buyer on public.transportation(buyer_id);
create index if not exists idx_transportation_puppy on public.transportation(puppy_id);
create index if not exists idx_transportation_date on public.transportation(organization_id, date);

drop trigger if exists trg_transportation_updated_at on public.transportation;
create trigger trg_transportation_updated_at
before update on public.transportation
for each row execute function public.set_updated_at();

alter table public.buyers enable row level security;
alter table public.applications enable row level security;
alter table public.payments enable row level security;
alter table public.payment_plans enable row level security;
alter table public.documents enable row level security;
alter table public.transportation enable row level security;

drop policy if exists "org users manage buyers" on public.buyers;
create policy "org users manage buyers"
on public.buyers
for all
using (public.user_has_org_access(organization_id))
with check (public.user_has_org_access(organization_id));

drop policy if exists "org users manage applications" on public.applications;
create policy "org users manage applications"
on public.applications
for all
using (public.user_has_org_access(organization_id))
with check (public.user_has_org_access(organization_id));

drop policy if exists "org users manage payments" on public.payments;
create policy "org users manage payments"
on public.payments
for all
using (public.user_has_org_access(organization_id))
with check (public.user_has_org_access(organization_id));

drop policy if exists "org users manage payment plans" on public.payment_plans;
create policy "org users manage payment plans"
on public.payment_plans
for all
using (public.user_has_org_access(organization_id))
with check (public.user_has_org_access(organization_id));

drop policy if exists "org users manage documents" on public.documents;
create policy "org users manage documents"
on public.documents
for all
using (public.user_has_org_access(organization_id))
with check (public.user_has_org_access(organization_id));

drop policy if exists "org users manage transportation" on public.transportation;
create policy "org users manage transportation"
on public.transportation
for all
using (public.user_has_org_access(organization_id))
with check (public.user_has_org_access(organization_id));
