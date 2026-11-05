-- Synthetic development fixtures only.
-- Run only against a verified non-production project after applying both migrations
-- and creating/confirming the four users in Supabase Auth.
-- This script never inserts into or updates auth.users.

do $seed$
declare
  owner_user_id uuid;
  parent_user_id uuid;
  caregiver_user_id uuid;
  family2_user_id uuid;
  household_a_id constant uuid := '10000000-0000-4000-8000-000000000001';
  household_b_id constant uuid := '10000000-0000-4000-8000-000000000002';
  child_a1_id constant uuid := '20000000-0000-4000-8000-000000000001';
  child_a2_id constant uuid := '20000000-0000-4000-8000-000000000002';
  child_b1_id constant uuid := '20000000-0000-4000-8000-000000000003';
begin
  select id into owner_user_id from auth.users where lower(email) = 'owner@example.com';
  select id into parent_user_id from auth.users where lower(email) = 'parent@example.com';
  select id into caregiver_user_id from auth.users where lower(email) = 'caregiver@example.com';
  select id into family2_user_id from auth.users where lower(email) = 'family2@example.com';

  if owner_user_id is null or parent_user_id is null
      or caregiver_user_id is null or family2_user_id is null then
    raise exception 'Create all four test accounts in Supabase Auth before running this seed.';
  end if;

  if exists (
    select 1
    from auth.users
    where id in (owner_user_id, parent_user_id, caregiver_user_id, family2_user_id)
      and email_confirmed_at is null
  ) then
    raise exception 'Confirm all four test accounts in Supabase Auth before running this seed.';
  end if;

  insert into public.profiles (id, full_name)
  values
    (owner_user_id, 'Aladdin Codes'),
    (parent_user_id, 'minat Md'),
    (caregiver_user_id, 'Dsalihu fam'),
    (family2_user_id, 'ALaddin codes')
  on conflict (id) do update set full_name = excluded.full_name;

  insert into public.households (id, name, created_by, is_synthetic)
  values
    (household_a_id, 'Synthetic development household A', owner_user_id, true),
    (household_b_id, 'Synthetic development household B', family2_user_id, true)
  on conflict (id) do update
  set name = excluded.name,
      created_by = excluded.created_by,
      is_synthetic = excluded.is_synthetic;

  insert into public.household_memberships (household_id, user_id, role, added_by)
  values
    (household_a_id, owner_user_id, 'owner', owner_user_id),
    (household_a_id, parent_user_id, 'parent', owner_user_id),
    (household_a_id, caregiver_user_id, 'caregiver', owner_user_id),
    (household_b_id, family2_user_id, 'owner', family2_user_id)
  on conflict (household_id, user_id) do update
  set role = excluded.role,
      added_by = excluded.added_by;

  insert into public.children (
    id, owner_id, household_id, first_name, last_name, preferred_name, birth_date, is_synthetic
  )
  values
    (child_a1_id, owner_user_id, household_a_id, 'Jamal', 'lion', 'jamal', '2018-04-12', true),
    (child_a2_id, owner_user_id, household_a_id, 'mazidat', 'mazi', null, '2021-09-03', true),
    (child_b1_id, family2_user_id, household_b_id, 'Zuri', 'Bennett', null, '2019-02-25', true)
  on conflict (id) do update
  set owner_id = excluded.owner_id,
      household_id = excluded.household_id,
      first_name = excluded.first_name,
      last_name = excluded.last_name,
      preferred_name = excluded.preferred_name,
      birth_date = excluded.birth_date,
      is_synthetic = excluded.is_synthetic;

  insert into public.vaccination_records (
    id, child_id, vaccine_name, dose_label, administered_on, notes, is_synthetic
  )
  values
    ('30000000-0000-4000-8000-000000000001', child_a1_id, 'Synthetic vaccine example A', 'Synthetic dose entry 1', '2018-05-12', 'Synthetic development data only. Not a real vaccination record or medical guidance.', true),
    ('30000000-0000-4000-8000-000000000002', child_a2_id, 'Synthetic vaccine example B', 'Synthetic dose entry 1', '2021-10-03', 'Synthetic development data only. Not a real vaccination record or medical guidance.', true),
    ('30000000-0000-4000-8000-000000000003', child_b1_id, 'Synthetic vaccine example C', 'Synthetic dose entry 1', '2019-03-25', 'Synthetic development data only. Not a real vaccination record or medical guidance.', true)
  on conflict (id) do update
  set child_id = excluded.child_id,
      vaccine_name = excluded.vaccine_name,
      dose_label = excluded.dose_label,
      administered_on = excluded.administered_on,
      notes = excluded.notes,
      is_synthetic = excluded.is_synthetic;

  insert into public.growth_measurements (
    id, child_id, measured_on, weight_kg, height_cm, notes, is_synthetic
  )
  values
    ('40000000-0000-4000-8000-000000000001', child_a1_id, '2026-06-10', 25.4, 124.2, 'Synthetic development measurement; not for clinical use.', true),
    ('40000000-0000-4000-8000-000000000002', child_a2_id, '2026-06-12', 17.1, 103.6, 'Synthetic development measurement; not for clinical use.', true),
    ('40000000-0000-4000-8000-000000000003', child_b1_id, '2026-06-15', 22.8, 118.4, 'Synthetic development measurement; not for clinical use.', true)
  on conflict (id) do update
  set child_id = excluded.child_id,
      measured_on = excluded.measured_on,
      weight_kg = excluded.weight_kg,
      height_cm = excluded.height_cm,
      notes = excluded.notes,
      is_synthetic = excluded.is_synthetic;

  insert into public.health_timeline_events (
    id, child_id, event_type, title, details, occurred_at, is_synthetic
  )
  values
    ('50000000-0000-4000-8000-000000000001', child_a1_id, 'synthetic_development', 'Synthetic check-in entry', 'This timeline item is fictional development data and contains no clinical advice.', '2026-06-10T09:00:00Z', true),
    ('50000000-0000-4000-8000-000000000002', child_a2_id, 'synthetic_development', 'Synthetic wellness-note placeholder', 'This timeline item is fictional development data and contains no clinical advice.', '2026-06-12T10:30:00Z', true),
    ('50000000-0000-4000-8000-000000000003', child_b1_id, 'synthetic_development', 'Synthetic timeline example', 'This timeline item is fictional development data and contains no clinical advice.', '2026-06-15T11:00:00Z', true)
  on conflict (id) do update
  set child_id = excluded.child_id,
      event_type = excluded.event_type,
      title = excluded.title,
      details = excluded.details,
      occurred_at = excluded.occurred_at,
      is_synthetic = excluded.is_synthetic;

  insert into public.appointments (
    id, child_id, title, provider_name, scheduled_at, status, notes, is_synthetic
  )
  values
    ('60000000-0000-4000-8000-000000000001', child_a1_id, 'Synthetic visit placeholder A', 'Example Community Clinic', now() + interval '14 days', 'scheduled', 'Fictional development appointment; not a medical recommendation.', true),
    ('60000000-0000-4000-8000-000000000002', child_a2_id, 'Synthetic visit placeholder B', 'Example Community Clinic', now() + interval '21 days', 'scheduled', 'Fictional development appointment; not a medical recommendation.', true),
    ('60000000-0000-4000-8000-000000000003', child_b1_id, 'Synthetic visit placeholder C', 'Example Community Clinic', now() + interval '30 days', 'scheduled', 'Fictional development appointment; not a medical recommendation.', true)
  on conflict (id) do update
  set child_id = excluded.child_id,
      title = excluded.title,
      provider_name = excluded.provider_name,
      scheduled_at = excluded.scheduled_at,
      status = excluded.status,
      notes = excluded.notes,
      is_synthetic = excluded.is_synthetic;

  insert into public.medical_documents (
    id, child_id, document_name, mime_type, storage_path, description, is_synthetic
  )
  values
    ('70000000-0000-4000-8000-000000000001', child_a1_id, 'synthetic-development-record-a.pdf', 'application/pdf', 'development-only/20000000-0000-4000-8000-000000000001/synthetic-record.pdf', 'Metadata placeholder only; no medical file is stored.', true),
    ('70000000-0000-4000-8000-000000000002', child_a2_id, 'synthetic-development-record-b.pdf', 'application/pdf', 'development-only/20000000-0000-4000-8000-000000000002/synthetic-record.pdf', 'Metadata placeholder only; no medical file is stored.', true),
    ('70000000-0000-4000-8000-000000000003', child_b1_id, 'synthetic-development-record-c.pdf', 'application/pdf', 'development-only/20000000-0000-4000-8000-000000000003/synthetic-record.pdf', 'Metadata placeholder only; no medical file is stored.', true)
  on conflict (id) do update
  set child_id = excluded.child_id,
      document_name = excluded.document_name,
      mime_type = excluded.mime_type,
      storage_path = excluded.storage_path,
      description = excluded.description,
      is_synthetic = excluded.is_synthetic;

  insert into public.notifications (id, user_id, child_id, title, message, is_synthetic)
  values
    ('80000000-0000-4000-8000-000000000001', owner_user_id, child_a1_id, 'Synthetic development notification', 'This is a fictional notification used for local development and QA.', true),
    ('80000000-0000-4000-8000-000000000002', parent_user_id, child_a2_id, 'Synthetic development notification', 'This is a fictional notification used for local development and QA.', true),
    ('80000000-0000-4000-8000-000000000003', caregiver_user_id, child_a1_id, 'Synthetic development notification', 'This is a fictional notification used for local development and QA.', true),
    ('80000000-0000-4000-8000-000000000004', family2_user_id, child_b1_id, 'Synthetic development notification', 'This is a fictional notification used for local development and QA.', true)
  on conflict (id) do update
  set user_id = excluded.user_id,
      child_id = excluded.child_id,
      title = excluded.title,
      message = excluded.message,
      is_synthetic = excluded.is_synthetic;
end
$seed$;
