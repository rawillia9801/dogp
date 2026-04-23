create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text,
  address text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_organizations_updated_at on public.organizations;
create trigger trg_organizations_updated_at
before update on public.organizations
for each row execute function public.set_updated_at();

create table public.organization_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  role text not null check (role in ('owner', 'staff')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, organization_id)
);

create index idx_organization_users_user_id on public.organization_users(user_id);
create index idx_organization_users_organization_id on public.organization_users(organization_id);

drop trigger if exists trg_organization_users_updated_at on public.organization_users;
create trigger trg_organization_users_updated_at
before update on public.organization_users
for each row execute function public.set_updated_at();

create table public.plans (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  price integer not null,
  limits jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null unique references public.organizations(id) on delete cascade,
  plan_id uuid references public.plans(id) on delete set null,
  status text not null default 'trialing',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_subscriptions_updated_at on public.subscriptions;
create trigger trg_subscriptions_updated_at
before update on public.subscriptions
for each row execute function public.set_updated_at();

create or replace function public.user_has_org_access(target_org uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.organization_users ou
    where ou.organization_id = target_org
      and ou.user_id = auth.uid()
  );
$$;

alter table public.organizations enable row level security;
alter table public.organization_users enable row level security;
alter table public.plans enable row level security;
alter table public.subscriptions enable row level security;

create policy "authenticated users can view their organizations"
on public.organizations
for select
using (public.user_has_org_access(id));

create policy "owners and staff can update their organization"
on public.organizations
for update
using (public.user_has_org_access(id))
with check (public.user_has_org_access(id));

create policy "authenticated users can view organization users"
on public.organization_users
for select
using (public.user_has_org_access(organization_id));

create policy "plans are readable"
on public.plans
for select
using (true);

create policy "organization users can view subscriptions"
on public.subscriptions
for select
using (public.user_has_org_access(organization_id));

insert into public.plans (name, price, limits)
values
  ('Starter', 29, '{"dogs":20,"litters":3,"users":1}'::jsonb),
  ('Pro', 79, '{"dogs":75,"litters":12,"users":4}'::jsonb),
  ('Elite', 149, '{"dogs":"Unlimited","litters":"Unlimited","users":"Unlimited"}'::jsonb)
on conflict (name) do update
set price = excluded.price,
    limits = excluded.limits;
