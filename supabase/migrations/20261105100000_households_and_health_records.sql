create table public.households (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(btrim(name)) between 1 and 100),
  created_by uuid not null references auth.users (id) on delete cascade,
  is_synthetic boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.household_memberships (
  household_id uuid not null references public.households (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role text not null check (role in ('owner', 'parent', 'caregiver')),
  added_by uuid not null references auth.users (id) on delete restrict,
  created_at timestamptz not null default now(),
  primary key (household_id, user_id)
);

alter table public.children
  add column household_id uuid references public.households (id) on delete cascade,
  add column is_synthetic boolean not null default false;

create index household_memberships_user_id_idx on public.household_memberships (user_id);
create index children_household_id_idx on public.children (household_id);

create table public.vaccination_records (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.children (id) on delete cascade,
  vaccine_name text not null check (char_length(btrim(vaccine_name)) between 1 and 120),
  dose_label text not null check (char_length(btrim(dose_label)) between 1 and 80),
  administered_on date not null,
  notes text not null default '',
  is_synthetic boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.growth_measurements (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.children (id) on delete cascade,
  measured_on date not null,
  weight_kg numeric(5, 2) not null check (weight_kg > 0 and weight_kg <= 200),
  height_cm numeric(5, 2) not null check (height_cm > 0 and height_cm <= 250),
  notes text not null default '',
  is_synthetic boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.health_timeline_events (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.children (id) on delete cascade,
  event_type text not null check (char_length(btrim(event_type)) between 1 and 80),
  title text not null check (char_length(btrim(title)) between 1 and 160),
  details text not null default '',
  occurred_at timestamptz not null,
  is_synthetic boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.children (id) on delete cascade,
  title text not null check (char_length(btrim(title)) between 1 and 160),
  provider_name text not null check (char_length(btrim(provider_name)) between 1 and 120),
  scheduled_at timestamptz not null,
  status text not null default 'scheduled'
    check (status in ('scheduled', 'completed', 'cancelled')),
  notes text not null default '',
  is_synthetic boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.medical_documents (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.children (id) on delete cascade,
  document_name text not null check (char_length(btrim(document_name)) between 1 and 160),
  mime_type text not null check (char_length(btrim(mime_type)) between 1 and 120),
  storage_path text not null check (char_length(btrim(storage_path)) between 1 and 500),
  description text not null default '',
  uploaded_at timestamptz not null default now(),
  is_synthetic boolean not null default false
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  child_id uuid references public.children (id) on delete cascade,
  title text not null check (char_length(btrim(title)) between 1 and 160),
  message text not null check (char_length(btrim(message)) between 1 and 500),
  read_at timestamptz,
  created_at timestamptz not null default now(),
  is_synthetic boolean not null default false
);

create index vaccination_records_child_id_idx on public.vaccination_records (child_id);
create index growth_measurements_child_id_idx on public.growth_measurements (child_id);
create index health_timeline_events_child_id_idx on public.health_timeline_events (child_id);
create index appointments_child_id_idx on public.appointments (child_id);
create index medical_documents_child_id_idx on public.medical_documents (child_id);
create index notifications_user_id_idx on public.notifications (user_id);
create index notifications_child_id_idx on public.notifications (child_id);

create function public.touch_household_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger households_touch_updated_at
before update on public.households
for each row execute function public.touch_household_updated_at();

create or replace function public.is_household_member(
  target_household_id uuid,
  allowed_roles text[]
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.household_memberships as membership
    where membership.household_id = target_household_id
      and membership.user_id = (select auth.uid())
      and membership.role = any (allowed_roles)
  );
$$;

create or replace function public.can_access_child(target_child_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.children as child
    where child.id = target_child_id
      and (
        child.owner_id = (select auth.uid())
        or exists (
          select 1
          from public.child_memberships as membership
          where membership.child_id = child.id
            and membership.user_id = (select auth.uid())
        )
        or public.is_household_member(
          child.household_id,
          array['owner', 'parent', 'caregiver']::text[]
        )
      )
  );
$$;

create function public.can_manage_child(target_child_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.children as child
    where child.id = target_child_id
      and (
        child.owner_id = (select auth.uid())
        or public.is_household_member(
          child.household_id,
          array['owner', 'parent']::text[]
        )
      )
  );
$$;

drop policy "Guardians can create owned child profiles" on public.children;
create policy "Guardians can create owned child profiles"
on public.children for insert to authenticated
with check (
  owner_id = (select auth.uid())
  and (
    household_id is null
    or public.is_household_member(household_id, array['owner']::text[])
  )
);

drop policy "Guardians can update owned child profiles" on public.children;
create policy "Guardians can update owned child profiles"
on public.children for update to authenticated
using (owner_id = (select auth.uid()))
with check (
  owner_id = (select auth.uid())
  and (
    household_id is null
    or public.is_household_member(household_id, array['owner']::text[])
  )
);

alter table public.households enable row level security;
alter table public.household_memberships enable row level security;
alter table public.vaccination_records enable row level security;
alter table public.growth_measurements enable row level security;
alter table public.health_timeline_events enable row level security;
alter table public.appointments enable row level security;
alter table public.medical_documents enable row level security;
alter table public.notifications enable row level security;

create policy "Household members can read their households"
on public.households for select to authenticated
using (public.is_household_member(id, array['owner', 'parent', 'caregiver']::text[]));

create policy "Members can read household memberships"
on public.household_memberships for select to authenticated
using (
  user_id = (select auth.uid())
  or public.is_household_member(household_id, array['owner']::text[])
);

create policy "Household members can read vaccination records"
on public.vaccination_records for select to authenticated
using (public.can_access_child(child_id));
create policy "Guardians can manage vaccination records"
on public.vaccination_records for all to authenticated
using (public.can_manage_child(child_id))
with check (public.can_manage_child(child_id));

create policy "Household members can read growth measurements"
on public.growth_measurements for select to authenticated
using (public.can_access_child(child_id));
create policy "Guardians can manage growth measurements"
on public.growth_measurements for all to authenticated
using (public.can_manage_child(child_id))
with check (public.can_manage_child(child_id));

create policy "Household members can read health timelines"
on public.health_timeline_events for select to authenticated
using (public.can_access_child(child_id));
create policy "Guardians can manage health timelines"
on public.health_timeline_events for all to authenticated
using (public.can_manage_child(child_id))
with check (public.can_manage_child(child_id));

create policy "Household members can read appointments"
on public.appointments for select to authenticated
using (public.can_access_child(child_id));
create policy "Guardians can manage appointments"
on public.appointments for all to authenticated
using (public.can_manage_child(child_id))
with check (public.can_manage_child(child_id));

create policy "Household members can read medical documents"
on public.medical_documents for select to authenticated
using (public.can_access_child(child_id));
create policy "Guardians can manage medical documents"
on public.medical_documents for all to authenticated
using (public.can_manage_child(child_id))
with check (public.can_manage_child(child_id));

create policy "Users can read their notifications"
on public.notifications for select to authenticated
using (
  user_id = (select auth.uid())
  and (child_id is null or public.can_access_child(child_id))
);

revoke all on function public.touch_household_updated_at() from public, anon, authenticated;
revoke all on function public.is_household_member(uuid, text[]) from public, anon;
revoke all on function public.can_access_child(uuid) from public, anon;
revoke all on function public.can_manage_child(uuid) from public, anon;
grant execute on function public.is_household_member(uuid, text[]) to authenticated;
grant execute on function public.can_access_child(uuid) to authenticated;
grant execute on function public.can_manage_child(uuid) to authenticated;

revoke all on public.households from anon;
revoke all on public.household_memberships from anon;
revoke all on public.vaccination_records from anon;
revoke all on public.growth_measurements from anon;
revoke all on public.health_timeline_events from anon;
revoke all on public.appointments from anon;
revoke all on public.medical_documents from anon;
revoke all on public.notifications from anon;

grant select on public.households to authenticated;
grant select on public.household_memberships to authenticated;
grant select, insert, update, delete on public.vaccination_records to authenticated;
grant select, insert, update, delete on public.growth_measurements to authenticated;
grant select, insert, update, delete on public.health_timeline_events to authenticated;
grant select, insert, update, delete on public.appointments to authenticated;
grant select, insert, update, delete on public.medical_documents to authenticated;
grant select on public.notifications to authenticated;

grant all on public.profiles to service_role;
grant all on public.households to service_role;
grant all on public.household_memberships to service_role;
grant all on public.children to service_role;
grant all on public.vaccination_records to service_role;
grant all on public.growth_measurements to service_role;
grant all on public.health_timeline_events to service_role;
grant all on public.appointments to service_role;
grant all on public.medical_documents to service_role;
grant all on public.notifications to service_role;
