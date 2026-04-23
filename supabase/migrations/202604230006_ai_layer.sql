-- =========================================================
-- MYDOGPORTAL.SITE
-- AI LAYER
-- =========================================================

create table if not exists public.generated_documents (
  id uuid primary key default gen_random_uuid(),
  breeder_id uuid not null references public.organizations(id) on delete cascade,
  document_type text not null,
  state text not null,
  content_text text not null,
  pdf_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_generated_documents_breeder
on public.generated_documents(breeder_id, created_at desc);

drop trigger if exists trg_generated_documents_updated_at on public.generated_documents;
create trigger trg_generated_documents_updated_at
before update on public.generated_documents
for each row execute function public.set_updated_at();

create table if not exists public.breeder_websites (
  id uuid primary key default gen_random_uuid(),
  breeder_id uuid not null references public.organizations(id) on delete cascade,
  site_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_breeder_websites_breeder
on public.breeder_websites(breeder_id, created_at desc);

drop trigger if exists trg_breeder_websites_updated_at on public.breeder_websites;
create trigger trg_breeder_websites_updated_at
before update on public.breeder_websites
for each row execute function public.set_updated_at();

alter table public.generated_documents enable row level security;
alter table public.breeder_websites enable row level security;

drop policy if exists "org users manage generated documents" on public.generated_documents;
create policy "org users manage generated documents"
on public.generated_documents
for all
using (public.user_has_org_access(breeder_id))
with check (public.user_has_org_access(breeder_id));

drop policy if exists "org users manage breeder websites" on public.breeder_websites;
create policy "org users manage breeder websites"
on public.breeder_websites
for all
using (public.user_has_org_access(breeder_id))
with check (public.user_has_org_access(breeder_id));
