# NIMORA

NIMORA is a digital child-health management platform for parents and guardians. This repository is the Next.js App Router foundation.

## Stack

- Next.js (App Router), React, TypeScript (strict)
- Tailwind CSS v4 with brand tokens in `src/styles/tokens.css`
- Supabase (`@supabase/supabase-js`, `@supabase/ssr`) for auth and PostgreSQL
- Zod for validation, React Hook Form with `@hookform/resolvers`
- Recharts, Lucide React, Framer Motion

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env.local` from the template and fill in your Supabase project values:

   ```bash
   cp .env.example .env.local
   ```

3. Start the dev server:

   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` - start the development server
- `npm run build` - production build
- `npm run start` - serve the production build
- `npm run lint` - run ESLint
- `npm run db:seed:test` - create/refresh approved development test accounts and synthetic data through Supabase Admin API
- `npm run dev:login:print` - print hosted or local development login setup instructions

See [docs/TEST_ACCOUNTS.md](./docs/TEST_ACCOUNTS.md) for hosted Supabase setup, SQL Editor migrations and fixture scripts, seed details, and authorization checks. SQL files are in `supabase/`.

## Environment

See `.env.example`. `NEXT_PUBLIC_*` values are exposed to the browser. `SUPABASE_SERVICE_ROLE_KEY` is server-only and must never be imported into client code or prefixed with `NEXT_PUBLIC_`.

## Project Structure

- `src/app` - routes, layout, and error boundary
- `src/config` - brand identity constants
- `src/lib/supabase` - Supabase browser client, server client, env validation, and `Database` types
- `src/styles` - brand color tokens
