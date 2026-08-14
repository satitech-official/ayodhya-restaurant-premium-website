<div align="center">

# 🍽️ Ayodhya Restaurant — Premium Website

### A premium, responsive and modern restaurant experience for Ayodhya Restaurant, Betul

<img src="https://raw.githubusercontent.com/satitech-official/ayodhya-restaurant-premium-website/main/public/og.png" alt="Ayodhya Restaurant Premium Website Preview" width="100%" />

<br />

[![Repository](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/satitech-official/ayodhya-restaurant-premium-website)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsatitech-official%2Fayodhya-restaurant-premium-website)

![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=nextdotjs)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=111)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Ready-4169E1?style=flat-square&logo=postgresql&logoColor=white)

</div>

---

## ✨ Overview

Ayodhya Restaurant Premium Website is a production-ready Next.js restaurant experience built for **Ayodhya Restaurant, Betul**. It combines a polished customer-facing website with menu browsing, gallery, offers, reservations, contact features and an admin-ready backend architecture.

## 🌟 Key Features

- Premium responsive restaurant UI across desktop, tablet and mobile
- Interactive hero and polished motion effects
- Digital menu with categories, search and filters
- Signature dishes and recommended items
- Restaurant story and family dining sections
- Offers and promotional sections
- Experience gallery and social-style food feed
- Customer reviews and testimonials
- Reservation flow
- Contact and location experience
- Admin panel architecture
- PostgreSQL + Drizzle ORM support
- Local fallback data so public pages stay populated without a database
- Local image fallbacks to prevent broken-image layouts
- SEO, Open Graph and social sharing metadata

## 🛡️ Stability Improvements

- Public pages remain usable when `DATABASE_URL` is missing or temporarily unavailable.
- Bundled fallback menu, categories, offers, gallery and reviews keep the public website populated.
- Broken or expired external food images fall back to local branded artwork.
- A local Open Graph image is included at `public/og.png`.
- Duplicate menu category handling is normalized.
- Dynamic API routes follow the current Next.js async params pattern.
- Database-dependent APIs return a controlled `503` when PostgreSQL is not configured.
- Drizzle reads `.env.local` / `.env` rather than relying on a hard-coded database.
- External Google font build dependency was removed for more deterministic deployments.

## 🚀 Run Locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

The public website can render immediately using bundled fallback content.

## 🔐 Enable Admin, Reservations & Stored Contact Data

1. Copy `.env.example` to `.env.local`.
2. Add a valid PostgreSQL `DATABASE_URL`.
3. Set a strong `ADMIN_PASSWORD` and `AUTH_SECRET`.
4. Create and seed the database:

```bash
npm run db:push
npm run db:seed
```

Then open `/admin/login` and sign in using the configured admin credentials.

## ✅ Production Validation

```bash
npm run typecheck
npm run lint
npm run build
```

## ☁️ Recommended Deployment

Because this project contains **Next.js server routes, authentication, admin features and database-backed APIs**, deploy the full application on **Vercel or another Node.js-compatible platform** rather than a static-only GitHub Pages export.

Use the **Deploy with Vercel** button at the top of this README to import the repository while preserving the existing design and application architecture.

---

<div align="center">

### Built for Ayodhya Restaurant, Betul

**Premium dining. Better digital experience.**

</div>
