# Crawlbase

Modular SEO intelligence platform scaffold built with Next.js 14 App Router, Tailwind, ShadCN UI components, Supabase, DataForSEO, and OpenAI integrations. The project ships with mock data to explore the dashboard experience while backend integrations are wired through Supabase Edge Functions.

## Getting Started

1. Install dependencies from the repository root:

   ```bash
   npm install
   npm install --workspace apps/crawlbase
   ```

2. Create an `.env` file in `apps/crawlbase` based on `.env.example` and supply the API keys for Supabase, OpenAI, and DataForSEO.

3. Run the development server:

   ```bash
   npm run dev --workspace apps/crawlbase
   ```

4. Open [http://localhost:3000](http://localhost:3000) to load the dashboard shell with mock data.

## Directory Overview

- `app/` – App Router routes covering dashboard modules, API routes, and shared layouts.
- `components/` – ShadCN-derived UI components and dashboard-specific composables.
- `lib/` – Supabase clients, parsing utilities, OpenAI helpers, and mock data.
- `supabase/` – SQL migrations and Edge Functions (`recheck`, `ai-summary`).

## Supabase

- Apply the migration in `supabase/migrations/202406010001_initial_schema.sql` to provision all tables.
- Deploy the Edge Functions after configuring `DATAFORSEO_*` and `OPENAI_API_KEY`.
- The Next.js API routes call Supabase Functions to queue re-audits and AI summaries.

## DataForSEO & OpenAI

- `lib/dataforseo.ts` and `lib/parseOnPage.ts` convert OnPage API output into issue records.
- Edge functions handle re-crawls and AI summary generation using service credentials.

## Next Steps

- Replace mock data fetches with Supabase queries using RLS policies per plan tier.
- Implement authentication flows with Supabase Auth helpers in the layout.
- Wire keyword, competitor, and backlink modules to live DataForSEO endpoints.
- Add Stripe billing workflow per monetization model once core experience is validated.
