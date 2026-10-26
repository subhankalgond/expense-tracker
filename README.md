# Ledger Brutalist — Full-Stack Personal Finance & Expense Command Center

**Ledger Brutalist** is a multi-user personal finance management web application and installable mobile-friendly Progressive Web App (PWA). Built with an editorial neo-brutalist financial interface, it enforces strict multi-tenant Row Level Security (RLS) on PostgreSQL, exact Indian Rupee (INR - ₹) minor-unit arithmetic, and idempotent recurring schedule processing.

---

## 1. Architectural Highlights

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS (Custom Neo-Brutalist Design Tokens), React Router 7.
- **Backend & Persistence**: Supabase PostgreSQL 15, Supabase Auth (Google OAuth), and Supabase Edge Functions.
- **Multi-Tenant Security**: 100% of tables protected by PostgreSQL Row Level Security (`auth.uid() = user_id`).
- **Financial Math**: Precise minor-unit (paise) integer math to avoid IEEE 754 floating-point inaccuracies.
- **Exporting**:
  - **CSV Generation**: RFC 4180-compliant, formula-injection mitigated (prevents spreadsheet command execution), UTF-8 BOM.
  - **PDF Reports**: Neo-brutalist multi-page audit statements generated with `jspdf` and `jspdf-autotable`.
- **PWA Ready**: Web app manifest, standalone display mode, offline fallback service worker.
- **Testing**: 100% automated test suites across currency formatting, date presets, formula sanitization, business logic, and access isolation.

---

## 2. Neo-Brutalist Design System

Inspired by financial publications (Financial Times, Bloomberg Ledger):
- **Light Background**: Warm cream (`#FAF8F5` / `#F4EFE6`).
- **Dark Mode**: High-contrast slate charcoal (`#0F1012` / `#181A1F`).
- **Borders & Shadows**: Solid 2px/3px borders (`#121214`) with hard offset shadows (`box-shadow: 3px 3px 0px #121214`).
- **Accents**: Cobalt Blue (`#1E40AF`), Burnt Orange (`#C2410C`), Emerald Gain (`#047857`), and Crimson Outflow (`#B91C1C`).
- **Typography**: Editorial monospace and sans-serif with tabular numerical figures (`tabular-nums`).
- **Custom SVGs**: Dedicated inline SVG icon system — zero emojis, zero generic lucide icons.

---

## 3. Database Schema & Supabase Migrations

The database migration is located in `supabase/migrations/20261025000000_initial_schema.sql` and provisions:

1. `profiles`: User preferences, opening balance, timezone (`Asia/Kolkata`), currency (`INR`), onboarding flag.
2. `categories`: User-owned categories (seeded automatically on sign-up via trigger).
3. `payment_methods`: User payment instruments (UPI, Cash, Debit Card, Credit Card, Bank Transfer).
4. `transactions`: Verified monetary journal entries with foreign keys, checks (`amount > 0`), and indexes.
5. `budgets`: Category and overall spending targets with 75%, 90%, and 100% alert thresholds.
6. `savings_goals`: Capital targets and status tracking.
7. `savings_contributions`: Contribution history updated via `record_savings_movement()` atomic RPC.
8. `recurring_transactions`: Daily, weekly, monthly, yearly liabilities with `next_occurrence`.
9. `recurring_history`: Compound occurrence log (`recurring_id_date`) preventing duplicate transactions during retries.
10. `notification_preferences` & `notifications`: User alert preferences and in-app audit broadcast feed.

### Row Level Security (RLS)
Every table enforces `auth.uid() = user_id` for `SELECT`, `INSERT`, `UPDATE`, and `DELETE`.

---

## 4. Setup & Local Development

### Prerequisites
- Node.js v18+ (tested on Node v24)
- npm v9+

### 1. Clone & Install Dependencies
```bash
git clone <repository-url>
cd "expense tracker"
npm install --legacy-peer-deps
```

