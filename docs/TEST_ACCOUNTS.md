# Supabase setup and development fixtures

This guide configures NIMORA against a hosted Supabase project. Docker and the local Supabase stack are not required. Use only a project you have independently confirmed is non-production when creating test users or loading synthetic fixtures.

## 1. Create or select a development project

1. Sign in to the Supabase dashboard.
2. Create a dedicated project for development/QA, or select an existing project that you have confirmed is not production.
3. Keep the database password and any secret/service-role keys private. Do not paste them into source files, browser code, chat, or issue trackers.

## 2. Configure Supabase Auth

In the project dashboard, open **Authentication → URL Configuration**:

1. Set the site URL to `http://localhost:3000` for local app development.
2. Add `http://localhost:3000/**` and `http://127.0.0.1:3000/**` to the redirect URL allowlist if the dashboard offers wildcard URLs. Otherwise add the exact callback URL used by the app: `http://localhost:3000/callback`.
3. For a development project, email confirmation may be disabled for convenient local sign-up. If confirmation is enabled, users created manually in the dashboard must be confirmed before password sign-in succeeds.
4. Do not disable RLS or add permissive policies to make the app work.

The existing profile trigger in the first migration creates a `public.profiles` row for users created through Supabase Auth.

## 3. Apply the database migrations

The repository migrations define the schema, grants, triggers, and RLS policies. Apply them in timestamp order using the Supabase dashboard's **SQL Editor**:

1. Open [20261105090000_guardian_children_and_rls.sql](../supabase/migrations/20261105090000_guardian_children_and_rls.sql).
2. Copy its full contents into a new SQL Editor query and run it.
3. After it succeeds, open [20261105100000_households_and_health_records.sql](../supabase/migrations/20261105100000_households_and_health_records.sql).
4. Copy its full contents into another SQL Editor query and run it.

Run each migration once per database. If a query reports an error, stop and resolve it before applying the next file; do not rerun only selected statements or edit policies ad hoc. These migration files are the authoritative schema for this repository.

## 4. Configure the app

Copy `.env.example` to `.env.local` in the project root and fill in the hosted project's **Project URL** and **publishable key** from **Project Settings → API Keys** (the exact menu label may vary):

```dotenv
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<publishable-key>
```

Only the URL and publishable/anon key belong in `NEXT_PUBLIC_*` variables. Standard login does not need a service-role key. Keep `SUPABASE_SERVICE_ROLE_KEY` blank unless running the separately documented seed CLI; if used, it must remain server-side and must never be exposed to browser code.

Restart the app after editing environment values:

```powershell
npm run dev
```

Open `http://localhost:3000/login`.

## 5. Create and test a login

For a single manual test user:

1. In the dashboard open **Authentication → Users → Add user → Create new user**.
2. Enter an email and a private password, and select **Auto Confirm User** (or confirm the user after creation).
3. Save the user.
4. Sign in at `/login` using the same project's URL/key in `.env.local`.
5. Verify the user appears in **Authentication → Users** and that a matching profile row was created in `public.profiles`.

Do not treat example addresses as pre-created accounts. Account creation is a dashboard action unless you deliberately run the development seeder below.

## 6. Optional synthetic household and health fixtures

The SQL fixture script uses these confirmed Auth users:

| Email | Intended role | Household |
| --- | --- | --- |
| `owner@example.com` | Owner | Synthetic development household A |
| `parent@example.com` | Parent/guardian | Synthetic development household A |
| `caregiver@example.com` | Read-only caregiver | Synthetic development household A |
| `family2@example.com` | Separate household owner | Synthetic development household B |

Create and confirm all four users in **Authentication → Users** before continuing. Choose private passwords; this SQL script neither reads nor sets passwords.

Then, only in your verified non-production project:

1. Open [seed.sql](../supabase/seed.sql), copy its full contents into a new dashboard SQL Editor query, and run it.
2. Open [verify_setup.sql](../supabase/verify_setup.sql), copy its full contents into another SQL Editor query, and run it.
3. Review the query results for all four confirmed users, their profiles and household memberships, enabled RLS, and synthetic rows.

The fixture script is repeatable and uses stable IDs/upserts. It inserts only into the app's public tables; it never creates Auth users, changes RLS, or fabricates clinical guidance. All health fixtures are explicitly synthetic and are not real records or Nigerian medical recommendations. Document fixtures are metadata placeholders, not uploaded files.

### Optional API-based seeder

The repository also has `npm run db:seed:test`. Unlike `seed.sql`, this script uses the Supabase Admin API and resets the four test users' passwords from `SEED_TEST_PASSWORD`. It requires `SUPABASE_SERVICE_ROLE_KEY`, a private password, and explicit remote-development allowlisting:

- `SEED_ENVIRONMENT=development`
- `SEED_ALLOW_REMOTE_DEV=true`
- `SEED_ALLOWED_PROJECT_REF` equal to the exact non-production project reference

The script refuses production and unapproved remote projects. Do not run it unless you are certain the configured project is non-production. Never add the service-role key to a `NEXT_PUBLIC_*` variable.

## 7. Check authorization and isolation

The second migration installs policies for household and child isolation. Use the app while signed in as the owner, parent, caregiver, and separate-household owner to verify expected access. The API seeder's `npm run db:seed:test` performs automated RLS checks when configured for a permitted target. Running [verify_setup.sql](../supabase/verify_setup.sql) inspects policy presence and RLS flags, but does not itself simulate end-user access; SQL Editor runs with elevated database privileges.

Expected behavior:

- Household A's owner, parent, and caregiver can read Household A records.
- The caregiver cannot modify health records under the configured policies.
- Household A members cannot read Household B records.
- Anonymous users cannot read private records.
- Authenticated users cannot grant themselves household roles; membership writes are not granted to client roles.

If any check fails, do not weaken RLS. Review the migration and project configuration.

## Optional local-only Dev login

The **Dev login** button is only for local Supabase, requires Docker or Podman, and is unavailable for hosted projects. Since this guide uses hosted Supabase, keep `DEV_AUTH_BYPASS=false`; use a dashboard-created user instead.
