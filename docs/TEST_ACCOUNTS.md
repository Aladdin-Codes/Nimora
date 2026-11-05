# Development test accounts

These accounts and records are fictional, private development fixtures. They are not public accounts and must never be created in production.

| Email | Intended role | Household |
| --- | --- | --- |
| `owner@example.com` | Owner | Synthetic development household A |
| `parent@example.com` | Parent | Synthetic development household A |
| `caregiver@example.com` | Read-only caregiver | Synthetic development household A |
| `family2@example.com` | Separate household owner | Synthetic development household B |

All four accounts use the password supplied in `SEED_TEST_PASSWORD`; there is no shared/default password in the repository. Choose a private password of at least 12 characters. The seeder resets these four users to that password on each run and marks their email addresses confirmed.

## Local Supabase setup

1. Install Docker Desktop and the Supabase CLI, then start the local Supabase stack from the repository root:

   ```powershell
   npx supabase start
   ```

2. Copy `.env.example` to `.env.local` and set the local API values printed by `supabase start`:

   ```dotenv
   NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<local-publishable-key>
   SUPABASE_SERVICE_ROLE_KEY=<local-service-role-or-secret-key>
   SEED_ENVIRONMENT=development
   SEED_TEST_PASSWORD=<your-private-local-test-password>
   ```

   `.env.local` is git-ignored. Keep `SUPABASE_SERVICE_ROLE_KEY` server-side; never add a `NEXT_PUBLIC_` prefix or use it in browser code.

3. Apply migrations to the local database and create/refresh the accounts and data:

   ```powershell
   npx supabase db reset
   npm run db:seed:test
   ```

   If the local database is already migrated, `npx supabase migration up` can be used instead of `db reset` to preserve its contents. `db reset` recreates the local database and applies all migrations.

4. Sign in through the app at `http://localhost:3000` using one of the emails above and the locally configured `SEED_TEST_PASSWORD`.

The seed is repeatable: auth users are listed before any create call, existing users are refreshed by their existing auth ID, and all relational fixtures use stable UUIDs and upserts. Future appointment timestamps are recalculated on each run. Each fixture row has `is_synthetic = true`; document rows are metadata placeholders and no files are uploaded.

## Remote development projects

Local Supabase URLs are the default and safest target. Seeding any remote project requires all of the following:

- `SEED_ENVIRONMENT=development`
- `SEED_ALLOW_REMOTE_DEV=true`
- `SEED_ALLOWED_PROJECT_REF` set to the exact, independently verified non-production project reference
- `NODE_ENV` must not be `production`

The URL must be HTTPS and its Supabase project reference must exactly match the allowlist. Do not configure production project values in this workflow. The seeder refuses other targets by default.

## Authorization expectations

- Owners can read their household and child data and can manage child health records.
- Parents can read the household and child data, and can add/update household health records.
- Caregivers can read records for their own household but cannot modify them or see another household.
- Household memberships are read-only to authenticated clients. No client can insert a membership or update its role to elevate itself.
- Anonymous clients cannot read child or health data.
- Notifications are visible only to their addressed user, subject to access to the related child.

`npm run db:seed:test` executes the live checks after seeding. It tests login for all four accounts; profile and membership associations; household and child isolation; parent write access; caregiver read-only access; anonymous denial; and attempts to self-grant or self-elevate a role. A successful run requires a reachable Supabase instance with all migrations applied.

Vaccination names, measurements, timeline events, appointments, and notifications are artificial examples. They are explicitly marked synthetic and are not Nigerian medical guidance or clinical recommendations.