### 2. Configure Environment Variables
Create a `.env` file from `.env.example`:
```bash
cp .env.example .env
```
Fill in your Supabase project keys:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-publishable-key
```

> **Note on Local / Offline Testing Mode**: If `VITE_SUPABASE_URL` is not yet configured, Ledger Brutalist automatically engages its local persistent data store so reviewers can immediately test and evaluate all features, including User A vs User B data isolation.

### 3. Run Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 5. Automated Test Suites

Run the complete Vitest test suite:
```bash
npm test
```
Or run in watch mode:
```bash
npm run test:watch
```

### Verified Test Suites:
1. `src/test/currency.test.ts`:
   - Exact INR formatting with Indian comma placement (`₹1,25,000.00`).
   - Minor unit (paise) integer math without floating-point drift.
   - `safeSum`, `safeSubtract`, and `safePercentage`.
2. `src/test/date.test.ts`:
   - ISO date formatting and editorial date display.
   - Date range presets (`this_week`, `this_month`, `last_month`, `this_year`).
3. `src/test/export.test.ts`:
   - CSV formula injection protection (mitigating `=, +, -, @` injection attacks).
   - RFC 4180 double-quote escaping.
4. `src/test/dataService.test.ts`:
   - Full CRUD cycle for transactions.
   - Atomic savings movement (`record_savings_movement`).
   - Budget threshold calculations against real expense records.
5. `src/test/userIsolation.test.ts`:
   - Multi-tenant isolation verification (User A cannot see or delete User B records).

---

## 6. Supabase Deployment & Google OAuth Setup

### 1. Apply Database Migrations
In your Supabase project dashboard (SQL Editor) or via the Supabase CLI:
```bash
supabase db push
# or paste supabase/migrations/20261025000000_initial_schema.sql into SQL Editor
```

### 2. Configure Google Cloud OAuth
1. Go to the [Google Cloud Console](https://console.cloud.google.com/apis/credentials).
2. Create an **OAuth 2.0 Client ID** (Web Application).
3. Add Authorized JavaScript Origins:
   - `http://localhost:5173` (local development)
   - `https://your-app.vercel.app` (production domain)
4. Add Authorized Redirect URIs:
   - `https://<your-supabase-project-id>.supabase.co/auth/v1/callback`
5. Copy the **Client ID** and **Client Secret**.

### 3. Configure Supabase Auth Provider
1. In your Supabase Dashboard, navigate to **Authentication -> Providers -> Google**.
2. Toggle Google to **Enabled**.
3. Paste the **Client ID** and **Client Secret** obtained from Google Cloud.
4. Set Redirect URL in **URL Configuration**:
   - Site URL: `https://your-app.vercel.app`
   - Additional Redirect URLs: `http://localhost:5173/**`, `https://your-app.vercel.app/**`

### 4. Deploy Supabase Edge Functions
```bash
# Process recurring schedules (can be scheduled via pg_cron daily at 00:00 UTC)
supabase functions deploy process-recurring

# AI spending insights engine
supabase functions deploy ai-insights --no-verify-jwt
```
Set Edge Function secrets if integrating with an LLM provider:
```bash
supabase secrets set GEMINI_API_KEY=your_gemini_key
```

---

## 7. Frontend Deployment to Vercel

1. Push your repository to GitHub.
2. Import the project into [Vercel](https://vercel.com).
3. Set the Framework Preset to **Vite**.
4. Configure Environment Variables in Vercel:
   - `VITE_SUPABASE_URL`: `https://your-project.supabase.co`
   - `VITE_SUPABASE_ANON_KEY`: `<your-supabase-anon-key>`
5. Deploy. Vercel will run `npm run build` and output the `dist/` directory.

---

## 8. Application Routes & Navigation

| Route | Purpose |
|---|---|
| `/login` | Google OAuth authentication, session recovery, local test user switcher |
| `/dashboard` | Executive KPI cards, Cash flow charts, Category pie, Recent transactions |
| `/transactions` | Full ledger journal, multi-criteria filters, sorting, CSV export |
| `/budgets` | Monthly category limits, real-time burn tracking, 75%/90%/100% threshold alerts |
| `/savings` | Capital goals, atomic deposit/withdrawal drawer, target horizon dates |
| `/recurring` | Periodic schedules, due date monitors, idempotent execution engine |
| `/reports` | Cumulative run-rate curves, payment channels, formal PDF & CSV exports |
| `/insights` | Heuristic and AI spending insights with actionable conservation suggestions |
| `/settings` | Profile, opening balance, categories, instruments, JSON backup, GDPR erase |

---

## 9. Security & Compliance Checklist

- [x] Strict Row Level Security on all PostgreSQL tables.
- [x] Zero service-role keys bundled into client code.
- [x] CSV formula injection protection implemented and tested.
- [x] Idempotent recurring transaction runner prevents duplicate billing on retry.
- [x] Atomic transactions for savings deposits/withdrawals.
- [x] First-time onboarding flow for opening balances and timezone verification.
- [x] Full GDPR-compliant user data export and irreversible deletion flow.
