# 🦷 SmileCare Dental — Full-Stack Platform & PMS

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose_8.9-47A248?logo=mongodb)](https://www.mongodb.com/)
[![PageSpeed Desktop](https://img.shields.io/badge/Desktop_PageSpeed-100%2F100-success)](https://pagespeed.web.dev/)
[![PageSpeed Mobile](https://img.shields.io/badge/Mobile_PageSpeed-91%2F100-success)](https://pagespeed.web.dev/)

A unified dental clinic web platform combining a **lightning-fast public discovery site**, **self-service appointment booking**, **OTP-authenticated patient portal**, and an end-to-end **Clinic Practice Management System (PMS)**.

📖 **[Read the Full Engineering Case Study →](./CASE_STUDY.md)**

---

## ⚡ Highlights & Benchmarks

- **Google PageSpeed Score**: 100/100 Desktop (FCP: 0.3s, LCP: 0.6s) · 91/100 Mobile · 100 SEO · 100 Best Practices
- **Layered Architecture**: Strict 4-tier separation (`Routes` ➔ `Services` ➔ `Repositories` ➔ `Models`)
- **Booking Engine**: Race-safe atomic serial generation, capacity controls, Dhaka timezone scheduling
- **Patient Portal**: Phone OTP login, family profile management, clinic letterhead printable prescriptions
- **Clinic Admin (PMS)**: Live patient queue, interactive 32-tooth dental chart, prescription writer, weekly calendar, and multi-channel billing (bKash, Cash, Card)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (tested on Node 20 & 25)
- **Yarn** package manager (`npm install -g yarn`)

### Installation & Run

```bash
# 1. Install dependencies
yarn install

# 2. Setup environment variables
cp .env.example .env.local

# 3. Verify TypeScript strict check
yarn typecheck

# 4. Start local development server
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📂 Project Structure

```
src/
├── app/
│   ├── (public)/          # Marketing site, services, doctor profile, booking (/book)
│   ├── (portal)/          # Patient portal (/portal) with OTP login
│   ├── (admin)/           # Practice Management System (/admin) with staff auth
│   └── api/               # Thin API route handlers (Zod-validated)
├── components/            # Reusable UI primitives, layout, and feature widgets
├── lib/                   # Shared constants, navigation, validators, motion presets
├── server/
│   ├── auth/              # Stateless JWT session helpers & middleware guards
│   ├── models/            # Mongoose schemas (Appointment, Patient, Payment, etc.)
│   ├── repositories/      # Database queries & atomic mutations
│   └── services/          # Business logic, capacity checking, serial generator
└── types/                 # Shared TypeScript definitions
```

---

## 📄 Case Study & Technical Documentation

For an in-depth architectural breakdown, Core Web Vitals optimization techniques, and schema designs:

👉 **[Read CASE_STUDY.md](./CASE_STUDY.md)**
