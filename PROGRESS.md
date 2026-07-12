# PROGRESS

## Current Phase
P1 ✅ · P2 ✅ · P3 Booking ✅ · **P4 — Auth ✅ COMPLETE** · Next: P5 Patient Portal

## Done
### P1 Setup
- Next.js 15.5.20 (App Router, TS strict, src dir) scaffolded with Yarn.
- Design docs moved to `/docs` (design-system, data-models, pages-spec).
- **Tailwind v3** (not v4) — chosen so tokens live in `tailwind.config.ts` per design-system.md.
  Tokens: primary/primary-light/primary-dark, cta/cta-dark, ink/ink-muted, success/warning/danger, whatsapp. Fonts via `next/font`: Plus Jakarta Sans (`--font-heading`), Inter (`--font-body`). No token collisions.
- `src/lib/constants.ts` — single source of truth: all enums (appointment/payment/role/tooth), CLINIC + DOCTOR info, `formatTaka()`, WhatsApp/tel URLs.
- `src/lib/navigation.ts` — shared nav config (Navbar + Footer).
- `src/lib/api-response.ts` — `apiResponse()` / `apiError()` one-format helpers.
- `src/lib/utils.ts` — `cn()`. `src/lib/cloudinary-loader.ts` — next/image Cloudinary loader.
- `src/server/db.ts` — serverless-safe cached Mongoose connection.
- Root layout (fonts + metadata). `(public)` route group layout = Navbar + Footer + FloatingWhatsApp.
- `.env.example` added.

### UI primitives (`src/components/ui`)
- Button (variants cta/primary/outline/ghost/whatsapp, sizes sm/md/lg, polymorphic link/button, min-h 48px), Card, Container, icons (WhatsApp/Phone/Clock/Arrow/Menu/Close).

### Layout (`src/components/layout`)
- Navbar (sticky, active-route teal underline, mobile slide-in drawer w/ always-visible booking CTA), Footer (4-col, emergency hotline in cta, Facebook-first), FloatingWhatsApp, Logo.

### P2 — Home `/` (SSG) ✅
- Faithful to **Homepage v2** design: Hero (full-width doctor banner + gradient + dual CTA) → floating TrustStrip → WhyUs (4 cards) → ServicesPreview (6 cards, reusable `ServiceCard`) → DoctorSpotlight → Testimonials + CTA band → LocationSection.
- Demo content in `src/lib/demo-data.ts` (typed, TEMPORARY — swap for DB reads later).
- `yarn build` clean (0 warnings), `/` prerendered static, dev server verified 200 + all sections render.

### Frontend polish pass (nav + motion) ✅
- **Nav** now: Home, Services, About Doctor, Problems We Solve, Blog, Contact (in `lib/navigation.ts`, drives Navbar + Footer + mobile drawer). Navbar spacing tightened for 6 items; WhatsApp icon btn moved to `xl:`. `/blog` placeholder page added (PageHero + reusable `EmptyState`, "coming soon") so the link never 404s.
- **DRY animation system:**
  - Motion tokens in `tailwind.config.ts`: keyframes `fade-up/fade-in/scale-in/float` + `animate-*` utilities + `ease-smooth` timing + `shadow-soft-lg`.
  - `components/ui/Reveal.tsx` — ONE scroll-reveal primitive (IntersectionObserver, variants up/down/left/right/fade/scale, `delay` for stagger, `once`). Respects `prefers-reduced-motion`.
  - `lib/motion.ts` — shared interaction presets: `CARD_HOVER`, `PRESSABLE`, `NUDGE` (change hover/press feel in one place).
- **Hover/shadow everywhere (via shared components):** `Card` (hoverable) + `Button` now pull from `CARD_HOVER`/`PRESSABLE` → lift + soft shadow + press, so every card/button inherits it. `ServiceGridCard` unified to `CARD_HOVER` + image zoom-on-hover.
- **Rhythmic reveals applied:** Hero (staggered on-load intro), TrustStrip, WhyUs, ServicesPreview, DoctorSpotlight (image scale + floating badge), Testimonials, LocationSection, Services grid (per-row stagger), PageHero intro. Grid cards use `h-full` so staggered `Reveal` wrappers keep equal heights.
- Typecheck + build clean (0 warnings); `/`, `/services`, `/blog` all static + 200.

