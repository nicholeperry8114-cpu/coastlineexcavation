# Coastline Excavation CRM

Internal CRM and job management system for Coastline Excavation.

## Stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- Supabase Database, Auth, and Storage
- Vercel deployment

## Workflow

Lead -> Proposal -> Job -> Invoice

## Local setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env.local` from `.env.example`:

   ```bash
   cp .env.example .env.local
   ```

3. Fill in:

   ```text
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   SUPABASE_SERVICE_ROLE_KEY=
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

4. Apply the Supabase migration:

   ```bash
   supabase db push
   ```

5. Seed demo CRM data:

   ```bash
   supabase db reset
   ```

6. Run the app:

   ```bash
   npm run dev
   ```

## Supabase

The initial schema is in:

```text
supabase/migrations/0001_initial_schema.sql
```

It creates:

- Admin profiles linked to Supabase Auth
- Leads and lead attachments
- Proposals and proposal line items
- Jobs
- Invoices and invoice line items
- Activity events
- Auto-numbering sequences for leads, proposals, jobs, and invoices
- RLS policies for authenticated admins
- Private `lead-attachments` Storage bucket and policies

Seed data is in:

```text
supabase/seed.sql
```

## Authentication

Internal admins sign in at:

```text
/login
```

Create admin users in Supabase Auth. A profile row is created automatically by the database trigger.

## Public pages

- `/intake` public lead intake form
- `/proposal/[token]` public proposal approval page
- `/invoice/[token]` public printable invoice page

Public pages use secure token lookups through server-side Supabase service-role access; CRM tables are not directly exposed to anonymous clients.

## Deployment

Deploy to Vercel and configure the same environment variables listed in `.env.example`.
