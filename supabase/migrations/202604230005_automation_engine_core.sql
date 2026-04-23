-- =========================================================
-- MYDOGPORTAL.SITE
-- AUTOMATION ENGINE CORE
-- =========================================================

alter table if exists public.breeding_pairings
add column if not exists planned_start date;

alter table if exists public.breeding_pairings
add column if not exists planned_end date;

create or replace view public.breedings
with (security_invoker = true)
as
select
  id,
  organization_id,
  sire_id,
  dam_id,
  pairing_name as breeding_name,
  status,
  breeding_method,
  planned_start,
  planned_end,
  expected_litter_size,
  color_coat_summary,
  reservation_goal,
  goals,
  internal_analysis,
  notes,
  created_at,
  updated_at
from public.breeding_pairings;

create table if not exists public.email_templates (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade,
  template_key text not null,
  category text,
  notice_type text,
  subject text not null,
  body text not null,
  variables_json jsonb not null default '[]'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table if exists public.email_templates
add column if not exists organization_id uuid references public.organizations(id) on delete cascade;
alter table if exists public.email_templates
add column if not exists category text;
alter table if exists public.email_templates
add column if not exists notice_type text;
alter table if exists public.email_templates
add column if not exists variables_json jsonb not null default '[]'::jsonb;
alter table if exists public.email_templates
add column if not exists is_active boolean not null default true;
alter table if exists public.email_templates
add column if not exists updated_at timestamptz not null default now();

create unique index if not exists idx_email_templates_org_key
on public.email_templates(organization_id, template_key)
where organization_id is not null;

create unique index if not exists idx_email_templates_global_key
on public.email_templates(template_key)
where organization_id is null;

create index if not exists idx_email_templates_notice_type
on public.email_templates(coalesce(organization_id, '00000000-0000-0000-0000-000000000000'::uuid), notice_type);

drop trigger if exists trg_email_templates_updated_at on public.email_templates;
create trigger trg_email_templates_updated_at
before update on public.email_templates
for each row execute function public.set_updated_at();

insert into public.email_templates (
  organization_id,
  template_key,
  category,
  notice_type,
  subject,
  body,
  variables_json,
  is_active
)
select
  null,
  defaults.template_key,
  defaults.category,
  defaults.notice_type,
  defaults.subject,
  defaults.body,
  defaults.variables_json,
  true
from (
  values
    ('payment_reminder', 'Payment Reminder', 'payment_reminder', 'Payment due for {{puppy_name}}', 'Your payment for {{puppy_name}} is due on {{due_date}}.', '["buyer_name","puppy_name","due_date","balance","amount_due","breeder_name"]'::jsonb),
    ('payment_overdue_notice', 'Overdue Notice', 'payment_overdue', 'Payment past due for {{puppy_name}}', 'Your payment for {{puppy_name}} is past due.', '["buyer_name","puppy_name","due_date","balance","amount_due","breeder_name"]'::jsonb),
    ('application_follow_up', 'Application Follow-up', 'application_submitted', 'Application update for {{buyer_name}}', 'We received your application and will follow up with next steps shortly.', '["buyer_name","breeder_name"]'::jsonb),
    ('pickup_reminder', 'Pickup Reminder', 'delivery_upcoming', 'Pickup scheduled for {{puppy_name}}', 'Your puppy {{puppy_name}} is scheduled for pickup on {{delivery_date}}.', '["buyer_name","puppy_name","delivery_date","breeder_name"]'::jsonb)
) as defaults(template_key, category, notice_type, subject, body, variables_json)
where not exists (
  select 1
  from public.email_templates existing
  where existing.organization_id is null
    and existing.template_key = defaults.template_key
);

create table if not exists public.automation_rules (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  trigger_type text not null,
  condition_json jsonb not null default '{}'::jsonb,
  action_type text not null default 'send_email',
  delay_minutes integer not null default 0,
  template_key text,
  retry_limit integer not null default 2,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table if exists public.automation_rules
add column if not exists template_key text;
alter table if exists public.automation_rules
add column if not exists retry_limit integer not null default 2;
alter table if exists public.automation_rules
add column if not exists updated_at timestamptz not null default now();

create index if not exists idx_automation_rules_org on public.automation_rules(organization_id);
create index if not exists idx_automation_rules_trigger on public.automation_rules(organization_id, trigger_type);
create index if not exists idx_automation_rules_active on public.automation_rules(organization_id, is_active);
create unique index if not exists idx_automation_rules_org_name
on public.automation_rules(organization_id, name);

drop trigger if exists trg_automation_rules_updated_at on public.automation_rules;
create trigger trg_automation_rules_updated_at
before update on public.automation_rules
for each row execute function public.set_updated_at();

insert into public.automation_rules (
  organization_id,
  name,
  trigger_type,
  condition_json,
  action_type,
  delay_minutes,
  template_key,
  retry_limit,
  is_active
)
select
  organizations.id,
  defaults.name,
  defaults.trigger_type,
  defaults.condition_json,
  'send_email',
  defaults.delay_minutes,
  defaults.template_key,
  2,
  true
from public.organizations
cross join (
  values
    ('Payment Reminder', 'payment_due', '{"requires_balance": true, "buyer_email_required": true}'::jsonb, -4320, 'payment_reminder'),
    ('Payment Overdue Notice', 'payment_overdue', '{"requires_balance": true, "buyer_email_required": true}'::jsonb, 2880, 'payment_overdue_notice'),
    ('Application Follow-up', 'application_submitted', '{"buyer_email_required": true}'::jsonb, 0, 'application_follow_up'),
    ('Puppy Reserved Notice', 'puppy_reserved', '{"buyer_required": true, "buyer_email_required": true, "puppy_statuses": ["reserved"]}'::jsonb, 0, 'application_follow_up'),
    ('Pickup Reminder', 'delivery_upcoming', '{"buyer_required": true, "buyer_email_required": true, "location_required": true}'::jsonb, -1440, 'pickup_reminder')
) as defaults(name, trigger_type, condition_json, delay_minutes, template_key)
where not exists (
  select 1
  from public.automation_rules existing
  where existing.organization_id = organizations.id
    and existing.name = defaults.name
);

create table if not exists public.automation_runs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  rule_id uuid references public.automation_rules(id) on delete set null,
  buyer_id uuid references public.buyers(id) on delete set null,
  puppy_id uuid references public.puppies(id) on delete set null,
  template_key text,
  notice_type text,
  related_type text,
  related_id uuid,
  triggered_at timestamptz not null default now(),
  scheduled_at timestamptz,
  sent_at timestamptz,
  status text not null default 'pending',
  retry_count integer not null default 0,
  max_retries integer not null default 2,
  provider text,
  provider_message_id text,
  dedupe_key text,
  last_error text,
  metadata_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table if exists public.automation_runs
add column if not exists template_key text;
alter table if exists public.automation_runs
add column if not exists notice_type text;
alter table if exists public.automation_runs
add column if not exists related_type text;
alter table if exists public.automation_runs
add column if not exists related_id uuid;
alter table if exists public.automation_runs
add column if not exists scheduled_at timestamptz;
alter table if exists public.automation_runs
add column if not exists sent_at timestamptz;
alter table if exists public.automation_runs
add column if not exists retry_count integer not null default 0;
alter table if exists public.automation_runs
add column if not exists max_retries integer not null default 2;
alter table if exists public.automation_runs
add column if not exists provider text;
alter table if exists public.automation_runs
add column if not exists provider_message_id text;
alter table if exists public.automation_runs
add column if not exists dedupe_key text;
alter table if exists public.automation_runs
add column if not exists last_error text;
alter table if exists public.automation_runs
add column if not exists metadata_json jsonb not null default '{}'::jsonb;
alter table if exists public.automation_runs
add column if not exists updated_at timestamptz not null default now();

create index if not exists idx_automation_runs_org on public.automation_runs(organization_id);
create index if not exists idx_automation_runs_status on public.automation_runs(organization_id, status);
create index if not exists idx_automation_runs_scheduled on public.automation_runs(organization_id, scheduled_at);
create unique index if not exists idx_automation_runs_dedupe
on public.automation_runs(organization_id, dedupe_key)
where dedupe_key is not null;

drop trigger if exists trg_automation_runs_updated_at on public.automation_runs;
create trigger trg_automation_runs_updated_at
before update on public.automation_runs
for each row execute function public.set_updated_at();

do $$
begin
  if exists (
    select 1
    from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public'
      and c.relname = 'buyer_payment_notice_logs'
      and c.relkind in ('v', 'm')
  ) then
    execute 'drop view public.buyer_payment_notice_logs';
  end if;
end $$;

create table if not exists public.buyer_payment_notice_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  buyer_id uuid not null references public.buyers(id) on delete cascade,
  notice_type text not null,
  sent_at timestamptz,
  status text not null default 'pending',
  metadata_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_buyer_payment_notice_logs_org
on public.buyer_payment_notice_logs(organization_id);
create index if not exists idx_buyer_payment_notice_logs_buyer
on public.buyer_payment_notice_logs(buyer_id);
create index if not exists idx_buyer_payment_notice_logs_status
on public.buyer_payment_notice_logs(status);

create table if not exists public.email_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  automation_run_id uuid references public.automation_runs(id) on delete set null,
  buyer_id uuid references public.buyers(id) on delete set null,
  template_key text,
  sent_at timestamptz,
  status text not null default 'pending',
  provider text,
  metadata_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table if exists public.email_logs
add column if not exists automation_run_id uuid references public.automation_runs(id) on delete set null;
alter table if exists public.email_logs
add column if not exists organization_id uuid references public.organizations(id) on delete cascade;
alter table if exists public.email_logs
add column if not exists provider text;
alter table if exists public.email_logs
add column if not exists metadata_json jsonb not null default '{}'::jsonb;

create index if not exists idx_email_logs_org on public.email_logs(organization_id);
create index if not exists idx_email_logs_buyer on public.email_logs(buyer_id);
create index if not exists idx_email_logs_status on public.email_logs(status);

create table if not exists public.automation_settings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null unique references public.organizations(id) on delete cascade,
  notices_enabled boolean not null default true,
  payment_notices_enabled boolean not null default true,
  document_notices_enabled boolean not null default true,
  transportation_notices_enabled boolean not null default true,
  puppy_milestone_notices_enabled boolean not null default true,
  provider_name text not null default 'Resend',
  from_email text,
  reply_to_email text,
  quiet_hours jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_automation_settings_updated_at on public.automation_settings;
create trigger trg_automation_settings_updated_at
before update on public.automation_settings
for each row execute function public.set_updated_at();

insert into public.automation_settings (organization_id, provider_name)
select id, 'Resend'
from public.organizations
where not exists (
  select 1
  from public.automation_settings existing
  where existing.organization_id = organizations.id
);

alter table public.email_templates enable row level security;
alter table public.automation_rules enable row level security;
alter table public.automation_runs enable row level security;
alter table public.email_logs enable row level security;
alter table public.buyer_payment_notice_logs enable row level security;
alter table public.automation_settings enable row level security;

drop policy if exists "org users manage email templates" on public.email_templates;
create policy "org users manage email templates"
on public.email_templates
for all
using (organization_id is null or public.user_has_org_access(organization_id))
with check (organization_id is null or public.user_has_org_access(organization_id));

drop policy if exists "org users manage automation rules" on public.automation_rules;
create policy "org users manage automation rules"
on public.automation_rules
for all
using (public.user_has_org_access(organization_id))
with check (public.user_has_org_access(organization_id));

drop policy if exists "org users manage automation runs" on public.automation_runs;
create policy "org users manage automation runs"
on public.automation_runs
for all
using (public.user_has_org_access(organization_id))
with check (public.user_has_org_access(organization_id));

drop policy if exists "org users manage email logs" on public.email_logs;
create policy "org users manage email logs"
on public.email_logs
for all
using (public.user_has_org_access(organization_id))
with check (public.user_has_org_access(organization_id));

drop policy if exists "org users manage buyer payment notice logs" on public.buyer_payment_notice_logs;
create policy "org users manage buyer payment notice logs"
on public.buyer_payment_notice_logs
for all
using (public.user_has_org_access(organization_id))
with check (public.user_has_org_access(organization_id));

drop policy if exists "org users manage automation settings core" on public.automation_settings;
create policy "org users manage automation settings core"
on public.automation_settings
for all
using (public.user_has_org_access(organization_id))
with check (public.user_has_org_access(organization_id));
