create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '' check (char_length(full_name) <= 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.children (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  first_name text not null check (char_length(btrim(first_name)) between 1 and 80),
  last_name text not null check (char_length(btrim(last_name)) between 1 and 80),
  preferred_name text check (preferred_name is null or char_length(preferred_name) <= 80),
  birth_date date not null check (birth_date <= current_date),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.child_memberships (
  child_id uuid not null references public.children (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  member_email text not null check (member_email = lower(btrim(member_email))),
  role text not null default 'caregiver' check (role = 'caregiver'),
  created_by uuid not null references auth.users (id) on delete restrict,
  created_at timestamptz not null default now(),
  primary key (child_id, user_id)
);

create table public.child_invitations (
  token uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.children (id) on delete cascade,
  invite_email text not null check (
    invite_email = lower(btrim(invite_email))
    and position('@' in invite_email) > 1
    and char_length(invite_email) <= 320
  ),
  invited_by uuid not null references auth.users (id) on delete cascade,
  expires_at timestamptz not null default (now() + interval '7 days'),
  accepted_at timestamptz,
  created_at timestamptz not null default now()
);

create index children_owner_id_idx on public.children (owner_id);
create index child_memberships_user_id_idx on public.child_memberships (user_id);
create index child_invitations_child_id_idx on public.child_invitations (child_id);

create function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_touch_updated_at
before update on public.profiles
for each row execute function public.touch_updated_at();

create trigger children_touch_updated_at
before update on public.children
for each row execute function public.touch_updated_at();

create function public.create_profile_for_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    left(coalesce(new.raw_user_meta_data ->> 'full_name', ''), 100)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.create_profile_for_new_user();

create function public.owns_child(target_child_id uuid)
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
      and child.owner_id = (select auth.uid())
  );
$$;

create function public.can_access_child(target_child_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select public.owns_child(target_child_id)
    or exists (
      select 1
      from public.child_memberships as membership
      where membership.child_id = target_child_id
        and membership.user_id = (select auth.uid())
    );
$$;

create function public.accept_child_invitation(invitation_token uuid)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  current_email text;
  email_is_confirmed boolean;
  invitation public.child_invitations%rowtype;
begin
  if current_user_id is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;

  select lower(user_record.email), user_record.email_confirmed_at is not null
    into current_email, email_is_confirmed
  from auth.users as user_record
  where user_record.id = current_user_id;

  if current_email is null or not email_is_confirmed then
    raise exception 'A verified email address is required' using errcode = '42501';
  end if;

  select * into invitation
  from public.child_invitations as candidate
  where candidate.token = invitation_token
    and candidate.invite_email = current_email
    and candidate.accepted_at is null
    and candidate.expires_at > now()
  for update;

  if not found then
    raise exception 'Invitation is invalid or expired' using errcode = '22023';
  end if;

  if invitation.invited_by = current_user_id then
    raise exception 'The inviter cannot accept their own invitation' using errcode = '22023';
  end if;

  insert into public.child_memberships (child_id, user_id, member_email, role, created_by)
  values (invitation.child_id, current_user_id, current_email, 'caregiver', invitation.invited_by)
  on conflict (child_id, user_id) do nothing;

  update public.child_invitations
  set accepted_at = now()
  where token = invitation.token;

  return invitation.child_id;
end;
$$;

alter table public.profiles enable row level security;
alter table public.children enable row level security;
alter table public.child_memberships enable row level security;
alter table public.child_invitations enable row level security;

create policy "Users can read their own profile"
on public.profiles for select to authenticated
using (id = (select auth.uid()));

create policy "Users can update their own profile"
on public.profiles for update to authenticated
using (id = (select auth.uid()))
with check (id = (select auth.uid()));

create policy "Members can read accessible child profiles"
on public.children for select to authenticated
using (public.can_access_child(id));

create policy "Guardians can create owned child profiles"
on public.children for insert to authenticated
with check (owner_id = (select auth.uid()));

create policy "Guardians can update owned child profiles"
on public.children for update to authenticated
using (owner_id = (select auth.uid()))
with check (owner_id = (select auth.uid()));

create policy "Guardians can delete owned child profiles"
on public.children for delete to authenticated
using (owner_id = (select auth.uid()));

create policy "Users and guardians can read child memberships"
on public.child_memberships for select to authenticated
using (user_id = (select auth.uid()) or public.owns_child(child_id));

create policy "Guardians can remove child memberships"
on public.child_memberships for delete to authenticated
using (public.owns_child(child_id) or user_id = (select auth.uid()));

create policy "Guardians can read child invitations"
on public.child_invitations for select to authenticated
using (public.owns_child(child_id));

create policy "Guardians can create child invitations"
on public.child_invitations for insert to authenticated
with check (
  invited_by = (select auth.uid())
  and public.owns_child(child_id)
  and accepted_at is null
  and expires_at > now()
  and expires_at <= now() + interval '7 days'
);

create policy "Guardians can delete pending child invitations"
on public.child_invitations for delete to authenticated
using (public.owns_child(child_id) and accepted_at is null);

revoke all on function public.touch_updated_at() from public, anon, authenticated;
revoke all on function public.create_profile_for_new_user() from public, anon, authenticated;
revoke all on function public.owns_child(uuid) from public, anon;
revoke all on function public.can_access_child(uuid) from public, anon;
revoke all on function public.accept_child_invitation(uuid) from public, anon;
grant execute on function public.owns_child(uuid) to authenticated;
grant execute on function public.can_access_child(uuid) to authenticated;
grant execute on function public.accept_child_invitation(uuid) to authenticated;

revoke all on public.profiles from anon;
revoke all on public.children from anon;
revoke all on public.child_memberships from anon;
revoke all on public.child_invitations from anon;
grant select, update on public.profiles to authenticated;
grant select, insert, update, delete on public.children to authenticated;
grant select, delete on public.child_memberships to authenticated;
grant select, insert, delete on public.child_invitations to authenticated;
