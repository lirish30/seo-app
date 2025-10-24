# Crawlbase Monorepo

Modern SEO intelligence platform built as a monorepo with a legacy Vite prototype and a new Next.js 14 SaaS application. Crawlbase combines technical audits, keyword tracking, competitor benchmarking, content intelligence, backlink monitoring, and AI-assisted issue remediation.    

## Project Layout

```
seo-app/
├── README.md                # This document
├── package.json             # Root npm workspaces
├── server/                  # Legacy Express server (DataForSEO proxy for prototype)
├── web/                     # Legacy React + Vite client
└── apps/
    └── crawlbase/           # Next.js 14 App Router implementation (current focus)
```

### Apps

#### `apps/crawlbase`
Next.js 14 App Router app with TypeScript, TailwindCSS, ShadCN/UI, Supabase, DataForSEO, and OpenAI integrations.

- `app/` – App Router routes (`/dashboard`, `/dashboard/audit/[domain]`, `/dashboard/keywords`, etc.), API handlers, and shared layouts.
- `components/` – Reusable ShadCN components plus feature modules (Technical Explorer, Site Health, charts, etc.).
- `lib/` – Supabase typed clients, DataForSEO parsing utilities, OpenAI helpers, mock data, and admin utilities.
- `supabase/` – SQL migrations and Edge Functions (`recheck`, `ai-summary`).
- `.env.example` – Environment variable template.

#### Legacy `web` + `server`
- `web/` – Previous Vite + React client with Kibo UI components.
- `server/` – Express backend proxying DataForSEO for the legacy analyzer.
- `README.web.md` (coming soon) – archive instructions for reference once the Next.js app fully replaces the prototype.

## Architecture Overview

- **Frontend**: Next.js 14 with App Router, Server Components, and Client Components for interactive dashboards. TailwindCSS + ShadCN UI provide design primitives. Recharts handles data visualization.
- **Backend**: Supabase Postgres for persistence (audits, issues, keywords, competitors, backlinks, etc.) with Edge Functions for asynchronous workflows.
- **Integrations**:
  - DataForSEO OnPage, Rank Tracking, Competitor, Backlinks, and Content APIs.
  - OpenAI for AI summaries and content suggestions.
- **Deployment**: Vercel (frontend) + Supabase platform.
- **Authentication**: Supabase Auth helpers (browser + server) with support for anonymous mock data mode in development.
- **AI & Automation**: Edge Function `/api/ai-summary` wraps OpenAI for SEO issue explanations. `/api/recheck` queues DataForSEO re-crawls.

## Getting Started (Crawlbase)

1. Install dependencies:
   ```bash
   npm install
   npm install --workspace apps/crawlbase
   ```

2. Provide environment variables:
   ```bash
   cp apps/crawlbase/.env.example apps/crawlbase/.env
   ```
   Fill in:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `OPENAI_API_KEY`
   - `DATAFORSEO_LOGIN` / `DATAFORSEO_PASSWORD`

   During local preview with mock data, placeholders are safe—the Supabase helpers fall back to local defaults and warn if real keys are missing.

3. Run the Next.js app (choose an open port if 3000 is blocked):
   ```bash
   npm run dev --workspace apps/crawlbase -- --port 3001
   ```
   Visit `http://localhost:3001`.

4. Optional: run the legacy stack
   ```bash
   npm run dev --workspace web
   npm run dev --workspace server
   ```

## Key Dashboard Routes

| Route | Module | Highlights |
|-------|--------|------------|
| `/dashboard` | Overview | Health score cards, keyword charts, competitor summaries, backlink trends. |
| `/dashboard/audit/[domain]` | Site Health | Core Web Vitals, issue distribution, critical issue table. |
| `/dashboard/technical-explorer` | Technical Issue Explorer | Interactive issue list, drill-down drawer, trend chart, fix history. |
| `/dashboard/keywords` | Keyword & SERP Tracker | Ranking trends, competitor comparisons, SERP analytics. |
| `/dashboard/competitors` | Competitor Analysis | Tabs for overview, keyword gap, backlink comparisons. |
| `/dashboard/content/[pageId]` | Content Intelligence | Content scoring, topic clusters, AI suggestions. |
| `/dashboard/backlinks` | Backlink Monitor | Donut chart distribution, growth trend, toxic link table. |

## Supabase Schema

Migration `apps/crawlbase/supabase/migrations/202406010001_initial_schema.sql` provisions tables:

- `users`, `projects`, `settings`
- `audits`, `audit_issues`
- `issues`, `issue_pages`, `fix_logs`
- `keywords`, `rankings`
- `competitors`, `competitor_audits`, `competitor_keywords`, `competitor_backlinks`
- `content_scores`
- `backlinks`, `backlink_trends`, `toxic_links`

Indexes target `project_id`, `created_at`, `severity`, and status columns to optimize dashboard queries.

## Edge Functions

Located in `apps/crawlbase/supabase/functions/`:

- `recheck`: Calls DataForSEO OnPage API to re-crawl selected URLs.
- `ai-summary`: Summarizes issues using OpenAI (expects JSON response with summary + recommendations).

Deploy via Supabase CLI after configuring credentials.

## Development Tips

- Many dashboard modules still read from `lib/mock-data.ts`. Replace with Supabase queries when your database is seeded.
- Supabase helpers (`lib/supabase-browser.ts`, `lib/supabase-server.ts`) fall back to localhost credentials, allowing mock usage without breaking the UI.
- Charts rely on client components—remember to include `"use client"` when adding components that use hooks.
- The root `README.md` covers the new architecture; the previous Vite/Express instructions now live inside `web/` or `server/` as historical context.

## Testing & Linting

- Type check: `npm run typecheck --workspace apps/crawlbase`
- Lint (after configuring ESLint): `npm run lint --workspace apps/crawlbase`
- We recommend story-focused manual verification since many modules use mocked data.

## Roadmap

1. Replace mock data with Supabase queries + RLS policies.
2. Integrate Supabase Auth flows for sign-in/sign-up.
3. Wire DataForSEO tasks to scheduled crawls and store results.
4. Implement billing and plan limits (Stripe).
5. Expand AI workflows for automated fix recommendations.

## License

MIT (see root license terms).
