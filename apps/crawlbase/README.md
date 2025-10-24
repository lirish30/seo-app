# Crawlbase

Full-stack SEO Analyzer SaaS built on Next.js 14, Tailwind, and shadcn/ui. Projects are created on demand: every submission validates the target URL, calls Google PageSpeed Insights for Core Web Vitals, and (when credentials are available) hits DataForSEO keyword + SERP endpoints to collect rankings, volume, CPC, difficulty, and competitive overlap. Results are written to a lightweight JSON datastore at `apps/crawlbase/data/projects.json`, keeping the experience cohesive without a background scheduler.

## Getting Started

1. Install dependencies from the repository root:

   ```bash
   npm install
   npm install --workspace apps/crawlbase
   ```

2. Create `apps/crawlbase/.env.local` with the required credentials:

   ```bash
   # Optional – only needed if you re-enable Supabase persistence
   NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
   NEXT_PUBLIC_SUPABASE_ANON_KEY=public-anon-key
   SUPABASE_SERVICE_ROLE_KEY=service-role-key
   DATAFORSEO_LOGIN=your-login
   DATAFORSEO_PASSWORD=your-password
   GOOGLE_PAGESPEED_API_KEY=your-pagespeed-key
   CRAWLBASE_SKIP_URL_VALIDATION=false
   ```

   > `DATAFORSEO_LOGIN`/`DATAFORSEO_PASSWORD` unlock live keyword + SERP data. When absent, the API falls back to deterministic mock values so the workflow remains usable in development. The PageSpeed API key is optional but recommended to avoid quota throttling.
   >
   > If you are developing behind a firewall or without outbound internet access, set `CRAWLBASE_SKIP_URL_VALIDATION=true`. The API will still validate URL structure but will no longer ping the domain before persisting a project, preventing local network errors from blocking development.

3. Start the development server:

   ```bash
   npm run dev --workspace apps/crawlbase
   ```

4. Visit [http://localhost:3000](http://localhost:3000) to open the marketing splash and jump into the dashboard.

## Core Workflow

1. **Create a project** — enter the site URL, keywords (one per line), and optional competitor URLs. The UI calls `POST /api/projects`.
2. **Backend aggregation** — the API validates the URL, runs PageSpeed Insights, calls DataForSEO Keyword Data + SERP endpoints, merges the payloads, and persists the normalized record.
3. **Dashboard overview** — `/dashboard` lists projects with score summaries, average rank, and competitor counts.
4. **Site health** — `/dashboard/projects/[id]` shows PageSpeed metrics, keyword highlights, and detected competitors. A “Sync data” button reruns the APIs instantly.
5. **Keyword explorer** — `/dashboard/projects/[id]/keywords` fetches stored keyword metrics and can request fresh SERP snapshots per keyword.
6. **Competitor comparison** — `/dashboard/projects/[id]/competitors` surfaces how often each domain appears across tracked SERPs.

All endpoints run on demand—there is no scheduler or queue. Refreshes simply call back into the external APIs using the stored project definition.

## Directory Guide

- `app/` – App Router routes for marketing, dashboard, and API handlers.
- `components/` – shadcn/ui primitives plus project-specific tables, forms, and nav.
- `lib/services/` – Google PageSpeed and DataForSEO client wrappers.
- `lib/server/` – Project orchestration layer and file-backed persistence helpers.
- `lib/types/` – Shared TypeScript interfaces for project records.
- `data/` – JSON datastore generated automatically when the first project is saved (git-ignored by default).

Supabase helpers and migrations remain in the repo for teams that want hosted persistence, but the default configuration relies on the local JSON store for quick iteration.

## Notes & Limitations

- API calls depend on external credentials and outbound network access. Errors are surfaced inline in the UI.
- Offline environments are tolerated: when the server cannot reach the target domain (or when `CRAWLBASE_SKIP_URL_VALIDATION=true`), the project API skips the remote validation step but still enforces basic URL formatting.
- Supabase helpers remain available but are optional; local JSON persistence works out of the box.
- `npm run typecheck` currently flags historical issues in Supabase/OpenAI helpers—unrelated to the new project pipeline.
- Edge functions under `supabase/functions/` are untouched and can be wired back in when migrating from the local store.
