# ShopVerse - Next.js 16 SSR E-Commerce Platform

A production-ready e-commerce platform built with Next.js 16 App Router, TypeScript, and Tailwind CSS. It features a premium, modern design, server-side rendering for optimal SEO, and a fully functional UI.

## Features

- **Next.js 16 App Router**: Leverages Server Components for speed and SEO.
- **Premium UI**: Modern layout with Tailwind CSS v4, custom animations, and glassmorphism.
- **State Management**: Cart state powered by Zustand with `localStorage` persistence.
- **Mock Backend**: Comprehensive local data simulating a real API layer.
- **Search & Filtering**: Server-side product search, filtering by category, price, and rating.
- **SEO Optimized**: Dynamic metadata, structured JSON-LD data, robots.txt, and sitemap.
- **Authentication**: Pre-configured NextAuth (setup required) with complete Auth UI pages.

## Getting Started

1. **Clone & Install**
   ```bash
   npm install
   ```

2. **Environment Setup**
   Copy `.env.local.example` or create an `.env.local` file:
   ```bash
   NEXTAUTH_SECRET=your-secret-key
   NEXTAUTH_URL=http://localhost:3000
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```
   *(For full OAuth, populate `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`)*

3. **Run Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

## Tech Stack Overview
- Framework: `Next.js 16`
- Styling: `Tailwind CSS 4`
- Components: `Lucide React`
- State: `Zustand`
- Schema Validation: `Zod`
