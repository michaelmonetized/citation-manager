# Citation Manager — Citation Management SaaS

Manage business citations across 958+ online directories. A modern, API-first alternative to Uberall, BrightLocal, and Yext.

## Status
**Phase 1 MVP: 70% Complete** — Auth ✅, Locations ✅, Google Maps ✅ | Awaiting: Convex credentials, BrightLocal API key

See [GitHub Issues](https://github.com/michaelmonetized/citation-manager/issues) for detailed task breakdown.

## Tech Stack
- **Frontend:** Next.js 16, React 19, Tailwind v4
- **Authentication:** Convex Auth (passwordless signup/login)
- **Backend:** Convex (multi-tenant, real-time)
- **Infrastructure:** Vercel, Convex Cloud
- **Payments:** Stripe (TBD for Phase 2)
- **Analytics:** PostHog (TBD for Phase 2)

## Quick Start
```bash
# Setup
cp .env.example .env.local
# Add NEXT_PUBLIC_CONVEX_URL to .env.local
bun install

# Development
bun run dev
# Open http://localhost:3000
# Sign up with your email
# Create location and test submissions
```

## Architecture
- **Multi-tenant:** Each client manages their own locations and submissions
- **Locations:** Store NAP (Name, Address, Phone) + website + hours + category
- **Submissions:** Track which directories each location was submitted to
- **Integrations:** API-based + form automation (Playwright for legacy sites)
- **Queue system:** Rate-limit submissions to respect directory API limits

## Roadmap

### Phase 1: MVP (70% Done)
- [x] Convex Auth (signup/login)
- [x] Client dashboard + location CRUD
- [x] Company profile form
- [x] Submission tracking schema
- [ ] Google Maps API integration (ready, needs credentials)
- [ ] BrightLocal API integration (blocked: needs API key)
- [ ] Directory registry (958 directories mapped)

### Phase 2: Core Integrations (3-4 weeks)
- [ ] Top 20 directory APIs (Google, Yelp, Facebook, LinkedIn, Bing, etc.)
- [ ] Form automation for legacy directories (Playwright)
- [ ] Real-time submission status tracking
- [ ] NAP consistency auditing
- [ ] Bulk import (CSV upload)

### Phase 3: Scale & Polish (2-3 weeks)
- [ ] 100+ directory integrations
- [ ] Advanced analytics (coverage %, consistency %, visibility impact)
- [ ] Automated review collection
- [ ] Customer support tools
- [ ] Production security audit

### Phase 4: Monetization (Ongoing)
- [ ] Stripe integration (subscription billing)
- [ ] Freemium model (2 locations free, $99/mo for unlimited)
- [ ] API access for partners
- [ ] Marketplace (partner integrations)

## Pricing (Post-Phase 1)
- **Starter:** Free, 1 location, 50 submissions/month (popular directories only)
- **Professional:** $99/month, 5 locations, unlimited submissions to 500+ directories
- **Business:** $299/month, unlimited locations, advanced analytics + priority support
- **Enterprise:** Custom pricing, dedicated integrations, white-label option

## Revenue Model
- **Target:** 100 agencies @ $100-500/month per client location = $50K+/month MRR
- **Opportunity:** Replace $500-2000/month BrightLocal/Yext subscriptions with $99 alternative
- **Moat:** Proprietary integrations to directories with restricted API access

## Development

### Environment Setup
```bash
# Copy example env file
cp .env.example .env.local

# Add required credentials to .env.local:
# - NEXT_PUBLIC_CONVEX_URL: Get from npx convex dev
# - Convex auth is handled automatically via Convex Cloud
```

### Available Commands
```bash
# Development
bun run dev              # Start Next.js + Convex dev
npx convex dev          # Convex backend + type generation
npm run build           # Production build
npm run lint            # Run linter (oxlint)
npm run type-check      # TypeScript strict mode check

# Database
npx convex push         # Deploy Convex schema to cloud
npx convex pull         # Pull latest schema from cloud
convex/seed.ts          # See example seed mutations
```

### Project Structure
```
citation-manager/
├── app/                    # Next.js app router
│   ├── (auth)/            # Auth pages (signup, login)
│   ├── (protected)/       # Protected routes (require login)
│   │   ├── dashboard/     # Client dashboard
│   │   ├── locations/     # Location management
│   │   └── submissions/   # Submission tracking
│   └── page.tsx           # Landing page
├── convex/                # Convex backend
│   ├── schema.ts          # Database schema
│   ├── auth.ts            # Authentication queries/mutations
│   ├── locations.ts       # Location CRUD
│   ├── submissions.ts     # Submission tracking
│   ├── integrations/      # Directory API integrations
│   │   ├── googleBusiness.ts
│   │   ├── brightlocal.ts (TODO)
│   │   └── ...
│   ├── seedDirectories.ts # Directory registry setup
│   └── _generated/        # Auto-generated Convex types
├── data/                  # Static data
│   └── directories.json   # 958 directory registry + API metadata
├── lib/                   # Utilities
│   ├── auth.ts            # Auth helpers
│   ├── convex.ts          # Convex client setup
│   └── types.ts           # TypeScript types
└── components/            # React components
    ├── auth/              # Auth forms
    ├── layouts/           # Page layouts
    └── ui/                # Reusable UI components
```

### Key Files
- **`convex/schema.ts`** — Database schema (clients, locations, directories, submissions, credentials)
- **`data/directories.json`** — Registry of 958+ directories with API metadata
- **`convex/integrations/`** — Directory API implementations (plug-in new ones here)
- **GitHub Issues** — Detailed task breakdown and acceptance criteria

### Testing Locally
1. Sign up at `http://localhost:3000/signup`
2. Create a location: Navigate to Dashboard → Locations → Add Location
3. Submit to directories: Dashboard → Locations → Select location → Submit
4. Track submissions: View submission status in real-time

### Debugging
```bash
# View Convex console logs
npx convex logs

# Check Convex database state
npx convex query

# Reset local Convex data (careful!)
rm -rf .convex/
npx convex dev
```

## Blockers & Next Steps
See [COMPLETED-YYYY-MM-DD.md](../COMPLETED-2026-03-24.md) for current blockers and recommendations.
