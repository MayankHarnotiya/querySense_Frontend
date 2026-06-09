# QuerySense — Frontend

The web client for **QuerySense**, an AI-powered natural-language-to-SQL analytics
platform. Ask a question in plain English, and the backend turns it into safe,
validated, read-only SQL, runs it, and returns clean results.

Designed as a **premium AI-SaaS product** (Vercel / Linear / Stripe-class): an
indigo-violet system, Plus Jakarta Sans + JetBrains Mono, a full **light/dark theme
toggle**, query history, skeleton loaders, thoughtful empty states, and sortable data
tables. The backend API, request/response formats, and auth flow are untouched.

## Run it (development)

Prerequisites: Node.js 18+ and the QuerySense backend running on `http://localhost:8084`.

```bash
npm install
npm run dev
```

Open `http://localhost:5173`. The Vite dev server proxies `/api`, `/auth`, and `/ping`
to the backend, so there is **no CORS to configure**.

## Build for production

```bash
npm run build      # outputs to dist/
```

Deploy either way:
1. **Same origin (simplest):** copy `dist/` into the backend's
   `src/main/resources/static/` — served by Spring Boot, no CORS.
2. **Separate host (Vercel/Netlify):** deploy `dist/`, set `VITE_API_BASE` to the
   backend's public URL at build time, and enable CORS on the backend.

## Features

- **Theme toggle** — polished light and dark modes (preference persisted; no flash on load).
- **Query workspace** — ChatGPT-style multiline input with focus animation, example
  prompts, `⌘/Ctrl + ↵` to run, and an animated "Generating" indicator.
- **Results** — generated SQL in a code block with copy, live/cached badges, and a
  sortable data table (sticky headers, alternating rows, hover, sort indicators).
- **Pagination** — Prev/Next plus a rows-per-page selector (LIMIT/OFFSET on the backend).
- **Query history** — recent questions saved locally; click any to re-run.
- **Upload** — drag-and-drop CSV upload in a modal.
- **Admin console** (ADMIN role only) — Users and Audit-log tabs with skeleton loading.
- **Empty & loading states** — onboarding hints, suggested queries, and shimmer skeletons.
- **Responsive** — sidebar app shell on desktop, condensed top bar on mobile.

## Stack
- React 18, Vite 5
- Tailwind CSS 3 with a CSS-variable token system (drives both themes)
- framer-motion (entrance + modal motion)
- lucide-react (icons)
- Fonts: Plus Jakarta Sans · JetBrains Mono

## Project structure
```
src/
  api.js                    # fetch helpers, JWT decode, CSV upload (unchanged API contract)
  App.jsx                   # theme + session state
  index.css                 # token system (light/dark) + component classes
  components/
    AuthScreen.jsx          # split landing + sign in / register
    Dashboard.jsx           # app shell, query execution, history, modals
    Sidebar.jsx             # nav, history, dataset, user/theme/logout
    QueryPanel.jsx          # natural-language input + examples
    ResultsTable.jsx        # SQL block, sortable table, pagination, states
    UploadModal.jsx         # CSV drag-and-drop
    AdminModal.jsx          # users + audit log
    ui/index.jsx            # reusable primitives (Spinner, Skeleton, Modal, Logo)
```
