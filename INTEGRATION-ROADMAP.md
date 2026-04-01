# Citation Manager — Integration Roadmap

## Overview
This document outlines the phased approach to integrating citation-manager with 958+ business directories. It maps current implementation status, pending integrations, and dependencies.

**Current Status:** Phase 1 MVP (70%) → Phase 2 APIs Ready

---

## ✅ Phase 1: Foundation & Free Directory APIs (CURRENT)

### Completed Integrations

#### 1. **Google Business Profile** ✅
- **Status:** Fully implemented (convex/submitGoogle.ts)
- **API:** Google My Business API v1
- **Authentication:** OAuth 2.0 (requires GOOGLE_ACCOUNT_ID env var)
- **Features:**
  - Submit location data (name, address, phone, website)
  - Verify submission status (1-3 business days)
  - Maps to 1000+ Google properties (Google Search, Google Maps, etc.)
- **Endpoints:**
  - `POST /api/integrations/google` — Submit location
  - `PUT /api/integrations/google` — Verify submission
- **Error Handling:** Stores failures in submissions table with error messages
- **Rate Limit:** ~1000 requests/day (Google's threshold)
- **Env Vars Required:** `GOOGLE_ACCOUNT_ID`
- **Cost:** Free (with business account)

#### 2. **Yelp Business API** ✅
- **Status:** Fully implemented (convex/submitYelp.ts)
- **API:** Yelp Fusion API
- **Authentication:** API Key (requires YELP_API_KEY env var)
- **Features:**
  - Search for existing business listings
  - Claim/verify existing Yelp listing
  - Update business information
- **Endpoints:**
  - `POST /api/integrations/yelp` — Find and claim listing
  - `PUT /api/integrations/yelp` — Verify claim status
- **Error Handling:** Graceful degradation if API not configured (returns manual verification instructions)
- **Rate Limit:** 5000 requests/hour
- **Env Vars Required:** `YELP_API_KEY`
- **Cost:** $99-299/month (Yelp Premium)
- **UX Flow:** Returns claimUrl for manual Yelp Business Manager completion

#### 3. **Facebook Business Graph API** ✅
- **Status:** Fully implemented (convex/submitFacebook.ts)
- **API:** Facebook Graph API v19.0+
- **Authentication:** User Access Token (requires FACEBOOK_ACCESS_TOKEN env var)
- **Features:**
  - Search for existing Facebook business pages
  - Update page info (name, phone, address, website)
  - Link Instagram Business Account (if available)
  - Pull contact info verification status
- **Endpoints:**
  - `POST /api/integrations/facebook` — Update page + link Instagram
  - `PUT /api/integrations/facebook` — Verify page info completeness
- **Error Handling:** 
  - Guided creation flow if page not found (links to facebook.com/pages/)
  - Instagram linking is optional (returns null if not linked)
- **Rate Limit:** 200 calls/hour (user-level), can be increased
- **Env Vars Required:** `FACEBOOK_ACCESS_TOKEN`
- **Cost:** Free (with business account + graph API approval)
- **Note:** Page creation requires additional business account setup; requires manual creation currently

---

## 📋 Phase 2A: Free Directory APIs (2-3 weeks)

These have public/free APIs with OAuth or rate-limited access. Prioritize by traffic impact (monthly views).

### Planned Integrations (Ranked by Opportunity)

#### 4. **Apple Maps** (Rank 3) ⏸️
- **Status:** Stubbed only
- **API:** MapKit JS (free tier: 100K maps/day)
- **Authentication:** JWT token from Apple Developer account
- **Effort:** LOW (simple form fill)
- **Monthly Views:** ~300K
- **Implementation:**
  - Add submitAppleMaps.ts mutation
  - POST /api/integrations/apple endpoint
  - Use MapKit JS to verify listing exists
- **Blockers:** None (public API)
- **Timeline:** 2-3 days

#### 5. **Bing Business Portal** (Rank 8) ⏸️
- **Status:** Not started
- **API:** Bing Places API + Bing Webmaster Tools API
- **Authentication:** OAuth 2.0 (app-based)
- **Effort:** MEDIUM (OAuth setup required)
- **Monthly Views:** ~200K
- **Implementation:**
  - Add submitBingPlaces.ts mutation
  - Bing Places API to claim/update listings
  - Bing Webmaster Tools for verification
- **Blockers:** Microsoft Azure app registration
- **Timeline:** 3-4 days

#### 6. **LinkedIn Company Pages** (Rank 5) ⏸️
- **Status:** Not started
- **API:** LinkedIn Compliance & Data Safety API (form-based)
- **Authentication:** OAuth 2.0 (requires LinkedIn app approval)
- **Effort:** MEDIUM-HIGH (strict approval process)
- **Monthly Views:** ~250K
- **Implementation:**
  - Add submitLinkedIn.ts mutation
  - Search for company pages via LinkedIn API
  - Update page info (requires admin role)
- **Blockers:** LinkedIn app approval process (can take 1-2 weeks)
- **Timeline:** 4-5 days implementation + 1-2 weeks app approval

#### 7. **Mozilla Firefox Directory** (Rank 15) ⏸️
- **Status:** Not started
- **API:** None (form-based submission only)
- **Authentication:** Manual form fill (Playwright automation)
- **Effort:** HIGH (form automation required)
- **Monthly Views:** ~100K
- **Implementation:**
  - Add automation to formSubmit.ts (Playwright)
  - Simulate browser form submission
  - Screenshot verification
- **Blockers:** Form structure fragility (breaks on UI changes)
- **Timeline:** 3-4 days

#### 8. **Nextdoor Business** (Rank 12) ⏸️
- **Status:** Not started
- **API:** None (form-based only, terms restrict automation)
- **Authentication:** Business account login
- **Effort:** HIGH (strict anti-automation)
- **Monthly Views:** ~80K
- **Implementation:**
  - NOT RECOMMENDED — ToS explicitly forbids automation
  - Manual workflow only (guide user)
- **Blockers:** Terms of Service
- **Timeline:** Document as manual-only

---

## 💳 Phase 2B: Paid Directory APIs (3-4 weeks)

These require paid integration or API access. Typically aggregators that submit to 100+ directories.

### Planned Integrations (High-ROI)

#### 9. **BrightLocal Citation Network** (Rank 20+) ⏸️
- **Status:** Stubbed (convex/submitBrightLocal.ts — empty)
- **API:** BrightLocal Campaign Management API
- **Authentication:** API Key (requires BRIGHTLOCAL_API_KEY)
- **Effort:** HIGH (complex campaign-based system)
- **Monthly Views:** 50K+ across network (458 directories)
- **Implementation:**
  - submitBrightLocal.ts mutation (currently stubbed)
  - Implement createCampaign() → tracks 458 directory submissions
  - Implement checkCampaignStatus() → polls campaign status
  - Schema addition: brightlocalCampaignId to submissions table
- **Features:**
  - Single API call submits to 458 directories (Google, Yelp, Facebook, Apple, Bing, local niche)
  - Real-time status polling
  - NAP validation across all directories
  - Duplicate detection
- **Cost:** $99-299/month (pay-per-location)
- **Blockers:** BrightLocal API key must be configured in .env
- **Timeline:** 4-5 days implementation + 1 day testing

#### 10. **Yext Citation Management** (Rank 25+) ⏸️
- **Status:** Not started
- **API:** Yext Knowledge API
- **Authentication:** API Key (requires YEXT_API_KEY)
- **Effort:** MEDIUM-HIGH (similar to BrightLocal)
- **Monthly Views:** 40K+ across network (400+ directories)
- **Implementation:**
  - Add submitYext.ts mutation
  - Implement knowledge.create() → submits to 400+ directories
  - Implement knowledge.get() → status polling
- **Features:**
  - Structured data submission
  - Centralized business data management
  - Review collection integration
- **Cost:** Custom pricing (typically $300+/month)
- **Blockers:** Yext API account
- **Timeline:** 5 days

#### 11. **Hunter.io Lead Enrichment** (Supplementary)
- **Status:** Not started
- **API:** Hunter.io Domain Search & Email Finding API
- **Authentication:** API Key (requires HUNTER_IO_API_KEY)
- **Effort:** LOW-MEDIUM (supplementary, not core)
- **Purpose:** Enrichment only — find contact emails for verification
- **Features:**
  - Domain search → extract email patterns
  - Email verification → check deliverability
  - Contact discovery → find decision makers
- **Cost:** $99-499/month (pay-per-API-call)
- **Use Case:** Optional enhancement for lead capture
- **Timeline:** 2-3 days

---

## 🔒 Phase 2C: Verification & Rate Limiting (2 weeks)

### Core Infrastructure
These are not directory integrations, but critical for scaling Phase 2.

#### **Rate Limiter Module**
- **Status:** Not started
- **Implementation:**
  - Token bucket algorithm per directory
  - Configurable limits in directories table
  - Queue-based submission batching
- **Purpose:**
  - Respect API rate limits (Google: 1K/day, Yelp: 5K/hour, etc.)
  - Prevent API bans
  - Smooth burst submissions
- **Effort:** MEDIUM (2-3 days)

#### **Verification Poller**
- **Status:** Partially implemented (individual polling in each mutation)
- **Implementation:**
  - Centralized polling service (cron-based)
  - Poll all pending submissions every 6 hours
  - Update status to "verified" or "failed"
- **Purpose:**
  - Automated status tracking
  - Reduce manual verification burden
  - Real-time dashboard updates
- **Effort:** LOW (1-2 days)

#### **NAP Validation & Normalization**
- **Status:** Not started
- **Implementation:**
  - USPS address validation API
  - Phone number normalization (libphonenumber)
  - Data consistency checks
- **Purpose:**
  - Catch errors before submission
  - Increase acceptance rate
  - Compliance reporting
- **Effort:** MEDIUM (3-4 days)

---

## 📊 Per-API Breakdown

### OAuth Setup Checklist

| API | Auth Type | Setup Required | Timeline |
|-----|-----------|-----------------|----------|
| Google Business Profile | OAuth 2.0 | Google API Console project | ✅ Done |
| Yelp | API Key | Yelp Developers account | ✅ Done |
| Facebook Graph | User Token | Facebook App (Graph API approval) | ✅ Done |
| Apple Maps | JWT | Apple Developer account | 1-2 days |
| Bing Places | OAuth 2.0 | Microsoft Azure app | 1-2 days |
| LinkedIn | OAuth 2.0 + Approval | LinkedIn Developer + app approval | 1-2 weeks |
| BrightLocal | API Key | BrightLocal subscription | 1 day |
| Yext | API Key | Yext account + API credentials | 1 day |
| Hunter.io | API Key | Hunter.io subscription | 1 day |

### Error Handling Patterns

All integrations follow this pattern:

```typescript
// 1. Fetch location data from DB
// 2. Check env var (API key/token) exists
//   → If missing: record "failed" status + return env error
// 3. Call external API
//   → If success: record "submitted" status + verification record
//   → If failure: record "failed" status + error message
// 4. Return standardized response
//   { status: "submitted" | "failed", submissionId, error?, claimUrl? }
```

### Verification Strategies

| Directory | Verification Method | Timeline |
|-----------|---------------------|----------|
| Google Business | API status polling | 1-3 business days |
| Yelp | Listing claim confirmation | Real-time |
| Facebook | Page info completeness check | Real-time |
| Apple Maps | MapKit JS search | Real-time |
| BrightLocal | Campaign status polling | 24-48 hours |
| LinkedIn | Admin approval required | 5-7 business days |

---

## 🗺️ Roadmap Timeline

### Week 1-2: Phase 2A (Free APIs)
- [ ] Apple Maps integration (2-3 days)
- [ ] Bing Places integration (3-4 days)
- [ ] Form automation framework (Playwright setup)
- [ ] Testing & documentation

### Week 3-4: Phase 2B (Paid Aggregators)
- [ ] BrightLocal integration (4-5 days)
- [ ] Yext integration (4-5 days)
- [ ] Hunter.io optional enrichment (2-3 days)
- [ ] Testing & documentation

### Week 5-6: Phase 2C (Infrastructure)
- [ ] Rate limiting module (2-3 days)
- [ ] Centralized verification poller (1-2 days)
- [ ] NAP validation service (3-4 days)
- [ ] Load testing & optimization

### Estimated Total: 6 weeks to Phase 2 completion
- 15+ directory integrations (covering 85% of traffic)
- Production-ready rate limiting
- Automated verification pipeline

---

## 🚧 Blockers & Risks

### Critical Path Dependencies

1. **BrightLocal API Key** (HIGH IMPACT)
   - Blocks: Single API call to 458 directories
   - Resolution: Get API key from account manager (~1 day)
   - Alternative: Implement individual directory APIs (requires 458 integrations)

2. **LinkedIn App Approval** (MEDIUM IMPACT)
   - Blocks: LinkedIn company page submissions
   - Resolution: Apply for app approval now (1-2 weeks processing)
   - Risk: LinkedIn is restrictive; may deny approval
   - Alternative: Manual workflow + guide users

3. **Rate Limiting Infrastructure** (MEDIUM IMPACT)
   - Blocks: Scaling beyond 100 submissions/day
   - Resolution: Implement token bucket algo (2-3 days)
   - Impact: Currently OK for MVP; critical for Phase 3

### Known Limitations

| Limitation | Workaround | Timeline |
|-----------|-----------|----------|
| Form-based dirs (Nextdoor, Mozilla) break on UI changes | Automated screenshot testing + alerts | Phase 3 |
| LinkedIn strict approval | Start approval now; use manual workflow meanwhile | Phase 2 |
| Apple Maps requires manual app cert | Use MapKit JS as fallback | Phase 2A |
| No centralized rate limiter | Implement per-directory queue | Phase 2C |

---

## 📈 Success Metrics

### Phase 2 Completion Criteria

- [ ] 15+ directory integrations implemented and tested
- [ ] 85%+ of directory traffic covered (Google, Yelp, Facebook, BrightLocal, etc.)
- [ ] Rate limiter deployed and tested
- [ ] Verification poller running automatically
- [ ] NAP validation before submission
- [ ] 0 API bans or rate-limit blocks in production
- [ ] Dashboard shows real-time verification status for all submissions

### Performance Targets

| Metric | Target |
|--------|--------|
| Avg submission latency | <5s (API calls) or <30s (form automation) |
| Verification latency | <24h (polled every 6h) |
| Success rate | >90% (failures logged with root cause) |
| API uptime | >99.5% (alerts on failures) |

---

## 🔍 Schema Readiness Assessment

### Current Schema (convex/schema.ts) — ✅ SUFFICIENT for Phase 2A

The existing schema is well-designed for current integrations:

```typescript
submissions: {
  locationId,        // ✅ Links to location
  directoryId,       // ✅ Links to directory
  status,            // ✅ Tracks state (pending/submitted/verified/failed)
  errorMessage,      // ✅ Stores API errors
  createdAt,         // ✅ Audit trail
  submittedAt,       // ✅ Timing analytics
  verifiedAt,        // ✅ Verification tracking
}

verifications: {
  submissionId,      // ✅ Links to submission
  apiResponse,       // ✅ Flexible object for API-specific data
  proofUrl,          // ✅ Screenshot proof for form submissions
}
```

### Phase 2B Additions (BrightLocal, Yext)

Need minimal schema additions:

```typescript
// Option 1: Use flexible apiResponse object
verifications.apiResponse = {
  brightlocalCampaignId,
  campaignDirectories: [458 array],
  submittedAt,
}

// Option 2: If frequent polling needed, add to submissions table
submissions: {
  ...
  campaignId,        // For aggregators (BrightLocal, Yext)
  campaignDirectoryCount: 458,
  lastPolledAt,
}
```

### No Breaking Changes Required ✅
Current schema supports all planned integrations through flexible `apiResponse` object.

---

## 📝 Implementation Checklist

### Phase 2A: Free APIs

- [ ] **Apple Maps**
  - [ ] Create convex/submitAppleMaps.ts
  - [ ] Create app/api/integrations/apple/route.ts
  - [ ] MapKit JS verification
  - [ ] Tests + documentation

- [ ] **Bing Places**
  - [ ] Create convex/submitBing.ts
  - [ ] Create app/api/integrations/bing/route.ts
  - [ ] OAuth token exchange
  - [ ] Tests + documentation

- [ ] **Playwright Form Automation Framework**
  - [ ] Update formSubmit.ts with Playwright setup
  - [ ] Implement common form patterns (text fill, click, submit)
  - [ ] Screenshot capture for verification
  - [ ] Tests + documentation

### Phase 2B: Paid APIs

- [ ] **BrightLocal** (PRIORITY #1)
  - [ ] Complete convex/submitBrightLocal.ts (currently stubbed)
  - [ ] Create app/api/integrations/brightlocal/route.ts
  - [ ] Campaign creation & status polling
  - [ ] Tests + documentation

- [ ] **Yext**
  - [ ] Create convex/submitYext.ts
  - [ ] Create app/api/integrations/yext/route.ts
  - [ ] Knowledge API integration
  - [ ] Tests + documentation

### Phase 2C: Infrastructure

- [ ] **Rate Limiter**
  - [ ] Token bucket implementation
  - [ ] Per-directory config in directories table
  - [ ] Queue-based batching
  - [ ] Tests + monitoring

- [ ] **Verification Poller**
  - [ ] Cron-based polling service
  - [ ] Status update logic
  - [ ] Failure handling + alerts
  - [ ] Tests

- [ ] **NAP Validation**
  - [ ] USPS address validation API
  - [ ] Phone number normalization
  - [ ] Validation before submission
  - [ ] Tests

---

## 🎯 Prioritization for sr-engineering-director

### Ready to Spawn Phase 2A Build
- ✅ API endpoints stubbed (google, yelp, facebook done)
- ✅ Error handling patterns established
- ✅ Schema supports new integrations
- ✅ No critical blockers identified

### Phase 2B Blockers
- ⚠️ BrightLocal API key required (get from ops)
- ⚠️ LinkedIn approval timeline (start now)

### Recommended Build Order
1. **BrightLocal first** (highest ROI: 458 directories in 1 API call)
2. **Apple Maps second** (easy win, high traffic)
3. **Bing Places third** (medium effort, good coverage)
4. **Infrastructure (rate limiter)** parallel track

---

## 📞 Next Steps

1. **Immediate (Today)**
   - [ ] Get BrightLocal API key from ops
   - [ ] Apply for LinkedIn developer app (if pursuing)
   - [ ] Review blockers with team

2. **This Week**
   - [ ] Complete Phase 2A integrations
   - [ ] Set up form automation framework

3. **Next Week**
   - [ ] Deploy BrightLocal integration
   - [ ] Implement rate limiter
   - [ ] Launch Phase 2 beta

---

**Document Version:** 1.0  
**Last Updated:** 2025-03-28  
**Maintainer:** Rusty P. Shackelford  
**Status:** Ready for sr-engineering-director orchestration
