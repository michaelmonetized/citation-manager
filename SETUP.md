# Citation Manager — Setup Guide for Production Launch

This guide walks through the final steps to launch citation-manager Phase 1 MVP.

## Prerequisites

Before starting, ensure you have:
1. ✅ Node.js 18+ installed
2. ✅ Bun installed (`curl -fsSL https://bun.sh/install | bash`)
3. ✅ GitHub CLI (`gh`) authenticated
4. ✅ Vercel CLI installed (optional, for deployment)

## Step 1: Set Up Convex Cloud Credentials

**Option A: Create New Convex Deployment (Recommended)**

```bash
cd ~/Projects/citation-manager

# Authenticate with Convex
bunx convex auth
# Follow prompts to create a Convex account or sign in

# Initialize deployment
npx convex dev
# This will:
# 1. Prompt for project name (e.g., "citation-manager-prod")
# 2. Create cloud deployment
# 3. Generate .env.local with NEXT_PUBLIC_CONVEX_URL
# 4. Start local dev server

# Keep this running in a terminal tab
```

**Option B: Use Existing Deployment**

If you already have a Convex deployment, update `.env.local`:

```bash
# Edit .env.local and add:
NEXT_PUBLIC_CONVEX_URL=https://your-deployment-name.convex.cloud
```

## Step 2: Verify Environment Setup

```bash
# Check that .env.local has required values
cat .env.local | grep NEXT_PUBLIC_CONVEX_URL

# Should output something like:
# NEXT_PUBLIC_CONVEX_URL=https://citation-manager-prod-xyz123.convex.cloud
```

## Step 3: Install Dependencies & Run

```bash
# Install dependencies
bun install

# Start development server
bun run dev
# Open http://localhost:3000
```

## Step 4: Initialize Database Schema

```bash
# In another terminal, push schema to Convex Cloud
npx convex push

# This will:
# 1. Validate all Convex functions
# 2. Upload schema to cloud
# 3. Generate TypeScript types
# 4. Create database tables
```

## Step 5: Seed Directory Registry

```bash
# In the Convex dashboard (opened automatically), run:
# POST /api/seed-directories

# OR via curl:
curl http://localhost:3000/api/seed-directories

# This will:
# 1. Parse data/directories.json (958 directories)
# 2. Create entries in Convex database
# 3. Index by category, region, API availability
```

## Step 6: Test Authentication

```bash
# Open http://localhost:3000/signup
# Create account with test email

# After signup, you should be redirected to:
# /dashboard → Create your first location
```

## Step 7: Add BrightLocal API Credentials (Optional, Phase 1B)

Once you have BrightLocal API key:

```bash
# Add to .env.local:
BRIGHTLOCAL_API_KEY=your_key_here

# Then implement in convex/integrations/brightlocal.ts
# (Skeleton is already created, ready for credentials)

# After adding, test via:
# POST /api/submit-brightlocal?locationId=xxx
```

## Step 8: Deploy to Vercel

```bash
# Link to Vercel project (or create new one)
vercel link

# Deploy
vercel deploy --prod

# This will:
# 1. Build Next.js app
# 2. Deploy to Vercel
# 3. Connect to Convex Cloud backend
```

## Step 9: Verify Production Build

```bash
# Test production build locally
npm run build
npm run start

# Visit http://localhost:3000
# Verify signup → login → location creation → submission flow
```

## Monitoring & Status

### Check Convex Cloud Dashboard
```bash
# Open Convex dashboard
npx convex dashboard

# View:
# - Real-time logs
# - Database stats
# - API usage
# - Error tracking
```

### Run Lint & Type Checks
```bash
npm run lint           # Linter (0 warnings target)
npm run type-check    # TypeScript strict mode
npm run build         # Full build
```

## Troubleshooting

### Error: "Cannot find module 'convex'"
```bash
# Regenerate Convex types
npx convex push
bun install
```

### Error: "NEXT_PUBLIC_CONVEX_URL not set"
```bash
# Ensure .env.local is populated
cat .env.local | grep NEXT_PUBLIC_CONVEX_URL

# If missing, run:
npx convex dev
# This will regenerate .env.local
```

### Error: "No address provided to ConvexReactClient"
Same as above — missing NEXT_PUBLIC_CONVEX_URL in .env.local

### Build failing on deployment
```bash
# Ensure all dependencies are installed
bun install

# Push schema to cloud
npx convex push

# Rebuild
npm run build
```

## What's Shipped (Phase 1 MVP)

✅ **Authentication**
- Passwordless signup/login with Convex Auth
- Session management
- Protected routes

✅ **Dashboard**
- Client overview
- Location management
- Submission tracking

✅ **Location Management**
- Create/edit/delete locations
- Store NAP (Name, Address, Phone)
- Track business details (website, hours, category)

✅ **Submissions**
- Track which directories each location was submitted to
- Status tracking (pending, submitted, verified, failed)
- Audit logs

✅ **Directory API Integrations**
- Google Business Profile (skeleton, ready for API key)
- BrightLocal (skeleton, ready for API key)
- Foundation for Yelp, Facebook, LinkedIn (Phase 2)

## Next Steps (Phase 2)

1. Implement BrightLocal API integration (once credentials available)
2. Add top 20 directory APIs (Google, Yelp, Facebook, LinkedIn, Bing)
3. Implement form automation for legacy directories (Playwright)
4. Add bulk import (CSV upload)
5. Real-time sync status
6. Advanced analytics

## Getting Help

- **GitHub Issues:** https://github.com/michaelmonetized/citation-manager/issues
- **Convex Docs:** https://docs.convex.dev
- **Next.js Docs:** https://nextjs.org/docs
- **Vercel Docs:** https://vercel.com/docs

---

*Citation Manager Phase 1 MVP — Ready for Production Launch*  
*Updated: 2026-03-24 by Rusty P. Shackelford*
