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

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text,
  address text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table if exists public.organizations
add column if not exists name text;

alter table if exists public.organizations
add column if not exists email text;

alter table if exists public.organizations
add column if not exists phone text;

alter table if exists public.organizations
add column if not exists address text;

alter table if exists public.organizations
add column if not exists created_at timestamptz not null default now();

alter table if exists public.organizations
add column if not exists updated_at timestamptz not null default now();

drop trigger if exists trg_organizations_updated_at on public.organizations;
create trigger trg_organizations_updated_at
before update on public.organizations
for each row execute function public.set_updated_at();

create table if not exists public.organization_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  role text not null check (role in ('owner', 'staff')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, organization_id)
);

alter table if exists public.organization_users
add column if not exists id uuid default gen_random_uuid();

alter table if exists public.organization_users
add column if not exists user_id uuid;

alter table if exists public.organization_users
add column if not exists organization_id uuid references public.organizations(id) on delete cascade;

alter table if exists public.organization_users
add column if not exists role text;

alter table if exists public.organization_users
add column if not exists created_at timestamptz not null default now();

alter table if exists public.organization_users
add column if not exists updated_at timestamptz not null default now();

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'organization_users'
      and column_name = 'id'
  ) and not exists (
    select 1
    from pg_constraint
    where conname = 'organization_users_pkey'
      and conrelid = 'public.organization_users'::regclass
  ) then
    alter table public.organization_users
    add constraint organization_users_pkey primary key (id);
  end if;
end $$;

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'organization_users'
      and column_name = 'role'
  ) then
    update public.organization_users
    set role = coalesce(nullif(role, ''), 'owner')
    where role is null or role = '';
  end if;
end $$;

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'organization_users'
      and column_name = 'role'
  ) and not exists (
    select 1
    from pg_constraint
    where conname = 'organization_users_role_check'
      and conrelid = 'public.organization_users'::regclass
  ) then
    alter table public.organization_users
    add constraint organization_users_role_check
    check (role in ('owner', 'staff'));
  end if;
end $$;

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'organization_users'
      and column_name = 'user_id'
  ) and exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'organization_users'
      and column_name = 'organization_id'
  ) and not exists (
    select 1
    from pg_constraint
    where conname = 'organization_users_user_id_organization_id_key'
      and conrelid = 'public.organization_users'::regclass
  ) then
    alter table public.organization_users
    add constraint organization_users_user_id_organization_id_key
    unique (user_id, organization_id);
  end if;
end $$;

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'organization_users'
      and column_name = 'user_id'
  ) then
    create index if not exists idx_organization_users_user_id on public.organization_users(user_id);
  end if;
end $$;

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'organization_users'
      and column_name = 'organization_id'
  ) then
    create index if not exists idx_organization_users_organization_id on public.organization_users(organization_id);
  end if;
end $$;

drop trigger if exists trg_organization_users_updated_at on public.organization_users;
create trigger trg_organization_users_updated_at
before update on public.organization_users
for each row execute function public.set_updated_at();

create table if not exists public.plans (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  price integer not null,
  limits jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table if exists public.plans
add column if not exists id uuid default gen_random_uuid();

alter table if exists public.plans
add column if not exists name text;

alter table if exists public.plans
add column if not exists price integer;

alter table if exists public.plans
add column if not exists limits jsonb not null default '{}'::jsonb;

alter table if exists public.plans
add column if not exists created_at timestamptz not null default now();

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'plans'
      and column_name = 'name'
  ) and not exists (
    select 1
    from pg_constraint
    where conname = 'plans_name_key'
      and conrelid = 'public.plans'::regclass
  ) then
    alter table public.plans
    add constraint plans_name_key unique (name);
  end if;
end $$;

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null unique references public.organizations(id) on delete cascade,
  plan_id uuid references public.plans(id) on delete set null,
  status text not null default 'trialing',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table if exists public.subscriptions
add column if not exists id uuid default gen_random_uuid();

alter table if exists public.subscriptions
add column if not exists organization_id uuid references public.organizations(id) on delete cascade;

alter table if exists public.subscriptions
add column if not exists plan_id uuid references public.plans(id) on delete set null;

alter table if exists public.subscriptions
add column if not exists status text not null default 'trialing';

alter table if exists public.subscriptions
add column if not exists created_at timestamptz not null default now();

alter table if exists public.subscriptions
add column if not exists updated_at timestamptz not null default now();

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'subscriptions'
      and column_name = 'organization_id'
  ) and not exists (
    select 1
    from pg_constraint
    where conname = 'subscriptions_organization_id_key'
      and conrelid = 'public.subscriptions'::regclass
  ) then
    alter table public.subscriptions
    add constraint subscriptions_organization_id_key unique (organization_id);
  end if;
end $$;

drop trigger if exists trg_subscriptions_updated_at on public.subscriptions;
create trigger trg_subscriptions_updated_at
before update on public.subscriptions
for each row execute function public.set_updated_at();

create or replace function public.user_has_org_access(target_org uuid)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  has_required_columns boolean;
  has_access boolean := false;
begin
  select exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'organization_users'
      and column_name = 'user_id'
  ) and exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'organization_users'
      and column_name = 'organization_id'
  )
  into has_required_columns;

  if not has_required_columns then
    return false;
  end if;

  execute $query$
    select exists (
      select 1
      from public.organization_users ou
      where ou.organization_id = $1
        and ou.user_id = auth.uid()
    )
  $query$
  into has_access
  using target_org;

  return has_access;
end;
$$;

alter table public.organizations enable row level security;
alter table public.organization_users enable row level security;
alter table public.plans enable row level security;
alter table public.subscriptions enable row level security;

drop policy if exists "authenticated users can view their organizations" on public.organizations;
create policy "authenticated users can view their organizations"
on public.organizations
for select
using (public.user_has_org_access(id));

drop policy if exists "owners and staff can update their organization" on public.organizations;
create policy "owners and staff can update their organization"
on public.organizations
for update
using (public.user_has_org_access(id))
with check (public.user_has_org_access(id));

drop policy if exists "authenticated users can view organization users" on public.organization_users;
create policy "authenticated users can view organization users"
on public.organization_users
for select
using (public.user_has_org_access(organization_id));

drop policy if exists "plans are readable" on public.plans;
create policy "plans are readable"
on public.plans
for select
using (true);

drop policy if exists "organization users can view subscriptions" on public.subscriptions;
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
