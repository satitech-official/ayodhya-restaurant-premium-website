# Ayodhya Restaurant Website

Premium Next.js restaurant website for Ayodhya Restaurant, Betul with menu, gallery, offers, reservations, contact forms and an admin panel.

## What is fixed in this build

- Public pages no longer crash when `DATABASE_URL` is missing or temporarily unavailable.
- Bundled fallback menu, categories, offers, gallery and reviews keep the website populated before database setup.
- Broken/expired external food images automatically fall back to local branded artwork instead of showing broken-image icons.
- Added a local Open Graph image (`public/og.png`) so social previews do not reference a missing file.
- Menu links such as `/menu?cat=dosa-specials` now open the requested category correctly.
- Dynamic API routes use the Next.js async `params` pattern.
- Database-dependent APIs return a clear `503` response when PostgreSQL is not configured instead of crashing the app.
- Drizzle configuration now reads `.env.local` / `.env` instead of a hard-coded localhost database.
- Google font network dependency was removed from the root layout so builds are more deterministic.
- Added production-safe `.env.example`, DB scripts and safer admin seeding.

## Run locally

```bash
npm install
npm run dev
```

The public website can render immediately with bundled fallback content.

## Enable the admin panel, reservations and contact storage

1. Copy `.env.example` to `.env.local`.
2. Add a valid PostgreSQL `DATABASE_URL`.
3. Set a strong `ADMIN_PASSWORD` and `AUTH_SECRET`.
4. Create the tables and seed initial content:

```bash
npm run db:push
npm run db:seed
```

Then open `/admin/login` and sign in with `ADMIN_EMAIL` / `ADMIN_PASSWORD` from your environment file.

## Validation commands

```bash
npm run typecheck
npm run lint
npm run build
```

> Note: External Pexels images are still used when available. Every rendered image now has a local branded fallback, so a third-party image failure does not break the layout.
