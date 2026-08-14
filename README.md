<div align="center">

<img src="https://raw.githubusercontent.com/satitech-official/ayodhya-restaurant-premium-website/main/public/og.png" alt="Ayodhya Restaurant Premium Website Preview" width="100%" />

<br />
<br />

# 🍽️ Ayodhya Restaurant — Premium Website

### Premium Restaurant Experience · Ganj, Betul, Madhya Pradesh

*Great Food. Great Moments. A Better Digital Experience.*

<br />

[![Live Demo](https://img.shields.io/badge/🌐_LIVE_DEMO-OPEN_WEBSITE-CB6A3A?style=for-the-badge&labelColor=171515)](https://satitech-official.github.io/ayodhya-restaurant-premium-website/)
[![GitHub Pages](https://img.shields.io/github/actions/workflow/status/satitech-official/ayodhya-restaurant-premium-website/deploy.yml?branch=main&label=GitHub%20Pages&style=for-the-badge)](https://github.com/satitech-official/ayodhya-restaurant-premium-website/actions/workflows/deploy.yml)
[![Next.js](https://img.shields.io/badge/Next.js-16-171515?style=for-the-badge&logo=nextdotjs)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-171515?style=for-the-badge&logo=react)](https://react.dev)

<br />

## 🚀 [OPEN LIVE WEBSITE](https://satitech-official.github.io/ayodhya-restaurant-premium-website/)

**Repository:** [satitech-official/ayodhya-restaurant-premium-website](https://github.com/satitech-official/ayodhya-restaurant-premium-website)

</div>

---

## ✨ About

A premium, responsive restaurant website created for **Ayodhya Restaurant, Betul**. The experience combines a modern restaurant presentation with animated sections, menu discovery, gallery, offers, reviews, table reservation, contact and location features.

## 🌟 Website Highlights

- Premium responsive UI for desktop, tablet and mobile
- Animated hero with locally bundled fallback imagery
- Digital menu with categories, search and filters
- Signature dishes and dosa experience
- Restaurant story and family dining sections
- Offers, combos and promotional content
- Gallery and social-style food feed
- Customer reviews and Google review links
- Reservation experience
- Contact and Google Maps integration
- Instagram, phone and WhatsApp actions
- SEO and Open Graph metadata
- Local fallback content so the public site stays populated without a database

## 🛠️ Tech Stack

- Next.js 16
- React 19
- Tailwind CSS 4
- Framer Motion
- Lucide React
- PostgreSQL
- Drizzle ORM

## 🌐 GitHub Pages Deployment

The repository includes an automated GitHub Actions workflow at `.github/workflows/deploy.yml`.

For GitHub Pages, the workflow creates a **public static build** using bundled fallback restaurant data. Server-only admin and API routes are excluded only inside the temporary Actions build workspace and remain untouched in the repository.

Reservation and contact forms use a WhatsApp fallback on the GitHub Pages version so visitors still have a working action on static hosting.

### Live URL

https://satitech-official.github.io/ayodhya-restaurant-premium-website/

## 🔐 Full Admin / Database Deployment

The source repository still contains the full admin panel, authentication, API routes and PostgreSQL/Drizzle architecture. For those server-side features, deploy the same repository on a Node.js-compatible platform such as Vercel and configure the required environment variables.

## 💻 Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## ✅ Production Checks

```bash
npm run typecheck
npm run lint
npm run build
```

---

<div align="center">

### Ayodhya Restaurant · Betul

**Premium dining, presented beautifully online.**

Built by **Sati Technologies**

</div>
