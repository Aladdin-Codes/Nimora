-- Run from the Supabase SQL Editor after applying both project migrations
-- and (optionally) supabase/seed.sql.

-- Required application tables and whether RLS is enabled.
select
  expected.table_name,
  (relation.oid is not null) as exists,
  coalesce(relation.relrowsecurity, false) as rls_enabled
from (values
  ('profiles'),
  ('children'),
  ('child_memberships'),
  ('child_invitations'),
  ('households'),
  ('household_memberships'),
  ('vaccination_records'),
  ('growth_measurements'),
  ('health_timeline_events'),
  ('appointments'),
  ('medical_documents'),
  ('notifications')
) as expected(table_name)
left join pg_class as relation
  on relation.oid = to_regclass('public.' || expected.table_name)
order by expected.table_name;

-- Confirm accounts exist, are email-confirmed, and have profiles.
select
  users.email,
  (users.email_confirmed_at is not null) as email_confirmed,
  (profiles.id is not null) as profile_exists
from auth.users as users
left join public.profiles as profiles on profiles.id = users.id
where lower(users.email) in (
  'owner@example.com',
  'parent@example.com',
  'caregiver@example.com',
  'family2@example.com'
)
order by users.email;

-- Review membership roles and household isolation.
select
  households.name as household,
  users.email,
  memberships.role
from public.household_memberships as memberships
join public.households as households on households.id = memberships.household_id
join auth.users as users on users.id = memberships.user_id
where households.id in (
  '10000000-0000-4000-8000-000000000001',
  '10000000-0000-4000-8000-000000000002'
)
order by households.name, memberships.role, users.email;

-- Count expected synthetic fixture records. Zero indicates the SQL seed has not run.
select 'households' as table_name, count(*) as synthetic_rows
from public.households where is_synthetic
union all
select 'children', count(*) from public.children where is_synthetic
union all
select 'vaccination_records', count(*) from public.vaccination_records where is_synthetic
union all
select 'growth_measurements', count(*) from public.growth_measurements where is_synthetic
union all
select 'health_timeline_events', count(*) from public.health_timeline_events where is_synthetic
union all
select 'appointments', count(*) from public.appointments where is_synthetic
union all
select 'medical_documents', count(*) from public.medical_documents where is_synthetic
union all
select 'notifications', count(*) from public.notifications where is_synthetic
order by table_name;

-- Inspect the RLS policies installed by the migrations.
select tablename, policyname, roles, cmd
from pg_policies
where schemaname = 'public'
order by tablename, policyname;
