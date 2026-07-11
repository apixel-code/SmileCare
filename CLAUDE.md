# SmileCare Dental — Project Rules

Dental clinic platform: public marketing site + online appointment booking + patient portal + clinic admin (PMS).
Read `PROGRESS.md` first every session. Detailed specs live in `/docs` — read only the doc relevant to the current task.

## Stack (NON-NEGOTIABLE)
- **Next.js 15 (App Router)** — one codebase, SSR/SSG for public pages (dental SEO is critical)
- **TypeScript** — `strict: true`. `any` is forbidden. Shared types in `src/types`
- **MongoDB + Mongoose** — models in `src/server/models`
- **TailwindCSS** — tokens from `docs/design-system.md`. No inline hex colors, no custom CSS files
- **Yarn** — ONLY package manager. Never run/suggest npm or pnpm commands. Lockfile: `yarn.lock`
- **Cloudinary** — ALL image upload/storage/optimization. Never store images in MongoDB or `/public` (static brand assets like logo/favicon only)
- **Zod** — single source of validation, shared by client forms AND API routes (never validate twice differently)

## ABSOLUTE RULE: DRY (both frontend & backend)
Duplicate code is a bug, even if it works. Before writing anything, check if it already exists.
- Same JSX ≥2 places → extract to `src/components`
- Same logic ≥2 places → extract to `src/hooks` (client) or `src/lib` (shared) or `src/server/services` (backend)
- Same DB query pattern ≥2 places → extract to repository method
- Same validation ≥2 places → shared Zod schema in `src/lib/validators`
- Same constants (fees, hours, status enums) → `src/lib/constants.ts` — NEVER hardcode in components
- API responses → always via `apiResponse()` / `apiError()` helpers, one format everywhere

## Backend Architecture (built to scale)
Strict layering — each layer only talks to the one below:

```
app/api/*  (route handlers: thin — parse, validate w/ Zod, call service, return)
   └─ src/server/services/     (ALL business logic: booking rules, serial generation, payment calc)
        └─ src/server/repositories/  (ALL DB access: Mongoose queries live ONLY here)
             └─ src/server/models/   (Mongoose schemas + indexes)
```

- Route handlers NEVER touch Mongoose directly. Services NEVER import Mongoose models directly — only repositories.
- This makes the backend extractable to a standalone Express/Nest service later with zero logic rewrite.
- DB connection: single cached connection helper `src/server/db.ts` (serverless-safe).
- Every list endpoint: pagination (`page`, `limit`) + lean queries from day one.
- Auth: patient = phone OTP; staff = credentials + role (`doctor` | `receptionist` | `admin`). Role checked in one middleware helper, not per-route.

## Frontend Rules
- **Mobile-first**: write base styles for mobile, add `md:` / `lg:` upward. Test 360px width mentally on every component.
- Navbar + Footer = shared components in `src/components/layout`, rendered ONCE in root layout. Homepage design version is the single source of truth (ignore footer variations on other design pages — generation artifacts).
- Server Components by default; `"use client"` only when state/events needed.
- All fetching in Server Components or via typed helpers in `src/lib/api.ts` — no raw `fetch` scattered in components.
- Images: `next/image` + Cloudinary loader. Every image gets `alt`.
- Buttons/inputs min touch target 48px.

## Directory Layout
```
src/
  app/            # routes (public), (portal), (admin) route groups + app/api
  components/     # ui/ (Button, Card, Modal...), layout/, features/ (booking/, admin/...)
  hooks/
  lib/            # utils, constants, validators (zod), api.ts
  server/         # db.ts, models/, repositories/, services/, auth/
  types/
docs/             # design-system.md, pages-spec.md, data-models.md
```

## Env (.env.local — never commit)
```
MONGODB_URI=
CLOUDINARY_CLOUD_NAME= / CLOUDINARY_API_KEY= / CLOUDINARY_API_SECRET=
SMS_API_KEY=            # BD SMS gateway (booking confirmations)
AUTH_SECRET=
```

## Session Workflow
1. Read `PROGRESS.md` → 2. Plan before coding (list files to create/modify) → 3. Build one phase, keep TypeScript green (`yarn tsc --noEmit`) → 4. Update `PROGRESS.md` (done / decisions / next) → 5. `/compact` on long sessions.

## Build Phases
P1 Setup: Next.js + TS strict + Tailwind tokens + db.ts + layout (Navbar/Footer)
P2 Public pages: Home, Services, Service Detail, Problems, Doctor, Contact
P3 Booking flow (4 steps + serial generation + SMS hook)
P4 Auth: OTP (patient) + credentials/roles (staff)
P5 Patient portal
P6 Admin PMS: queue, patients, dental chart, calendar
P7 Payments + Settings + Reports
P8 SEO (metadata, schema.org LocalBusiness/Dentist, sitemap) + performance + deploy
