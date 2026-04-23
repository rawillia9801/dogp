-- =========================================================
-- MYDOGPORTAL.SITE
-- ADMIN SCHEMA COMPATIBILITY
-- =========================================================

create or replace view public.dogs
with (security_invoker = true)
as
select *
from public.breeding_dogs;

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

create or replace view public.breeding_events
with (security_invoker = true)
as
select *
from public.breeder_events;

create or replace view public.health_records
with (security_invoker = true)
as
select *
from public.dog_health_records;

create or replace view public.genetic_profiles
with (security_invoker = true)
as
select *
from public.dog_genetic_records;
