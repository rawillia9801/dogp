create table if not exists public.upgrade_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  trigger_type text not null,
  source_area text not null,
  current_plan text not null,
  suggested_plan text not null,
  metadata_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_upgrade_events_organization_id
  on public.upgrade_events(organization_id);

create index if not exists idx_upgrade_events_trigger_type
  on public.upgrade_events(trigger_type);

create table if not exists public.plan_limits (
  id uuid primary key default gen_random_uuid(),
  plan_key text not null,
  feature_key text not null,
  limit_value integer,
  created_at timestamptz not null default now(),
  unique (plan_key, feature_key)
);

create index if not exists idx_plan_limits_plan_key
  on public.plan_limits(plan_key);

alter table public.upgrade_events enable row level security;
alter table public.plan_limits enable row level security;

drop policy if exists "organization users can view upgrade events" on public.upgrade_events;
create policy "organization users can view upgrade events"
on public.upgrade_events
for select
using (public.user_has_org_access(organization_id));

drop policy if exists "plan limits are readable" on public.plan_limits;
create policy "plan limits are readable"
on public.plan_limits
for select
using (true);

insert into public.plan_limits (plan_key, feature_key, limit_value)
values
  ('starter', 'workspace_dashboard', 1),
  ('starter', 'workspace_dogs', 1),
  ('starter', 'workspace_breeding_program', 1),
  ('starter', 'workspace_litters', 1),
  ('starter', 'workspace_puppies', 1),
  ('starter', 'workspace_buyers', 0),
  ('starter', 'workspace_applications', 0),
  ('starter', 'workspace_payments', 0),
  ('starter', 'workspace_documents', 0),
  ('starter', 'workspace_transportation', 0),
  ('starter', 'workspace_automation', 0),
  ('starter', 'workspace_ai_documents', 0),
  ('starter', 'workspace_website_builder', 0),
  ('starter', 'workspace_chichi_advanced', 0),
  ('starter', 'limit_dogs', 20),
  ('starter', 'limit_litters', 3),
  ('starter', 'limit_users', 1),
  ('starter', 'limit_puppies', 24),
  ('starter', 'limit_buyers', 0),
  ('starter', 'limit_automation_runs', 0),
  ('pro', 'workspace_dashboard', 1),
  ('pro', 'workspace_dogs', 1),
  ('pro', 'workspace_breeding_program', 1),
  ('pro', 'workspace_litters', 1),
  ('pro', 'workspace_puppies', 1),
  ('pro', 'workspace_buyers', 1),
  ('pro', 'workspace_applications', 1),
  ('pro', 'workspace_payments', 1),
  ('pro', 'workspace_documents', 1),
  ('pro', 'workspace_transportation', 1),
  ('pro', 'workspace_automation', 1),
  ('pro', 'workspace_ai_documents', 0),
  ('pro', 'workspace_website_builder', 0),
  ('pro', 'workspace_chichi_advanced', 0),
  ('pro', 'limit_dogs', 75),
  ('pro', 'limit_litters', 12),
  ('pro', 'limit_users', 4),
  ('pro', 'limit_puppies', 60),
  ('pro', 'limit_buyers', 75),
  ('pro', 'limit_automation_runs', 250),
  ('elite', 'workspace_dashboard', 1),
  ('elite', 'workspace_dogs', 1),
  ('elite', 'workspace_breeding_program', 1),
  ('elite', 'workspace_litters', 1),
  ('elite', 'workspace_puppies', 1),
  ('elite', 'workspace_buyers', 1),
  ('elite', 'workspace_applications', 1),
  ('elite', 'workspace_payments', 1),
  ('elite', 'workspace_documents', 1),
  ('elite', 'workspace_transportation', 1),
  ('elite', 'workspace_automation', 1),
  ('elite', 'workspace_ai_documents', 1),
  ('elite', 'workspace_website_builder', 1),
  ('elite', 'workspace_chichi_advanced', 1),
  ('elite', 'limit_dogs', null),
  ('elite', 'limit_litters', null),
  ('elite', 'limit_users', null),
  ('elite', 'limit_puppies', null),
  ('elite', 'limit_buyers', null),
  ('elite', 'limit_automation_runs', null)
on conflict (plan_key, feature_key) do update
set limit_value = excluded.limit_value;