### Animation rhythm pass (site-wide) ✅
- ONE tempo everywhere: `STAGGER_MS = 100` + `stagger(i, wrap)` helper in `lib/motion.ts` — wrap = column count so late-scrolling items never queue long delays (index delays apply AFTER intersection). ALL ad-hoc delays (80/90/120ms) replaced; grep-verified zero stray `delay={n}`.
- Verified beats via computed styles: WhyUs 0/100/200/300, Services rows 0/100/200 cycling.
- Booking wizard steps now animate (`key={step}` + `fade-up-fast` 0.45s); slot grid + scarcity banner fade in after fetch.
- Hero images (Home/Service detail/Problems) get a slow 1.6s `hero-zoom` settle; accordion fade tightened to 0.4s; `scroll-behavior: smooth` (reduced-motion aware).
- Everything still respects `prefers-reduced-motion`.

## Decisions Log
- Stack locked: Next.js 15 App Router, TS strict, MongoDB/Mongoose, Tailwind, Yarn, Cloudinary, Zod.
- **Tailwind v3 over v4**: design-system.md mandates tokens in `tailwind.config.ts`; create-next-app now ships v4 (CSS `@theme`) — downgraded to v3 to match the spec + "no custom CSS files" rule.
- Layered backend (routes → services → repositories → models) for future extraction/scaling.
- Serial generation via atomic Counter collection (race-safe).
- Navbar/Footer single source of truth = homepage (v2) design version.
- Reusable `ServiceCard` shared by Home + (future) Services page.

### P2 — Services `/services` (SSG) ✅
- Faithful to Services.dc.html: `PageHero` (reusable, dashed eyebrow) → 3-col grid of 10 image-topped `ServiceGridCard`s → sticky bottom `ServicesWhatsAppBar`.
- Services data consolidated into ONE `SERVICES` source (10 entries: slug, glyph, name, benefit desc, feeFrom, image). Home shows `.slice(0,6)` as glyph cards; Services page shows all 10 as image cards. Descriptions unified to the benefit-first Services copy.
- Env: real `MONGODB_URI` mirrored into `.env.local` (git-ignored) where Next actually loads it.
- Build clean, `/services` prerendered static, verified 200.
- CTA fix: the global FloatingWhatsApp bubble was overlapping/colliding with the sticky "Ask on WhatsApp" bar (two WhatsApp CTAs in the same corner). `FloatingWhatsApp` is now path-aware (`HIDE_ON` list) and hidden on `/services`, so the sticky bar is the single clean WhatsApp CTA there; bubble still shows on all other pages. Verified with Playwright screenshots (mobile + desktop). (`playwright-core` added as a dev-only dependency for visual checks.)

### P2 — Service Detail `/services/[slug]` (SSG, 10 pages) ✅
- Faithful to Service Root Canal.dc.html: breadcrumb hero (image right) → symptom checklist → 4-step timeline (PAINLESS pills) → transparent pricing card (range, includes, installment, payment badges) → before/after gallery → FAQ accordion → doctor strip + final CTA (teal).
- Data: `lib/service-details.ts` — `ServiceDetail` type + fully-authored `root-canal` + coherent generated fallback for the other 9 (derived from preview). `getServiceDetail(slug)` / `getAllServiceSlugs()`.
- Route: `generateStaticParams` (all 10 prerendered), `dynamicParams=false`, `generateMetadata` per service, `notFound()` guard. FAQ `schema.org/FAQPage` JSON-LD injected (AEO).
- New reusable primitives: `Breadcrumb`, `Accordion` (native `<details name>` — SEO-safe, exclusive-open, no JS), `PaymentBadges`, `CheckIcon`.
- Verified: typecheck + build clean (0 warnings), 10 SSG pages, Playwright desktop + mobile screenshots match design, no overflow. (Hero/avatar images occasionally 500 in DEV due to transient Unsplash upstream timeout — not a code issue; fine in prod.)

