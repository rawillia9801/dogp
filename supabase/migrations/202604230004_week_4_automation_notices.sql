-- =========================================================
-- MYDOGPORTAL.SITE
-- WEEK 4 AUTOMATION, NOTICES, AND WORKFLOWS
-- =========================================================

alter table if exists public.breeding_pairings
add column if not exists planned_start date;

alter table if exists public.breeding_pairings
add column if not exists planned_end date;

alter table if exists public.breeding_pairings
add column if not exists expected_litter_size text;

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

create table if not exists public.notice_templates (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations(id) on delete cascade,
  template_key text not null,
  category text not null,
  notice_type text not null,
  subject text not null,
  body text not null,
  status text not null default 'enabled',
  timing_rule text,
  recipient_rules jsonb not null default '{}'::jsonb,
  variables jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, template_key)
);

create index if not exists idx_notice_templates_org on public.notice_templates(organization_id);
create index if not exists idx_notice_templates_type on public.notice_templates(organization_id, notice_type);
create index if not exists idx_notice_templates_status on public.notice_templates(organization_id, status);
delete from public.notice_templates older
using public.notice_templates newer
where older.organization_id is null
  and newer.organization_id is null
  and older.template_key = newer.template_key
  and older.ctid < newer.ctid;
create unique index if not exists idx_notice_templates_global_key
on public.notice_templates(template_key)
where organization_id is null;

drop trigger if exists trg_notice_templates_updated_at on public.notice_templates;
create trigger trg_notice_templates_updated_at
before update on public.notice_templates
for each row execute function public.set_updated_at();

insert into public.notice_templates (
  organization_id,
  template_key,
  category,
  notice_type,
  subject,
  body,
  status,
  timing_rule,
  recipient_rules,
  variables
)
select
  null,
  template_key,
  category,
  notice_type,
  subject,
  body,
  'enabled',
  'Rule controlled',
  '{"buyer": true}'::jsonb,
  '["breeder_name","buyer_name","puppy_name","litter_name","amount_due","balance","due_date","transport_date","document_title","status"]'::jsonb
from (
  values
    ('payment-reminder', 'Payment Reminder', 'payment_reminder', 'Upcoming payment for {{puppy_name}}', 'Hi {{buyer_name}}, your next payment of {{amount_due}} is scheduled for {{due_date}}. Your current balance is {{balance}}.'),
    ('payment-overdue', 'Payment Overdue Notice', 'payment_overdue_notice', 'Payment attention needed', 'Hi {{buyer_name}}, your payment scheduled for {{due_date}} needs attention. Current balance: {{balance}}.'),
    ('payment-receipt', 'Payment Receipt', 'payment_receipt', 'Payment received', 'Hi {{buyer_name}}, we received your {{amount_due}} payment. Updated status: {{status}}.'),
    ('document-ready', 'Document Ready', 'document_ready', '{{document_title}} is ready', 'Hi {{buyer_name}}, {{document_title}} is ready in your buyer file.'),
    ('document-signed', 'Document Signed', 'document_signed', '{{document_title}} has been signed', 'Hi {{buyer_name}}, {{document_title}} is signed and recorded.'),
    ('application-received', 'Buyer Application Received', 'application_submitted', 'Application received', 'Hi {{buyer_name}}, your application has been received and is under breeder review.'),
    ('buyer-approved', 'Buyer Approved', 'application_approved', 'Buyer file approved', 'Hi {{buyer_name}}, your buyer file has been approved. Status: {{status}}.'),
    ('puppy-reserved', 'Puppy Reserved', 'puppy_reserved', '{{puppy_name}} reservation recorded', 'Hi {{buyer_name}}, your reservation for {{puppy_name}} is recorded.'),
    ('puppy-update', 'Puppy Update', 'puppy_update', '{{puppy_name}} update', 'Hi {{buyer_name}}, {{puppy_name}} has a new update from {{breeder_name}}.'),
    ('milestone-update', 'Milestone Update', 'milestone_update', '{{litter_name}} milestone update', 'Hi {{buyer_name}}, {{litter_name}} has reached {{status}}.'),
    ('transport-reminder', 'Transportation Reminder', 'transportation_reminder', 'Transportation reminder for {{puppy_name}}', 'Hi {{buyer_name}}, transportation is scheduled for {{transport_date}}.'),
    ('go-home-reminder', 'Go-Home Reminder', 'go_home_reminder', 'Go-home preparation for {{puppy_name}}', 'Hi {{buyer_name}}, {{puppy_name}} is preparing for go-home. Please review your pickup details.')
) as defaults(template_key, category, notice_type, subject, body)
where not exists (
  select 1
  from public.notice_templates existing
  where existing.organization_id is null
    and existing.template_key = defaults.template_key
);

create table if not exists public.notice_rules (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  rule_key text not null,
  enabled boolean not null default true,
  trigger_type text not null,
  timing_offset integer not null default 0,
  timing_unit text not null default 'days',
  template_id uuid references public.notice_templates(id) on delete set null,
  recipient_behavior text not null default 'buyer',
  filters jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, rule_key)
);

create index if not exists idx_notice_rules_org on public.notice_rules(organization_id);
create index if not exists idx_notice_rules_trigger on public.notice_rules(organization_id, trigger_type);
create index if not exists idx_notice_rules_enabled on public.notice_rules(organization_id, enabled);

