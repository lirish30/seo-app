# SEO Analyzer

Minimal yet polished SEO analysis web app powered by DataForSEO and Kibo UI. Submit any public URL to receive actionable technical, content, performance, mobile, and social recommendations.

## Features
- Full-stack TypeScript (Node.js + Express backend, React + Vite frontend)
- DataForSEO On-Page API integration with graceful polling and error handling
- Local HTML heuristics for meta tags, links, accessibility, and infrastructure checks
- Category scores, Top 5 Fixes, detailed pass/fail checklist, and export to JSON/PDF
- Styled entirely with a lightweight, Kibo UI-inspired component kit bundled in the repo (no extra npm install required)
- Responsive layout with light/dark support via `KiboProvider`

## Prerequisites
- Node.js 18+
- DataForSEO account with On-Page API access  
  Create an account and generate credentials at: [https://app.dataforseo.com](https://app.dataforseo.com)

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file at the project root:
   ```bash
   cp .env.example .env
   ```

3. Update `.env` with your DataForSEO credentials:
   ```
   DATAFORSEO_LOGIN=your_login
   DATAFORSEO_PASSWORD=your_password
   PORT=5173
   BACKEND_PORT=5051
   ```

## Development
Run backend and frontend concurrently:
```bash
npm run dev
```
- Frontend: http://localhost:5173  
- Backend API: http://localhost:5051

## Build & Serve
```bash
npm run build
npm run start
```
The build step compiles the Express server and Vite frontend. `npm run start` launches the production server on `BACKEND_PORT`.

## Project Structure
```
root/
 ├── server/            # Express + DataForSEO integration
 ├── web/               # React + Vite client (Kibo UI)
 ├── .env.example       # Environment variable template
 └── README.md
```

## Testing The Analyzer
1. Start the dev environment.
2. Enter a publicly accessible URL (e.g., https://www.example.com).
3. Review the generated scores, top fixes, and detailed checks.
4. Use “Download JSON” or “Export PDF” for shareable reports.

## Troubleshooting
- **401/403 errors**: Double-check DataForSEO credentials and account quota.
- **Task timeouts**: The On-Page crawl may need up to two minutes for large pages; re-run if necessary.
- **Blocked HTML fetch**: Ensure the target site allows standard user agents and isn’t behind authentication.

## License
MIT
