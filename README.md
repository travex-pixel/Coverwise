# Coverwise

**Stop shopping around for insurance.** One application. Multiple insurers. A clearer view of your options.

Coverwise is a premium Australian insurance comparison experience. A driver enters their vehicle, driver, usage and cover preferences once; Coverwise coordinates the comparison across participating providers and presents normalised results — premiums, excesses, valuation, inclusions, exclusions, referrals and declines — in one place.

> **Status: demonstration prototype.** Quoting providers are fictional demonstration adapters with synthetic results, clearly labelled "Illustrative demonstration. Not an insurer quote." Real Australian insurers appear only as not-yet-connected integration targets: nothing is sent to them and no relationship is implied. Coverwise does not provide financial product advice or arrange insurance. Regulatory, privacy and commercial advice is required before any real customer distribution.

## Experience

| Screen | Route | Notes |
| --- | --- | --- |
| Landing | `/` | Fixed-viewport hero with a server-rendered product preview driven by the real demo engine |
| Vehicle | `/compare/vehicle` | Guided entry with extensible registration lookup module (honest "not connected" state) and a one-tap demo profile |
| Driver | `/compare/driver` | Conditional follow-ups only when relevant |
| Usage | `/compare/usage` | Postcode, parking, kilometres, use, security |
| Cover | `/compare/cover` | Valuation, excess, optional extras |
| Review | `/compare/review` | Editable summary, provider disclosure, explicit consent before anything is shared |
| Results | `/results/[id]` | Live replay of each provider's audited journey, then sortable quotes, feature matrix, details, retry, delete, and **Tune cover** to re-price every provider live |

Every screen is designed for 390 × 844 (Android) and 1440 × 900 (desktop) without page-level scrolling. Long content uses intentional, contained scroll regions. The footer stays reachable when the mobile keyboard is open.

## Visual identity

An editorial watercolour identity on warm ivory paper. The signature artwork, an original SUV illustration built entirely in SVG (layered translucent washes, pigment granulation, bleeding edges, paper grain), lives in `art/` and is rasterised to optimised WebP in `public/art/` by `pnpm art`, which also renders the link preview images in `public/og/` (1200×630 and 1080×1080 JPEGs under 300 KB for WhatsApp, Messenger and iMessage). The scripts use the locally installed Playwright Chromium; Playwright is not a project dependency. Washes elsewhere in the product come from `src/components/ui/watercolour.tsx`.

## Architecture

```
src/
  app/                    App Router pages and route handlers
    api/comparisons       POST (validate → orchestrate → persist), GET, DELETE, retry
    api/registration      Registration lookup endpoint (null provider until licensed)
  components/
    ui/                   Design system primitives (button, field, segmented, choice card, dialog…)
    landing/ compare/ results/
  lib/
    application/          Zod schemas (single source of truth), labels, demo profile, client draft store
    providers/            Adapter contract, registry of fictional providers, orchestrator
      adapters/           demo-insurer, browser-workflow (worker-backed), not-connected
    quotes/               Demo pricing engine, coverage scoring, sorting, landing preview data
    storage/              ComparisonStore: in-memory and Supabase implementations
    vehicles/             Compact Australian make/model/variant reference data
supabase/migrations/      Schema with service-role-only RLS and a purge function
```

### Provider adapter model

Each provider implements `ProviderAdapter` and receives the same standardised `QuoteRequest`. Results are normalised to `ProviderResult` with one of:

`NOT_CONNECTED · READY · SUBMITTED · QUOTING · QUOTED · REFERRED · DECLINED · ERROR · MANUAL_ACTION_REQUIRED`

Integration methods: official insurer API, authorised broker, contractually approved browser workflow (runs in a separate worker; never bypasses CAPTCHA, identity checks or anti-automation controls), and human-assisted referral. Every result carries an auditable journey.

### Modes

- `COVERWISE_MODE=demo` (default): fictional providers, deterministic synthetic pricing seeded from the application, every provider state exercised.
- `COVERWISE_MODE=live`: only adapters with real credentials connect; everything else reports `NOT_CONNECTED`.

## Development

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm lint
pnpm build && pnpm start
```

Node 22+, pnpm 10. No environment variables are required for the demonstration. See `.env.example`.

## Deployment (Vercel)

1. Import the GitHub repository in Vercel. Framework preset: Next.js (auto-detected). `vercel.json` pins functions to `syd1`.
2. Optional environment variables (Project → Settings → Environment Variables): `NEXT_PUBLIC_SITE_URL`, `COVERWISE_MODE`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`.
3. Deploy. The build is verified with `pnpm build` (Next.js 16, Cache Components, static shell for every page, partial prerender for results).

### Supabase (optional persistence)

Run `supabase/migrations/0001_init.sql` against your project, then set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` (server-only). Tables are service-role only — RLS is enabled with no anon/authenticated policies. Demonstration sessions expire after 30 days; `purge_expired_comparisons()` performs the deletion and can be scheduled with pg_cron. Customers can delete their session at any time from the results screen.

Without Supabase, the app uses an in-memory store and the browser keeps a session-scoped copy of its own comparison, so the demo works fully on serverless.

## Security and data handling

- Server-side validation of every submission with the same Zod schemas used client-side.
- Nothing is sent to providers until explicit consent is recorded with the submission.
- Minimal collection: no name, email or phone is required for a demonstration comparison.
- No personal data in logs. Security headers set in `next.config.ts`.
- Secrets are read from environment variables only; never exposed with a `NEXT_PUBLIC_` prefix.
