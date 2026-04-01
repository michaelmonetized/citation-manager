# Phase 2B — Findings & Blockers

**Date:** 2026-04-01  
**Tester:** Rusty P. Shackelford

---

## Current State Assessment

### ✅ What's Built & Ready
1. **Frontend Pages Exist**
   - `/app/submit/page.tsx` — Submit form with location selector + directory checkboxes + bulk selection
   - `/app/submissions/page.tsx` — Dashboard showing submission status + counts + progress bar
   - Both pages are fully styled with Tailwind, responsive design
   - UI/UX is polished and matches design system

2. **API Routes Exist**
   - `/api/integrations/google/route.ts` — POST (submit) + PUT (verify)
   - `/api/integrations/yelp/route.ts` — POST (submit) + PUT (verify)
   - `/api/integrations/facebook/route.ts` — POST (submit) + PUT (verify)
   - All properly typed, error-handled, with correct HTTP methods

3. **Backend Mutations Exist**
   - `convex/submitGoogle.ts` — Full submit + verify implementation
   - `convex/submitYelp.ts` — Full submit + verify implementation
   - `convex/submitFacebook.ts` — Full submit + verify implementation
   - `convex/submissions.ts` — bulkSubmit + getLocationSubmissions + getSubmissionStatus
   - Database schema supports all required fields (status, errorMessage, timestamps, etc.)

4. **Integration Libraries Ready**
   - `convex/integrations/googleBusiness.ts` — Complete with retry logic + error handling
   - `convex/integrations/yelp.ts` — Complete with retry logic + error handling
   - `convex/integrations/facebook.ts` — Complete with Instagram linking support

---

## 🚨 CRITICAL BLOCKER: Authentication

### The Problem
Pages at `/app/submit` and `/app/submissions` are **not protected** and call Convex queries without authentication.

When navigating to `/submit`, we get:
```
[CONVEX Q(locations:listLocations)] Not authenticated
Uncaught Error: Not authenticated
```

### Root Cause
- `convex/locations.ts` uses `getUserFromAuth()` which requires `ctx.auth.getUserIdentity()`
- But no authentication middleware/provider is configured on the frontend
- No route protection (no `/app/(protected)` directory)
- No Convex auth setup (no `convex/auth.config.ts`)

### Why This Matters
Phase 2B task description said: *"Build /app/(protected)/submit/page.tsx"*

But the actual implementation skipped:
1. ✗ Route group for protection (`(protected)`)
2. ✗ Auth middleware
3. ✗ Convex auth configuration
4. ✗ Session management

### What's Required to Fix
**Option A: Add Clerk Auth (Recommended)**
- Install `@clerk/nextjs` + Clerk provider
- Wrap Convex client with Clerk auth token
- Add ClerkMiddleware to Next.js
- Create `/app/(protected)` route group with `<ClerkLoading>` fallback
- ~2 hours to implement

**Option B: Implement Custom Auth (Current Path)**
- Convex auth.config.ts with session tokens
- JWT tokens stored in cookies
- Custom auth middleware
- ~3 hours to implement

