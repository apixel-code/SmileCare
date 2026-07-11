# PROGRESS

## Current Phase
P1 — Setup ✅ complete · P2 — Public pages (Home done, others pending)

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
- NOTE for review: the sticky WhatsApp bar coexists with the global FloatingWhatsApp bubble (both are spec'd — design-system.md wants the bubble on all pages, pages-spec wants the sticky bar here). Flag if you want the bubble hidden on this page.

## Next Up (P2 remaining pages — designs in claude.ai/design project, read one at a time)
- [ ] `/services/[slug]` (Service Root Canal.dc.html) — symptom checklist, steps timeline, pricing, FAQ accordion
- [ ] `/problems` (Problems We Solve.dc.html) — problem/solution cards, myth vs fact, emergency strip
- [ ] `/doctor` (Doctor Profile.dc.html) — portrait, stat counters, timeline, schedule
- [ ] `/contact` — map, details, Zod message form
- [ ] Extract remaining ui primitives when 2nd use appears: StatusPill, Input, Select, Accordion (FAQ), Stepper
- [ ] Then P3 Booking (`Booking Flow.dc.html`), P4 Auth, P5 Portal (`Patient Portal.dc.html`), P6 Admin (`Clinic Admin.dc.html`)

## Known Issues / Watch
- Demo images use Unsplash (allowed in dev, whitelisted in `next.config.ts`). Replace with Cloudinary before launch.
- Testimonial avatars use raw `<img>` (external, dynamic) — fine for demo.
- Design exports have inconsistent footers on non-home pages — IGNORE, homepage is source of truth.
- No `.env.local` yet → DB/Cloudinary calls will throw until env is set (public pages don't need it).
