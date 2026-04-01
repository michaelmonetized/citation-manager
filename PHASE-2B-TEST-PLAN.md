# Phase 2B: Manual Testing & Frontend Integration — Test Plan

**Status:** In Progress  
**Date:** 2026-04-01  
**Tester:** Rusty P. Shackelford (Engineering Director)

---

## Execution Plan

### 1. **Frontend Assessment** ✅
- [x] `/app/(protected)/submit/page.tsx` — Exists and ready
- [x] `/app/(protected)/submissions/page.tsx` — Exists and ready
- [x] Both pages wired to Convex queries/mutations
- [x] Directory listing with search + bulk selection implemented
- [x] Status summary card + progress bar + error display implemented

### 2. **API Routes Assessment** ✅
- [x] `/api/integrations/google/route.ts` — Exists (POST + PUT)
- [x] `/api/integrations/yelp/route.ts` — Exists (POST + PUT)
- [x] `/api/integrations/facebook/route.ts` — Exists (POST + PUT)
- [x] All routes properly typed and error-handled

### 3. **Backend Mutations Assessment** ✅
- [x] `submitGoogle()` → Creates submission record + calls API
- [x] `submitYelp()` → Creates submission record + calls API
- [x] `submitFacebook()` → Creates submission record + calls API
- [x] `bulkSubmit()` → Creates N submission records for bulk selection
- [x] `getLocationSubmissions()` → Retrieves all submissions for a location
- [x] `getSubmissionStatus()` → Computes status summary + completion %

### 4. **Manual Smoke Testing** (CURRENT PHASE)

#### Test Matrix
| API | Test Case | Expected Result | Status |
|-----|-----------|-----------------|--------|
| Google | Submit to Google | Submission record created (status: pending/submitted) | ⏳ PENDING |
| Google | Verify on Google | Status updated to verified OR error logged | ⏳ PENDING |
| Yelp | Submit to Yelp | Submission record created (status: pending/submitted) | ⏳ PENDING |
| Yelp | Verify on Yelp | Status updated to verified OR error logged | ⏳ PENDING |
| Facebook | Submit to Facebook | Submission record created (status: pending/submitted) | ⏳ PENDING |
| Facebook | Verify on Facebook | Status updated to verified OR error logged | ⏳ PENDING |
| UI | Bulk Submit 5 Directories | 5 submission records created, status page shows them | ⏳ PENDING |
| UI | Filter Directories | Typing filters directory list correctly | ⏳ PENDING |
| UI | Success Message | Shows "Successfully submitted to N directories" after submit | ⏳ PENDING |
| UI | Error Handling | Shows error message when API fails | ⏳ PENDING |

#### Test Data (Ready)
```typescript
// Using demo location + test directories
testLocation: {
  businessName: "Rusty's Roadside Diner",
  address: "123 Main St",
  city: "Springfield",
  state: "IL",
  zipCode: "62701",
  phone: "+1-217-555-0199",
  website: "https://rustysdiner.example.com"
}

testDirectories: [
  "Google Business Profile",
  "Yelp",
  "Facebook",
  "Apple Maps",
  "Bing Places"
]
```

---

## Phase 2B Deliverables (This Sprint)

### ✅ Done
1. Submit Page — Lists all 958 directories, supports bulk selection, wired to API
2. Submissions Dashboard — Shows all submissions with status, error messages, timestamps
3. API Routes — Properly integrated with Convex mutations
4. Convex Mutations — Handle bulk submissions + status tracking

### 🔄 In Progress
1. Manual Smoke Testing — Test 2+ APIs with real data
2. Browser-based verification — Check UI flow end-to-end

### ⏳ Next (Phase 2C)
1. Rate Limiting — For >100 submissions/day
2. Background Poller — For verification status polling
3. Analytics Dashboard — Submission metrics + success rates

---

## Test Results

### Test 1: Frontend — Submit Page Load
**Status:** ⏳ Starting...
- Check page loads without errors
- Verify location dropdown populated
- Verify directory list shows top 50
- Verify "View All 958" button toggles correctly

### Test 2: Frontend — Bulk Selection
**Status:** ⏳ Starting...
- Select 5 directories from list
- Verify counter shows "Selected: 5 directories"
- Submit form shows "Submit to 5 Directories"
- Submit button is enabled

### Test 3: API — Google Submission
**Status:** ⏳ Starting...
- Verify API route accepts POST with locationId + directoryId
- Check response has submissionId
- Verify submission record created in Convex
- Check status is "submitted" or "pending"

### Test 4: API — Yelp Submission
**Status:** ⏳ Starting...
- Same as Google test
- Verify Yelp-specific error handling

### Test 5: API — Facebook Submission
**Status:** ⏳ Starting...
- Same as Google test
- Verify Facebook-specific error handling

### Test 6: Dashboard — Status Summary
**Status:** ⏳ Starting...
- Navigate to /submissions page
- Select location
- Verify status cards show correct counts
- Verify progress bar updates correctly

---

## Known Issues & Risks

### 1. **API Authentication** (BLOCKER)
- Google Business Profile, Yelp, Facebook APIs all require valid credentials
- Currently using environment variables (GOOGLE_ACCESS_TOKEN, YELP_API_KEY, FACEBOOK_ACCESS_TOKEN)
- **Risk:** If env vars missing or expired, all tests will fail at API call stage
- **Mitigation:** Check .env.local for valid tokens before running tests

### 2. **Rate Limiting** (WARNING)
- No rate limiting implemented yet
- Bulk submissions to 100+ directories could trigger rate limit errors
- **Mitigation:** For initial testing, use small batch sizes (5-10 directories)

### 3. **Verification Polling** (EXPECTED)
- Verification updates are not automated yet (Phase 2C feature)
- Submission status will show "submitted" but NOT progress to "verified" automatically
- **Mitigation:** This is expected behavior for Phase 2B; verification is manual or requires background job

---

## Deployment Readiness Checklist

- [ ] All frontend pages load without console errors
- [ ] Bulk submission creates correct number of submission records
- [ ] At least 2/3 APIs (Google, Yelp, Facebook) successfully submit
- [ ] Error messages display correctly on submission failure
- [ ] Submissions Dashboard shows accurate status counts
- [ ] No TypeScript errors after build
- [ ] Styling is consistent (Tailwind classes applied correctly)
- [ ] Mobile responsiveness tested (grid layout responsive)

---

## Next Steps After Phase 2B

1. **Background Verification Poller** — Convex cron job to check verification status daily
2. **Rate Limiter** — Redis/Upstash for API rate limiting
3. **Analytics** — Track submission success rates per directory
4. **Staging Deployment** — Deploy to Vercel staging environment
5. **Production Verification** — Verify with real business accounts

