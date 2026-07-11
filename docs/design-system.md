# Design System

## Tokens (tailwind.config.ts — define once, use everywhere)
| Token | Value | Use |
|---|---|---|
| `primary` | #0E7C7B | brand teal — headers, links, active states |
| `primary-light` | #E8F4F8 | soft sky — section backgrounds |
| `cta` | #FF7A59 | coral — booking/payment CTAs ONLY (never red for CTAs) |
| `ink` | #1A2B3C | headings/body |
| `ink-muted` | #64748B | secondary text |
| `success` | #16A34A | paid, confirmed |
| `warning` | #D97706 | partial, pending |
| `danger` | #DC2626 | due amounts, allergy badges, errors only |

⚠️ Token naming: prefix custom tokens to avoid shadcn/internal collisions if shadcn is added (lesson learned: use `cta`, `ink-muted` style names, verify no conflicts on day one).

## Typography
- Headings: Plus Jakarta Sans (`next/font/google`)
- Body: Inter
- Scale: h1 36/44 (mobile 28), h2 28/36, h3 20/28, body 16/26, small 14/22

## Shape & Depth
- Radius: cards 16px (`rounded-2xl`), buttons/inputs 12px (`rounded-xl`), pills full
- Shadow: soft only (`shadow-sm`/`shadow-md`), no harsh borders — 1px `slate-100` where separation needed
- Spacing: section padding `py-16 md:py-24`, container `max-w-7xl mx-auto px-4`

## Core UI Components (build in `components/ui` FIRST, reuse everywhere — DRY)
Button (variants: cta, primary, outline, ghost, whatsapp | sizes: sm/md/lg, min-h 48px)
Card, Badge/StatusPill (waiting|in-chamber|completed|no-show|paid|partial|due),
Input, Select, Textarea, Toggle, Modal, Toast, Tabs, Accordion (FAQ),
DatePills (horizontal scroll), TimeSlotChips, StatCard, DataTable (admin), EmptyState, Stepper (booking progress)

## Layout Components (`components/layout`)
- **Navbar**: sticky, logo left; links: Services, About Doctor, Problems We Solve, Contact; right: cta Button "Book Appointment" + WhatsApp icon btn. Mobile: hamburger → slide-in drawer, booking CTA always visible. Active route: teal underline.
- **Footer**: 4-col desktop / stacked mobile — (1) logo + about line (2) Quick Links (3) Services (4) Contact + chamber hours; emergency hotline highlighted in cta; social row (Facebook first); bottom copyright bar.
- **AdminShell**: dark teal sidebar (Today's Queue, Patients, Calendar, Payments, Reports, Settings), topbar with "+ Add Walk-in Patient" (cta) — global modal.
- **FloatingWhatsApp**: fixed bottom-right, all public pages.

## Imagery Rules
- Cloudinary-served, `next/image`, warm human photos (smiling doctor, gentle consultation, clean interior)
- NEVER: drills, needles, syringes, blood, surgical close-ups (dental anxiety triggers)
- Demo/stock allowed in dev; client's real photos before launch

## Voice
Calm, reassuring, simple English (~8th grade). Benefit-first ("Save your tooth, end the pain"), transparent pricing "From ৳X". Currency always ৳.