### P2 — Problems `/problems` (SSG) ✅
- Faithful to Problems We Solve.dc.html: 2-col reassuring hero (Book + WhatsApp "Describe Your Problem") → "In Your Words — And Our Answer" 6 split cards (gray problem / teal solution, From ৳X + Book Now) → Myth vs Fact (4 rows, ✕ MYTH / ✓ FACT) → coral EmergencyStrip (click-to-call).
- Data: `PROBLEMS` + `MYTHS` in demo-data (typed `ProblemSolution`/`MythFact`, each problem carries a related service `slug`).
- Components: ProblemsHero, ProblemSolutionCard, MythVsFact, EmergencyStrip (reusable). Split cards stack problem-over-solution on mobile.
- Verified: typecheck + build clean, Playwright desktop + mobile match design, no overflow.

### P2 — Doctor `/doctor` (SSG) ✅
- Faithful to Doctor Profile.dc.html: portrait hero + floating BMDC badge (Reg D-12345) → teal **animated stat counters** (10+/7,500+/4.9★/5,000+) → education timeline (2012–2022) → team grid (4) → chamber schedule card + booking CTA.
- New reusable primitives: `CountUp` (client, IntersectionObserver + rAF ease-out, reduced-motion aware), `WhatsAppButton` (white outline WhatsApp CTA — DRY'd across Problems hero + Doctor hero + Schedule; removed 3 inline copies).
- Data in demo-data: `DOCTOR_STATS`, `DOCTOR_EDUCATION`, `TEAM`, `DOCTOR_SCHEDULE`; `DOCTOR.bmdcReg`/`title` added to constants.
- Verified: typecheck + build clean, Playwright desktop + mobile match design (stats count-up confirmed), no overflow.

### P2 — Contact `/contact` (SSG page + first API route) ✅
- No design export existed → built from pages-spec in the established visual language: PageHero → 2-col (ContactInfo cards: address / call / WhatsApp / hours + ContactForm) → full-width MapPlaceholder.
- **First form + first backend slice (demonstrates the full stack):**
  - Shared Zod `contactSchema` (`lib/validators/contact.ts`) used by BOTH the client form AND `POST /api/contact` — one validation, never twice.
  - Route is thin (`app/api/contact/route.ts`): parse → validate → `contact.service.ts` (business logic stub: TODO SMS/email + persist) → `apiResponse`/`apiError`. Layering respected (route → service).
  - Typed client helper `lib/api.ts#submitContact` (no raw fetch in components).
- New reusable primitives: `Input`, `Textarea` (shared `fieldBase`), `Field` (label+error), `MapPlaceholder` (also refactored into Home LocationSection — removed the inline copy).
- Verified end-to-end: API valid→201, invalid→422 with per-field errors; UI form submit drives the success card (Playwright); desktop+mobile clean, no overflow.

### P3 — Booking flow `/book` (DB-backed) ✅
- Faithful to Booking Flow.dc.html: mobile-first 4-step wizard in a 430px card (no marketing chrome — `/book` sits OUTSIDE the (public) group). Header + 4-seg progress + back; Service → Date/time → Details → Confirmation ticket; fallback Call/WhatsApp strip on steps 1–3.
- **Full layered backend, live on MongoDB `smilecare` db:**
  - Models: `Counter`, `Patient`, `Appointment` (indexes incl. unique {doctorKey,date,serialNo}).
  - Repositories (only Mongoose): `counter.nextSeq` (atomic $inc upsert — race-safe serials), `patient.upsertPatient` (match phone+name so family members get own record), `appointment.createAppointment` + `slotCounts` (aggregate).
  - Services: `booking.service.createBooking` (validate date/slot → capacity check → upsert patient → atomic serial → persist; SLOT_FULL guard), `availability.service.getAvailability`.
  - API: `GET /api/availability?date=`, `POST /api/book` — thin, shared Zod `bookingSchema`, apiResponse/apiError. Typed client helpers `fetchAvailability`/`submitBooking`.
  - Config in `lib/booking.ts`: SLOT_TIMES, SLOT_CAPACITY=3, chamber days (skip Fri), Dhaka-TZ date generation, Google-Calendar link builder. DEFAULT_DOCTOR is a string key (Staff ref lands in P4). Service is denormalized (serviceSlug+serviceName) until a Service collection exists.
- New reusable: `CountUp` reused? no — booking-specific steps under `components/features/booking/`.
- **Verified end-to-end:** curl (serial #1→#2 increments, slot left 3→1, SLOT_FULL→409, validation→422) AND Playwright drove the full UI (service→date→slot→details→confirm) creating a real appointment (serial #4), ticket rendered. Test data cleaned from DB afterwards. Build clean, `/book` static, APIs dynamic.
- DB decision: dbName pinned to `smilecare` in `connectDB` (URI had none → was defaulting to `test`).
- **REDESIGNED as a normal site page (per client):** `/book` moved INTO the (public) group → now uses the original site Navbar/logo + Footer + FloatingWhatsApp (unchanged, like every page). Standalone phone-card shell + two-pane BookingBrandPanel removed. New design in the home-page language: `PageHero` ("Online Booking" / "Book Your Appointment") → centered `Card` (max-w-3xl) with a reusable horizontal `Stepper` header → step content → footer nav (Back / Continue / Confirm) → "trouble booking? call/WhatsApp" note. Steps rewritten to use the site primitives (Field/Input/Textarea, StepHeading). Fully responsive (mobile compact stepper + single-col; desktop full-label stepper + 2-col service / 4-col slots). New reusable: `Stepper`. Verified end-to-end with Playwright at mobile + desktop (real booking → ticket).

### P4 — Auth ✅
- **Sessions:** stateless HS256 JWT (jose) in httpOnly `sc_session` cookie (7d), signed with AUTH_SECRET. `src/server/auth/session.ts` is edge-safe (no mongoose) so middleware verifies it too.
- **ONE role-check:** `src/middleware.ts` (edge) guards `/portal/*` (patient) + `/admin/*` (staff roles) with `?next=` redirects; `server/auth/guard.ts` (`getSession`/`requireRole`) for server components. No per-route checks.
- **Patient OTP:** `POST /api/auth/otp/request` → crypto-random 4-digit, sha256-hashed in `OtpCode` (TTL index 5min, 60s resend cooldown, max 5 attempts) → SMS stub (logs in dev, `SMS_API_KEY` gateway TODO). `verify` consumes the code, reuses the phone's first Patient record (`findOrCreatePatientByPhone` — no duplicate placeholder if they booked before), sets cookie.
- **Staff login:** `POST /api/auth/login` — phone+password (scrypt, no deps), role from `Staff` record, anti-enumeration error. `POST /api/auth/logout` clears the cookie.
- Models `OtpCode`/`Staff` + repositories; shared Zod schemas in `lib/validators/auth.ts`; typed client helpers in `lib/api.ts`.
- **UI:** `AuthCard` shell; `/portal/login` (2-phase OTP, resend countdown, change-number) + `/admin/login`; placeholder dashboards at `/portal` + `/admin` (SimpleTopBar + LogoutButton) — replaced by P5/P6.
- **Seed:** `node scripts/seed-staff.mjs <phone> <password> [role] [name]` (client must create the real admin; test admin removed after verification).
- **Verified E2E (curl + Playwright UI):** guard redirects, OTP request→SMS log→wrong-code countdown→verify→cookie→/portal 200; patient↛/admin, staff↛/portal (role isolation both ways); staff wrong-password generic error; logout clears. Test data cleaned.

## Next Up
- [ ] **P5 Patient Portal** (`Patient Portal.dc.html`) — dashboard (next appointment, quick actions, timeline, payments, family switcher), prescriptions. Auth is live; portal reads real Appointments by session phone.
- [ ] P6 Admin PMS (`Clinic Admin.dc.html` — queue reads real appointments), P7 Payments/Settings/Reports, P8 SEO/perf/deploy.
- [ ] Extract remaining ui primitives when 2nd use appears: StatusPill, Input, Select, Accordion (FAQ), Stepper
- [ ] Then P3 Booking (`Booking Flow.dc.html`), P4 Auth, P5 Portal (`Patient Portal.dc.html`), P6 Admin (`Clinic Admin.dc.html`)

## Known Issues / Watch
- Demo images use Unsplash (allowed in dev, whitelisted in `next.config.ts`). Replace with Cloudinary before launch.
- Testimonial avatars use raw `<img>` (external, dynamic) — fine for demo.
- Design exports have inconsistent footers on non-home pages — IGNORE, homepage is source of truth.
- No `.env.local` yet → DB/Cloudinary calls will throw until env is set (public pages don't need it).
