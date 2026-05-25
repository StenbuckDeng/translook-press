# Translook Press

Translation Content Publishing Platform — built with Next.js 15, Hono, Neon, Upstash Redis, and Cloudflare R2.

## Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: Neon PostgreSQL + Drizzle ORM
- **Cache**: Upstash Redis
- **Storage**: Cloudflare R2
- **Auth**: NextAuth v5
- **Deploy**: Vercel

## Local Setup

```bash
# 1. Install dependencies
npm install

# 2. Copy env file
cp .env.example .env.local
# Edit .env.local — add AUTH_SECRET (run: openssl rand -base64 32)

# 3. Push database schema
npm run db:push

# 4. Seed admin user
npx tsx scripts/seed.ts

# 5. Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

**Default admin:** `admin@translook.press` / `admin123456`

## Deployment (Vercel)

All environment variables are already configured in GitHub Secrets and Vercel.
Push to `main` to trigger auto-deploy.
