# Pages Spec
Design reference: exported Claude Design `.dc.html` files. Navbar/Footer: use HOMEPAGE version only.

## Route Groups
```
(public)  /  /services  /services/[slug]  /problems  /doctor  /contact  /book
(portal)  /portal  /portal/prescriptions  /portal/history  (OTP-gated)
(admin)   /admin  /admin/patients/[id]  /admin/calendar  /admin/payments  /admin/reports  /admin/settings  (role-gated)
```

## Public
**Home `/`** (SSG): Hero doctor banner (full-width ~85vh, gradient overlay left, doctor photo right, name + degrees + eyebrow "BMDC Registered • 10+ yrs", 2 CTAs) → floating trust strip → Why Choose Us (4 cards) → Services preview (6 cards, "From ৳X") → Doctor spotlight + chamber hours → Testimonials (3 Google-review-style cards + CTA) → Location (map, address w/ landmark, click-to-call, hours) → Footer.

**Services `/services`** (SSG, data from DB): hero + grid 8–10 service cards (image/icon, benefit line, "From ৳X", Learn More). Mobile sticky bottom bar: WhatsApp ask.

**Service Detail `/services/[slug]`** (SSG + ISR): breadcrumb hero + instant Book CTA → symptom checklist ("Are you experiencing…") → How It Works (3–4 step timeline, "Painless" labels) → transparent pricing card (range, includes, installment note, bKash/Nagad/card icons) → before/after gallery → FAQ accordion (5 real patient questions, answer-first for SEO/AEO) → doctor credibility strip → final CTA block.

**Problems `/problems`**: hero → 6–8 Problem→Solution split cards (patient's-own-words pain left / treatment + reassurance + fee + mini CTA right) → Myth vs Fact (4 rows: extraction-eyesight, scaling-loose, root-canal-pain, baby-teeth) → emergency strip (cta bg, hotline).

**Doctor `/doctor`**: large portrait + name + stacked degrees + BMDC badge → animated stat counters → education/training timeline → team cards → chamber schedule table + CTA.

**Contact `/contact`**: map, address, phones, hours, WhatsApp, simple message form (Zod).

## Booking `/book` — 4-step wizard (client component, Stepper)
1 Service (large tap cards incl. "Not sure — let the doctor decide") → 2 Date & time (DatePills + TimeSlotChips, unavailable grayed, "Only N slots left") → 3 Details (name, mobile, age, self/family toggle, optional note — NO email/password) → 4 Confirmation: ticket-style serial card (big serial no, date/time, doctor, address), "SMS sent" note, Add to Calendar / Save to WhatsApp, reminder note.
Fallback state: "Trouble booking? Call us" + Call/WhatsApp buttons.
Rules: serial = clinic-wide per-day sequence — one queue line shared by all doctors (service layer, atomic). Slot capacity checked server-side at confirm.

## Portal (patient, OTP login: phone → 4-digit code)
Dashboard: greeting + next-appointment card (Reschedule/Cancel) → quick actions grid (Book, Prescriptions, History, Reports) → treatment timeline → payment history (due in danger + Pay Now) → family member switcher (one phone = whole family's records).
Prescription view: clinic letterhead, patient bar, medicine table (name, dose `1+0+1`, duration), advice, signature, Download PDF.

## Admin (staff auth + roles)
**Today's Queue `/admin`** (default): date header + stat chips (Total/Completed/Waiting/No-show) → queue table: big serial, patient+phone, service, time, StatusPill, ONE advancing action btn (Call In → Mark Complete); in-chamber row highlighted; globe icon = online booking, walk icon = walk-in.
**Patient Profile `/admin/patients/[id]`**: header (name, age, phone, blood group, ALLERGY badge) + tabs: History (visit timeline) | Dental Chart (32-teeth interactive SVG, color-coded cavity/filled/extracted/crown + legend) | Prescriptions (searchable medicine input, dose chips, duration, Print/SMS) | Payments (cost/paid/due, SMS reminder btn).
**Calendar**: week view, color-coded slots, reschedule, doctor filter.
**Payments**: stat cards (today, month, total due, pending) → filter tabs (All/Paid/Due/Partial) → transactions table (method icons bKash/Nagad/cash/card, StatusPill, Collect Payment modal w/ method chips + toast, View Receipt, SMS reminder).
**Settings**: clinic profile (logo → Cloudinary), chamber schedule editor (day on/off + times), appointment settings (slot duration, max serials/day, online booking toggle), SMS templates (`{patient_name}` `{serial_no}` `{time}` vars), staff list + roles + Add Staff. Sticky Save.
**Reports**: This Month's Patients, Revenue, Popular Services (bar), New vs Returning (donut), 6-month revenue trend (line).
**Global**: "+ Add Walk-in Patient" topbar modal (name, mobile, age, service, next slots, payment-taken toggle) → appends to today's queue + toast.
