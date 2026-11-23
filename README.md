# Doctor Tracker — Frontend

Next.js 16 admin app for managing doctors, patients and clinic activity. It uses the companion Express API in `../doctor-tracker-backend`.

## Quick start

```bash
npm install
cp .env.example .env.local
npm run dev            # http://localhost:3000
```

Start the backend first and create an admin there before logging in.

## Environment

| Variable | Default | Notes |
| --- | --- | --- |
| `BACKEND_URL` | `http://localhost:5000` | Backend URL used by the `/api/v1` rewrite. Read at **build time**. |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | Public origin used for metadata URLs. |

`BACKEND_URL` is serialized into the Next build manifest. Set it before running `npm run build` (or pass it as a Docker build arg). Changing it when starting a prebuilt app has no effect.

The backend must list this app's browser origin in `CORS_ORIGINS` and must use HTTPS (or `COOKIE_SECURE=false` for local HTTP) for the HttpOnly session cookie.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Next dev server |
| `npm run build` | Production standalone build (also runs TypeScript checks) |
| `npm start` | Serve the production build |
| `npm run start:standalone` | Serve the standalone output directly |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Type-check without emitting files |

## Features

- Login/logout with an HttpOnly JWT cookie and `/auth/me` session restore.
- Protected app shell with sidebar navigation and active-route highlighting.
- Dashboard: KPI cards, six-month registration chart, condition pie chart, specialization chart, top doctors and recent patients.
- Doctors: paginated list, debounced search, filters by specialization/status, sorting, create/edit forms, delete confirmation.
- Patients: paginated list, debounced search, filters by condition/gender/doctor, sorting, create/edit forms, delete confirmation.
- Shared API envelope/error handling, request timeout, TanStack Query caching/invalidation, Zod-validated forms, and sonner notifications.
- Branded error, global error, 404 and global 404 pages.

## Structure

```text
src/
  app/
    (auth)/login/         Login page
    (app)/                Protected layout and pages
      dashboard/
      doctors/
      patients/
    layout.tsx            Root layout + Providers
    page.tsx              Redirects to /dashboard
  components/             Auth provider, providers, app shell, charts, UI helpers
  hooks/use-api.ts        Query/mutation hooks
  lib/                    API client, types, constants, formatters
```

`cacheComponents` and `partialPrefetching` are enabled. Client data views are wrapped in `<Suspense>` boundaries; keep this pattern when adding pages.

## Styling and conventions

- Tailwind CSS 4 with theme tokens in `src/app/globals.css`.
- Shared button styles come from `buttonVariants` in `src/components/ui/button.tsx`. Base UI buttons do not support Radix-style `asChild`; style links with `buttonVariants` instead.
- Forms use `react-hook-form` + `@hookform/resolvers/zod`. Server-side field errors from the API are mapped back onto form fields.
- Validation option lists mirror backend constants: specialties, genders and conditions in `src/lib/constants.ts`.
- 401 responses from protected API calls redirect to `/login?expired=1`.

## Backend API

See `../doctor-tracker-backend/README.md` for endpoints, request bodies, filters and response shapes. All calls are made with `credentials: 'same-origin'` to `/api/v1`.

Before shipping, run `npm run lint && npm run typecheck && npm run build` here and `npm run lint && npm run typecheck && npm test && npm run build` in the backend.
