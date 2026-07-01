# Software Factory — Reusable Boilerplate (Phase 1: E-commerce reference)

A **configuration-driven** boilerplate for generating multiple client websites
(e-commerce, corporate, portfolio, booking, LMS, real-estate, restaurant,
healthcare, marketplace…). **Phase 1** implements the reusable foundation using
the **e-commerce** vertical as the reference. Everything is toggled from a single
root [`options.json`](./options.json) — features turned off keep their code
module but disappear from routing, navigation and the DB seed (feature-flag
pattern, not deleted code).

> The unrelated `compress_gui (1).py` from the original repo is left untouched.

---

## Tech stack

| Layer      | Tech |
|------------|------|
| Backend    | .NET 9, ASP.NET Core Minimal API, Clean Architecture, MediatR (CQRS), FluentValidation, EF Core |
| Database   | PostgreSQL (EF Core, parameterized queries only) |
| Cache      | Redis (hot-read caching) |
| Frontend   | Next.js 15 (App Router), TypeScript, Tailwind CSS, shadcn/ui |
| CMS        | Payload CMS (embedded in the Next.js app) |
| Auth       | Auth.js / NextAuth v5 (self-hosted, no paid tiers) |
| Contract   | OpenAPI-first — [`openapi/openapi.yaml`](./openapi/openapi.yaml) generates types for both sides |
| i18n       | next-intl (ar / en, RTL + LTR) |

---

## Repository layout

```
options.json                 # config-driven build manifest (drives both sides)
options.schema.json          # JSON schema for options.json
docker-compose.yml           # postgres, redis, backend, frontend
.env.example                 # every secret referenced by env only
openapi/openapi.yaml         # API contract (source of truth)
.github/workflows/ci.yml     # lint · unit tests · build · Lighthouse CI gate
backend/                     # .NET 9 Clean Architecture solution
frontend/                    # Next.js 15 + Payload CMS
```

---

## Run locally

### One command (Docker)

```bash
cp .env.example .env          # then edit secrets
docker compose up --build
```

- Frontend → http://localhost:3000
- Backend / Swagger → http://localhost:8080/swagger
- Postgres → localhost:5432 · Redis → localhost:6379

### Without Docker

**Backend**
```bash
cd backend
dotnet restore
dotnet run --project src/SoftwareFactory.Web      # http://localhost:8080
```

**Frontend**
```bash
cd frontend
pnpm install
pnpm gen:api          # generate TS types from ../openapi/openapi.yaml
pnpm dev              # http://localhost:3000
```

---

## How `options.json` works

```jsonc
{
  "siteType": "ecommerce",          // which vertical template
  "language": "ar-en",              // "ar" | "en" | "ar-en"
  "defaultDirection": "rtl",        // default text direction
  "payments": ["tamara", "tabi"],
  "integrations": ["zatca", "whatsapp"],
  "features": {                     // ← toggles below drive routes/nav/seed
    "clientDashboard": true,
    "cms": true,
    "reviews": false,               // off ⇒ no /reviews route, no nav item, no seed
    "loyalty": false,
    "analytics": true
  },
  "designDirection": "premium"
}
```

Both sides read this file at build/startup:

- **Backend** — `FeatureFlags` / `OptionsJsonProvider` (Infrastructure/Configuration)
  gate MediatR module registration, endpoint mapping and DB seed rows. A disabled
  feature's endpoints are never mapped.
- **Frontend** — `src/config/options.ts` + `src/config/nav.ts` gate nav items and
  route rendering. Disabled features stay in the codebase but vanish from the UI.

**Try it:** flip `"reviews": true`, restart both apps → a `/reviews` route,
nav item, `/api/reviews` endpoint and seed data all appear together. Flip it
back → they all disappear. No code deleted.

---

## How to add a new feature module (the vertical-slice recipe)

Adding e.g. **"Reviews"** never requires editing existing modules — you add one
folder per layer plus one endpoint file, then flip the flag:

