# Data Models (Mongoose)
All models: `timestamps: true`. All enums/statuses defined once in `src/lib/constants.ts` and imported by BOTH Zod validators and Mongoose schemas (DRY — one source of truth).

## Patient
```
name, phone (indexed), age, gender?, bloodGroup?, allergies: string[],
familyHeadPhone? (groups family under one login phone), area?, notes?
```
Index: `{ phone: 1 }`, `{ familyHeadPhone: 1 }`

## Appointment
```
serialNo (per doctor per day), patient: ref, doctor: ref(Staff),
service: ref, date (YYYY-MM-DD string), timeSlot ("17:30"),
status: waiting|in_chamber|completed|no_show|cancelled,
source: online|walk_in|phone, problemNote?, bookedByPhone
```
Indexes: `{ doctor: 1, date: 1, serialNo: 1 }` unique; `{ date: 1, status: 1 }`; `{ patient: 1, date: -1 }`
Serial generation: atomic `findOneAndUpdate` on a Counter collection `{ key: "docId:date", seq }` — never count documents (race-safe).

## Service
```
name, slug (unique, indexed), shortBenefit, description,
symptoms: string[], steps: [{title, note, painless: bool}],
priceMin, priceMax, includes: string[], faqs: [{q, a}],
imagePublicId (Cloudinary), isActive, order
```

## Prescription
```
appointment: ref, patient: ref, doctor: ref,
medicines: [{name, dose ("1+0+1"), durationDays, afterMeal: bool}],
advice?, nextVisitDate?
```
Index: `{ patient: 1, createdAt: -1 }`

## Payment
```
patient: ref, appointment?: ref, service?: ref,
totalAmount, paidAmount, dueAmount (computed in service layer),
method: bkash|nagad|cash|card, status: paid|partial|due,
transactions: [{amount, method, note?, at, by: ref(Staff)}]
```
Indexes: `{ status: 1 }`, `{ patient: 1 }`, `{ createdAt: -1 }` (reports)

## DentalChartEntry
```
patient: ref, toothNo (1–32), condition: cavity|filled|extracted|crown|other,
note?, updatedBy: ref(Staff)
```
Index: `{ patient: 1, toothNo: 1 }` unique (upsert on change)

## Staff (auth users)
```
name, phone (unique), passwordHash, role: admin|doctor|receptionist,
degrees?, photoPublicId?, isActive
```

## OtpCode
```
phone, code, expiresAt (TTL index), attempts
```

## ClinicSettings (single doc)
```
clinicName, logoPublicId, address, landmark, phones[], email?,
schedule: [{day: 0-6, open, close, isOff}],
slotDurationMin, maxSerialsPerDay, onlineBookingEnabled,
smsTemplates: {confirmation, reminder}
```

## Scale Notes
- Reads (public services, settings): cache via ISR/`unstable_cache`, revalidate on admin save.
- All list queries: `.lean()` + pagination — enforced in repository base helpers.
- Reports: MongoDB aggregation pipelines in `services/report.service.ts` (never compute in JS loops over full collections).
- Multi-doctor & multi-branch ready: appointment already keyed by doctor; add `branch: ref` later without migration pain (design decision documented, not built now).
