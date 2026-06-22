# 🏥 Hospital Management SaaS — MVP

A working MVP built with React + Tailwind (frontend), Node.js + Express (backend),
and Supabase (database + auth), with Email & WhatsApp notifications on booking.

```
hospital-saas/
├── backend/        # Express API
├── frontend/        # React + Tailwind app
└── database/
    └── schema.sql    # Run this in Supabase SQL editor
```

This covers: Public Website, Patient/Doctor/Admin auth, Appointment booking,
Patient/Doctor/Admin dashboards, and Email + WhatsApp notifications — the full
MVP scope you listed.

---

## STEP 1 — Create your Supabase project

1. Go to https://supabase.com → New Project. Note your project URL.
2. In **Project Settings → API**, copy:
   - `Project URL`
   - `anon public` key
   - `service_role` key (keep secret — backend only)
3. Go to **SQL Editor → New Query**, paste the entire contents of
   `database/schema.sql`, and click **Run**.
   This creates all tables (`users`, `roles`, `patients`, `doctors`,
   `departments`, `appointments`, `notifications`) with Row Level Security.
4. In **Authentication → Providers**, make sure **Email** is enabled.
   (For the MVP, email confirmation is auto-bypassed by the backend using
   `email_confirm: true` during registration.)

---

## STEP 2 — Run the backend locally

```bash
cd backend
npm install
cp .env.example .env
```

Fill in `.env`:
- `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_ANON_KEY` — from Step 1
- `SMTP_*` — use Gmail (create an "App Password") or any SMTP provider, for email notifications
- `WHATSAPP_*` — from Meta's WhatsApp Cloud API (see Step 5 below)

```bash
npm run dev
```

Backend runs on `http://localhost:5000`. Test it: `curl http://localhost:5000`
should return `{"status":"ok", ...}`.

---

## STEP 3 — Run the frontend locally

```bash
cd frontend
npm install
cp .env.example .env
```

Fill in `.env` with your Supabase URL/anon key and `VITE_API_URL=http://localhost:5000/api`.

```bash
npm run dev
```

Frontend runs on `http://localhost:5173`.

---

## STEP 4 — Create your first Admin user

The MVP registration form only creates `patient` or `doctor` accounts (by
design — admins shouldn't self-register). To create an admin:

1. Register a normal account via the UI (any role).
2. In Supabase **Table Editor → roles**, note the `id` for `admin`.
3. In **Table Editor → users**, find your new user's row and change
   `role_id` to the admin role's id.
4. Log out and log back in — you'll land on `/admin`.

(For a production build, add a proper "invite admin" flow — out of scope for MVP.)

---

## STEP 5 — Set up notifications

**Email (SMTP via Nodemailer):**
- Easiest: Gmail. Enable 2FA on the Gmail account, then create an
  [App Password](https://myaccount.google.com/apppasswords) and use that as `SMTP_PASS`.
- Any SMTP provider (SendGrid, Mailgun, etc.) works the same way — just change `SMTP_HOST`/`SMTP_PORT`.

**WhatsApp (Meta Cloud API):**
1. Create a Meta Developer app → add the **WhatsApp** product.
2. Use the test phone number Meta provides (free tier) to get
   `WHATSAPP_PHONE_NUMBER_ID` and a temporary `WHATSAPP_ACCESS_TOKEN`.
3. Add your own number as a "recipient" in the test settings (required in
   sandbox mode before you can message it).
4. Patient phone numbers must be stored in E.164 format without `+`
   (e.g. `919876543210`) for the API call to work.

Both are triggered automatically from `backend/src/services/notificationService.js`
whenever `POST /api/appointments` succeeds. Each attempt is logged to the
`notifications` table regardless of success/failure, so you can show a
notification log in the admin dashboard later.

---

## STEP 6 — Deploy

**Database:** Already live on Supabase — nothing to deploy.

**Backend → Render:**
1. Push this repo to GitHub.
2. On [Render](https://render.com) → New → Web Service → connect your repo.
3. Root directory: `backend`. Build command: `npm install`. Start command: `npm start`.
4. Add all variables from `backend/.env.example` under Render's Environment tab.
5. Deploy. Copy the resulting URL (e.g. `https://your-app.onrender.com`).

**Frontend → Vercel:**
1. On [Vercel](https://vercel.com) → New Project → import the same repo.
2. Root directory: `frontend`. Framework preset: Vite.
3. Add env vars: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`,
   and `VITE_API_URL` = your Render backend URL + `/api`.
4. Deploy.
5. Back in Render, set `FRONTEND_URL` to your new Vercel URL (for CORS) and redeploy.

---

## What's implemented vs. future scope

✅ Implemented (MVP):
- Public site (Home/About/Doctors/Services/Contact), responsive, basic SEO meta tag
- Patient/Doctor registration & login (role-based), Supabase Auth + RLS
- Appointment booking (doctor/date/time) with auto token numbers
- Patient dashboard (profile, upcoming/history)
- Doctor dashboard (today's appointments, patient list, consultation notes)
- Admin dashboard (totals, all appointments, doctor list)
- Email + WhatsApp notification on booking, logged to `notifications` table

🔜 Listed as future scope in the brief (not built — by design, to hit the
2-day MVP target): full EMR/EHR, pharmacy, lab management, billing/invoicing,
CRM lead pipeline, analytics, AI features, multi-tenant SaaS billing.
The schema and architecture (separate `departments`, role-based tables) are
structured so these can be added as new tables/routes without refactoring
what's already built.

---

## Architecture notes

- **Auth:** Supabase Auth issues JWTs. The frontend keeps the session via
  `supabase-js`; every backend request carries the access token, verified
  server-side in `backend/src/middleware/auth.js`. The backend uses the
  **service role key** (bypasses RLS) for admin-level reads, while
  patient/doctor-facing routes still respect RLS as a defense-in-depth layer.
- **Roles:** `patient`, `doctor`, `admin` stored in a `roles` table and
  joined onto `users`, rather than hardcoded strings, so new roles
  (e.g. `receptionist`) can be added later without a schema change.
- **Token numbers:** generated server-side per doctor per day — a simple
  stand-in for the "Reception Module / Token Management" feature listed
  under Level 3, without building a separate reception UI in the MVP.