**Backend** (`backend/src`)
1. `Domain/Modules/Reviews/Review.cs` — entity + value objects + domain events.
2. `Application/Modules/Reviews/` — `Commands/…`, `Queries/…`, `Dtos/…`,
   `Validators/…` (a FluentValidation validator per command/query).
3. `Infrastructure/Persistence/Configurations/ReviewConfiguration.cs` +
   add the `DbSet` to `AppDbContext`; add seed rows to `DbSeeder` (guarded by flag).
4. `Web/Endpoints/ReviewsEndpoints.cs` — `MapReviewsEndpoints()`; register it in
   `Program.cs` inside the `if (features.Reviews)` block.

**Frontend** (`frontend/src`)
5. `features/reviews/` — `components/ hooks/ api/ types/` (self-contained).
6. Add the route under `app/[locale]/(storefront)/reviews/` and a nav entry in
   `config/nav.ts` (auto-hidden when the flag is off).
7. Add a `payload/collections/Reviews.ts` collection so content is CMS-editable.

**Contract**
8. Add the endpoints/schemas to `openapi/openapi.yaml` and run `pnpm gen:api`.

Validation runs automatically on every request via the MediatR
`ValidationBehaviour`, so every endpoint is validated by construction.

---

## E-commerce sections (each is its own module)

Hero · Categories · Product Listing · Product Detail · Cart · Checkout ·
Order Tracking · Search · Wishlist · Reviews · FAQ · Promotional Banners ·
About · Contact · Footer.

**Depth note (Phase 1):** the architecture, config-driven wiring, i18n / SEO /
security / CI and the test harness are production-grade. **Products, Categories,
Cart, Checkout/Orders** are wired end-to-end as the copy-me reference; the
remaining sections are scaffolded following the identical vertical-slice pattern
(real entity / DTO / endpoint / Payload collection / feature stub, flag-toggled)
so cloning and extending is mechanical. All section copy/images/order/visibility
is editable in the Payload admin — nothing is hardcoded in components.

---

## Quality standards built in

- **i18n** — next-intl ar/en switch, correct RTL/LTR per locale, hreflang tags.
- **SEO** — SSR/SSG via the Metadata API, JSON-LD (Product, Organization), auto
  `sitemap.xml` + `robots.txt` (next-sitemap), canonical + Open Graph.
- **Security** — validation on every endpoint, EF-only parameterized queries,
  CSRF (NextAuth) + XSS-safe rendering, security headers (CSP, HSTS,
  X-Frame-Options, X-Content-Type-Options), secrets via env, rate limiting on
  public endpoints.
- **Performance** — next/image (AVIF/WebP), code splitting / lazy below-the-fold,
  Redis caching for hot reads.
- **Responsive** — mobile-first Tailwind breakpoints (mobile / tablet / desktop).
- **Accessibility** — semantic HTML, ARIA, visible focus states, WCAG-AA contrast.

---

## Testing

```bash
# Backend
cd backend && dotnet test                      # xUnit unit tests (Application layer)
                                               # + Testcontainers integration (real Postgres)
# Frontend
cd frontend && pnpm test                        # Vitest + React Testing Library
                pnpm exec playwright test       # Playwright happy-path checkout E2E
```

CI (`.github/workflows/ci.yml`) runs lint, unit tests, build and a **Lighthouse
CI** step with minimum-score thresholds (see `frontend/lighthouserc.json`).

---

## Backlog — out of scope for Phase 1

Left as clear `// TODO(phase-2):` markers in code so nothing is lost:

- Telegram bot / factory dashboard / client CRM
- Other site-type templates (LMS, real-estate, restaurant, healthcare, …)
- AI orchestration layer (multi-model routing)
- Multi-tenant / white-label logic
- Real payment-provider integration (Tamara, Tabi) and ZATCA e-invoicing