drop trigger if exists trg_notice_rules_updated_at on public.notice_rules;
create trigger trg_notice_rules_updated_at
before update on public.notice_rules
for each row execute function public.set_updated_at();

create table if not exists public.notice_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  notice_type text not null,
  template_id uuid references public.notice_templates(id) on delete set null,
  rule_id uuid references public.notice_rules(id) on delete set null,
  buyer_id uuid references public.buyers(id) on delete set null,
  puppy_id uuid references public.puppies(id) on delete set null,
  related_type text,
  related_id uuid,
  scheduled_at timestamptz,
  sent_at timestamptz,
  delivery_status text not null default 'scheduled',
  failure_reason text,
  provider text,
  provider_message_id text,
  dedupe_key text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists idx_notice_logs_dedupe
on public.notice_logs(organization_id, dedupe_key)
where dedupe_key is not null;

create index if not exists idx_notice_logs_org on public.notice_logs(organization_id);
create index if not exists idx_notice_logs_buyer on public.notice_logs(buyer_id);
create index if not exists idx_notice_logs_puppy on public.notice_logs(puppy_id);
create index if not exists idx_notice_logs_status on public.notice_logs(organization_id, delivery_status);
create index if not exists idx_notice_logs_scheduled on public.notice_logs(organization_id, scheduled_at);
create index if not exists idx_notice_logs_related on public.notice_logs(related_type, related_id);

drop trigger if exists trg_notice_logs_updated_at on public.notice_logs;
create trigger trg_notice_logs_updated_at
before update on public.notice_logs
for each row execute function public.set_updated_at();

create or replace view public.buyer_payment_notice_logs
with (security_invoker = true)
as
select *
from public.notice_logs
where notice_type in ('payment_reminder', 'payment_overdue_notice', 'payment_receipt')
   or related_type in ('payment', 'payment_plan');

create table if not exists public.workflow_runs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  run_key text not null,
  status text not null default 'queued',
  started_at timestamptz,
  finished_at timestamptz,
  summary jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, run_key)
);

create index if not exists idx_workflow_runs_org on public.workflow_runs(organization_id);
create index if not exists idx_workflow_runs_status on public.workflow_runs(organization_id, status);

drop trigger if exists trg_workflow_runs_updated_at on public.workflow_runs;
create trigger trg_workflow_runs_updated_at
before update on public.workflow_runs
for each row execute function public.set_updated_at();

create table if not exists public.workflow_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  run_id uuid references public.workflow_runs(id) on delete cascade,
  event_key text not null,
  event_type text not null,
  related_type text,
  related_id uuid,
  status text not null default 'recorded',
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, event_key)
);

create index if not exists idx_workflow_events_org on public.workflow_events(organization_id);
create index if not exists idx_workflow_events_type on public.workflow_events(organization_id, event_type);
create index if not exists idx_workflow_events_related on public.workflow_events(related_type, related_id);

create table if not exists public.automation_settings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null unique references public.organizations(id) on delete cascade,
  notices_enabled boolean not null default true,
  payment_notices_enabled boolean not null default true,
  document_notices_enabled boolean not null default true,
  transportation_notices_enabled boolean not null default true,
  puppy_milestone_notices_enabled boolean not null default true,
  provider_name text not null default 'provider ready',
  from_email text,
  reply_to_email text,
  quiet_hours jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_automation_settings_org on public.automation_settings(organization_id);

drop trigger if exists trg_automation_settings_updated_at on public.automation_settings;
create trigger trg_automation_settings_updated_at
before update on public.automation_settings
for each row execute function public.set_updated_at();

alter table public.notice_templates enable row level security;
alter table public.notice_rules enable row level security;
alter table public.notice_logs enable row level security;
alter table public.workflow_runs enable row level security;
alter table public.workflow_events enable row level security;
alter table public.automation_settings enable row level security;

drop policy if exists "org users manage notice templates" on public.notice_templates;
create policy "org users manage notice templates"
on public.notice_templates
for all
using (organization_id is null or public.user_has_org_access(organization_id))
with check (organization_id is null or public.user_has_org_access(organization_id));

drop policy if exists "org users manage notice rules" on public.notice_rules;
create policy "org users manage notice rules"
on public.notice_rules
for all
using (public.user_has_org_access(organization_id))
with check (public.user_has_org_access(organization_id));

drop policy if exists "org users manage notice logs" on public.notice_logs;
create policy "org users manage notice logs"
on public.notice_logs
for all
using (public.user_has_org_access(organization_id))
with check (public.user_has_org_access(organization_id));

drop policy if exists "org users manage workflow runs" on public.workflow_runs;
create policy "org users manage workflow runs"
on public.workflow_runs
for all
using (public.user_has_org_access(organization_id))
with check (public.user_has_org_access(organization_id));

drop policy if exists "org users manage workflow events" on public.workflow_events;
create policy "org users manage workflow events"
on public.workflow_events
for all
using (public.user_has_org_access(organization_id))
with check (public.user_has_org_access(organization_id));

drop policy if exists "org users manage automation settings" on public.automation_settings;
create policy "org users manage automation settings"
on public.automation_settings
for all
using (public.user_has_org_access(organization_id))
with check (public.user_has_org_access(organization_id));
