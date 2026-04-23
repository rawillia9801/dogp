-- =========================================================
-- MYDOGPORTAL.SITE
-- MONTH 2 BREEDER WORKSPACES
-- =========================================================

create table if not exists public.breeding_dogs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  call_name text not null,
  registered_name text,
  role text not null default 'dam',
  status text not null default 'active',
  date_of_birth date,
  sex text,
  color text,
  coat text,
  registry text,
  bloodline text,
  photo_url text,
  notes text,
  breeding_eligibility text,
  proven_status text,
  cycle_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_breeding_dogs_org on public.breeding_dogs(organization_id);
create index if not exists idx_breeding_dogs_org_role on public.breeding_dogs(organization_id, role);
create index if not exists idx_breeding_dogs_org_status on public.breeding_dogs(organization_id, status);

drop trigger if exists trg_breeding_dogs_updated_at on public.breeding_dogs;
create trigger trg_breeding_dogs_updated_at
before update on public.breeding_dogs
for each row execute function public.set_updated_at();

create table if not exists public.dog_health_records (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  dog_id uuid not null references public.breeding_dogs(id) on delete cascade,
  test_name text not null,
  result text,
  status text not null default 'recorded',
  tested_at date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_dog_health_records_org on public.dog_health_records(organization_id);
create index if not exists idx_dog_health_records_dog on public.dog_health_records(dog_id);

drop trigger if exists trg_dog_health_records_updated_at on public.dog_health_records;
create trigger trg_dog_health_records_updated_at
before update on public.dog_health_records
for each row execute function public.set_updated_at();

create table if not exists public.dog_genetic_records (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  dog_id uuid not null references public.breeding_dogs(id) on delete cascade,
  carrier_states text,
  color_genetics text,
  coat_genetics text,
  coi_percent numeric(6,2),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_dog_genetic_records_org on public.dog_genetic_records(organization_id);
create index if not exists idx_dog_genetic_records_dog on public.dog_genetic_records(dog_id);

drop trigger if exists trg_dog_genetic_records_updated_at on public.dog_genetic_records;
create trigger trg_dog_genetic_records_updated_at
before update on public.dog_genetic_records
for each row execute function public.set_updated_at();

create table if not exists public.breeding_pairings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  dam_id uuid references public.breeding_dogs(id) on delete set null,
  sire_id uuid references public.breeding_dogs(id) on delete set null,
  pairing_name text,
  status text not null default 'planned',
  breeding_method text,
  planned_start date,
  planned_end date,
  expected_litter_size text,
  color_coat_summary text,
  reservation_goal integer,
  goals text,
  internal_analysis text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_breeding_pairings_org on public.breeding_pairings(organization_id);
create index if not exists idx_breeding_pairings_dam on public.breeding_pairings(dam_id);
create index if not exists idx_breeding_pairings_sire on public.breeding_pairings(sire_id);
create index if not exists idx_breeding_pairings_status on public.breeding_pairings(organization_id, status);

drop trigger if exists trg_breeding_pairings_updated_at on public.breeding_pairings;
create trigger trg_breeding_pairings_updated_at
before update on public.breeding_pairings
for each row execute function public.set_updated_at();

create table if not exists public.litters (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  pairing_id uuid references public.breeding_pairings(id) on delete set null,
  dam_id uuid references public.breeding_dogs(id) on delete set null,
  sire_id uuid references public.breeding_dogs(id) on delete set null,
  litter_name text not null,
  status text not null default 'planned',
  breeding_date date,
  confirmation_date date,
  due_date date,
  whelp_date date,
  expected_size text,
  reservation_goal integer,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_litters_org on public.litters(organization_id);
create index if not exists idx_litters_pairing on public.litters(pairing_id);
create index if not exists idx_litters_dam on public.litters(dam_id);
create index if not exists idx_litters_sire on public.litters(sire_id);
create index if not exists idx_litters_status on public.litters(organization_id, status);

drop trigger if exists trg_litters_updated_at on public.litters;
create trigger trg_litters_updated_at
before update on public.litters
for each row execute function public.set_updated_at();

create table if not exists public.puppies (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  litter_id uuid references public.litters(id) on delete set null,
  puppy_name text,
  call_name text,
  date_of_birth date,
  sex text,
  color text,
  coat text,
  status text not null default 'available',
  price numeric(12,2),
  deposit numeric(12,2),
  balance numeric(12,2),
  retained boolean not null default false,
  public_visible boolean not null default true,
  portal_visible boolean not null default true,
  notes text,
  description text,
  photo_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_puppies_org on public.puppies(organization_id);
create index if not exists idx_puppies_litter on public.puppies(litter_id);
create index if not exists idx_puppies_status on public.puppies(organization_id, status);

drop trigger if exists trg_puppies_updated_at on public.puppies;
create trigger trg_puppies_updated_at
before update on public.puppies
for each row execute function public.set_updated_at();

create table if not exists public.breeder_tasks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  related_type text,
  related_id uuid,
  title text not null,
  priority text not null default 'normal',
  due_date date,
  status text not null default 'open',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_breeder_tasks_org on public.breeder_tasks(organization_id);
create index if not exists idx_breeder_tasks_due on public.breeder_tasks(organization_id, due_date);
create index if not exists idx_breeder_tasks_status on public.breeder_tasks(organization_id, status);

drop trigger if exists trg_breeder_tasks_updated_at on public.breeder_tasks;
create trigger trg_breeder_tasks_updated_at
before update on public.breeder_tasks
for each row execute function public.set_updated_at();

create table if not exists public.breeder_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  related_type text,
  related_id uuid,
  title text not null,
  event_type text,
  event_date date not null,
  status text not null default 'scheduled',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_breeder_events_org on public.breeder_events(organization_id);
create index if not exists idx_breeder_events_date on public.breeder_events(organization_id, event_date);

drop trigger if exists trg_breeder_events_updated_at on public.breeder_events;
create trigger trg_breeder_events_updated_at
before update on public.breeder_events
for each row execute function public.set_updated_at();

alter table public.breeding_dogs enable row level security;
alter table public.dog_health_records enable row level security;
alter table public.dog_genetic_records enable row level security;
alter table public.breeding_pairings enable row level security;
alter table public.litters enable row level security;
alter table public.puppies enable row level security;
alter table public.breeder_tasks enable row level security;
alter table public.breeder_events enable row level security;

create policy "org users manage breeding dogs"
on public.breeding_dogs
for all
using (public.user_has_org_access(organization_id))
with check (public.user_has_org_access(organization_id));

create policy "org users manage dog health records"
on public.dog_health_records
for all
using (public.user_has_org_access(organization_id))
with check (public.user_has_org_access(organization_id));

create policy "org users manage dog genetic records"
on public.dog_genetic_records
for all
using (public.user_has_org_access(organization_id))
with check (public.user_has_org_access(organization_id));

create policy "org users manage breeding pairings"
on public.breeding_pairings
for all
using (public.user_has_org_access(organization_id))
with check (public.user_has_org_access(organization_id));

create policy "org users manage litters"
on public.litters
for all
using (public.user_has_org_access(organization_id))
with check (public.user_has_org_access(organization_id));

create policy "org users manage puppies"
on public.puppies
for all
using (public.user_has_org_access(organization_id))
with check (public.user_has_org_access(organization_id));

create policy "org users manage breeder tasks"
on public.breeder_tasks
for all
using (public.user_has_org_access(organization_id))
with check (public.user_has_org_access(organization_id));

create policy "org users manage breeder events"
on public.breeder_events
for all
using (public.user_has_org_access(organization_id))
with check (public.user_has_org_access(organization_id));