**Option C: Skip Auth for Phase 2B (Testing Only)**
- Remove auth checks from Convex queries temporarily
- Test API routes directly (don't require auth)
- Re-add auth in Phase 2C before production
- ~30 mins to implement

---

## Testing Strategy: Phase 2B Without Auth Fix

Since fixing auth is out of scope for Phase 2B (which is "Manual Testing & Frontend Integration"), we'll **test the API routes directly**, which don't require authentication.

### Direct API Route Testing (No Auth Required)

The API routes accept:
```bash
POST /api/integrations/google
{
  "locationId": "some_id",
  "directoryId": "dir_id"
}
```

These routes call Convex mutations **from the server**, so they bypass auth.

### Test Plan (Revised)

1. **Create test locations in Convex directly** (via seed/admin)
2. **Call API routes from curl/Postman** (not from frontend)
3. **Check submission records created in Convex**
4. **Verify status updates work**
5. **Verify error handling works**
6. **Document what works/doesn't**

---

## Submission Records in Convex (Current State)

Checking the database structure:

```typescript
// Current schema in convex/schema.ts
submissions: defineTable({
  locationId: v.id("locations"),
  directoryId: v.id("directories"),
  status: v.union(
    v.literal("pending"),
    v.literal("submitted"),
    v.literal("verified"),
    v.literal("failed")
  ),
  errorMessage: v.optional(v.string()),
  createdAt: v.number(),
  submittedAt: v.optional(v.number()),
  verifiedAt: v.optional(v.number()),
})
  .index("by_locationId", ["locationId"])
  .index("by_directoryId", ["directoryId"])
```

**This is ready.** No schema changes needed.

---

## Directory Data (Current State)

From the code:
- Locations: Created via `/api/seed-directories` endpoint
- Directories: 958 total, loaded via `convex/directories.ts`
- Both should be populated in dev environment

**Action:** Verify seed data exists before testing APIs.

---

## API Key Status

### Google Business Profile
- **Status:** ❓ Unknown (need to check .env)
- **Error Handling:** ✅ Present (throws meaningful errors)
- **Fallback:** ✅ Returns `{ success: false, error: "..." }` on missing credentials

### Yelp Business API
- **Status:** ❓ Unknown (need to check .env)
- **Error Handling:** ✅ Present
- **Fallback:** ✅ Returns error object on missing credentials

### Facebook Graph API
- **Status:** ❓ Unknown (need to check .env)
- **Error Handling:** ✅ Present
- **Fallback:** ✅ Returns error object on missing credentials

**Critical Action:** Check what API keys are actually configured in environment.

---

## Revised Phase 2B Deliverables

### ✅ Delivered
1. Submit page UI (fully built, responsive, feature-complete)
2. Submissions dashboard UI (fully built, responsive, feature-complete)
3. API routes (fully built, properly typed, error-handled)
4. Backend mutations (fully built, ready to execute)
5. Integration libraries (fully built, retry logic included)

### ⚠️ Partially Delivered
1. **Authentication** — Pages exist but are not protected; no auth middleware
2. **API Credentials** — Integration files reference env vars; unclear if set

### 🔄 In Progress
1. Manual smoke testing (blocked by auth + API key verification)

---

## Decisions to Make

### Decision 1: Fix Authentication?
- **In Scope?** Task says "Manual Testing", not "Fix Auth"
- **Recommendation:** Document as blocker, note requires Clerk/custom auth implementation
- **Impact:** Cannot test UI without auth; can test API routes

### Decision 2: Proceed Without Auth Fix?
- **Approach:** Test API routes via curl/Postman, skip frontend UI testing
- **Recommendation:** Yes — this unblocks Phase 2B deliverables assessment
- **Output:** Test report showing "API routes work, UI blocked by auth"

### Decision 3: Test Without Real API Keys?
- **Approach:** Mock responses or test error paths
- **Recommendation:** Test both happy path (with real keys) and error path (missing keys)
- **Output:** Documentation of what's broken vs. what's missing

---

## Commit/PR Ready?

**Current state:** NO

**Why:**
1. Pages exist but are not protected (violates spec: `/app/(protected)/...`)
2. Auth system incomplete (throws errors on page load)
3. API keys not configured (API calls will fail)

**What's needed before PR:**
1. ✅ Frontend code quality — GOOD
2. ✅ API route quality — GOOD
3. ✅ Integration code quality — GOOD
4. ❌ Authentication — MISSING
5. ❌ Environment configuration — MISSING

---

## Recommendations

1. **Do NOT merge to main** until auth is fixed
2. **Staging branch:** Push this version to `staging/phase-2b-frontend` for reference
3. **Next sprint:** Start with **Clerk auth implementation** (highest ROI, unblocks team)
4. **Testing report:** Document API route functionality even without auth
5. **Architecture review:** Schedule `/plan-eng-review` before continuing

---

## Time Estimates

| Task | Effort | Blocker |
|------|--------|---------|
| Add Clerk auth | 2-3 hours | YES (needed for Phase 2B completion) |
| Fix route protection | 1 hour | YES (required by spec) |
| Set API credentials | 1 hour | YES (needed for smoke testing) |
| Complete smoke testing | 2 hours | Depends on above |
| Deploy to staging | 30 mins | Depends on above |

**Total to completion:** 6.5 hours

---

