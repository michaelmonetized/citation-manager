# Phase 2 Build Plan — Quick Reference for sr-engineering-director

## Current State (Phase 1: 70% MVP)

### What Works Today ✅
- **3 free directory APIs fully operational:**
  - Google Business Profile (500K submissions possible)
  - Yelp (300K submissions possible)
  - Facebook Business + Instagram linking
- **58 business locations can be submitted to these 3 directories** (demo data in schema)
- **Error handling, retry logic, and verification tracking** all in place
- **Database schema fully supports all Phase 2 APIs** (no changes needed)

### Technology Stack
- Next.js 16 + React 19 (frontend)
- Convex (backend, multi-tenant)
- Vercel (hosting)
- TypeScript (strict mode ready)

---

## Phase 2: Three Parallel Workstreams

### 🟢 Workstream 1: Free Directory APIs (2 weeks)
**Owner:** [Assign senior frontend/backend engineer]

#### Deliverables
1. **Apple Maps Integration**
   - Effort: LOW (1-2 days)
   - Files to create: 2 (mutation + endpoint)
   - No API key needed (free tier: 100K maps/day)
   - Expected monthly views: 300K

2. **Bing Places Integration**
   - Effort: MEDIUM (2-3 days)
   - Files to create: 2 (mutation + endpoint)
   - Needs OAuth setup (Microsoft Azure app) — **assign to DevOps**
   - Expected monthly views: 200K

3. **Playwright Form Automation Framework**
   - Effort: MEDIUM (2-3 days)
   - Update formSubmit.ts with Playwright patterns
   - Screenshot capture for verification
   - Foundation for Phase 3 form-based directories

#### Success Criteria
- [ ] Apple Maps: submit + verify endpoints working
- [ ] Bing Places: OAuth flow + API integration complete
- [ ] Playwright framework: test form submission (mock directory)
- [ ] All 3 integrated into dashboard
- [ ] Unit tests for each integration

#### Blockers
- None (all APIs are public/free)

---

### 🔴 Workstream 2: High-ROI Aggregators (3 weeks)
**Owner:** [Assign lead backend engineer]

#### Deliverables
1. **BrightLocal Integration** ⚠️ CRITICAL PATH
   - Effort: MEDIUM-HIGH (3-4 days)
   - Files to create/complete: 2 (finish stubbed mutation, create endpoint)
   - **Blocker: BrightLocal API key** (contact account manager TODAY)
   - Impact: **458 directories in 1 API call** (Google, Yelp, Facebook, Apple, Bing, + 453 niche dirs)
   - Monthly views: 50K+ across network
   - Timeline: 4-5 days after API key received

2. **Yext Integration** (Secondary)
   - Effort: MEDIUM (3-4 days)
   - Files to create: 2 (mutation + endpoint)
   - API key needed (contact Yext account manager)
   - Impact: 400+ directories in 1 call
   - Monthly views: 40K+ across network
   - Timeline: Can start in parallel

3. **Hunter.io Lead Enrichment** (Optional)
   - Effort: LOW (1-2 days)
   - Purpose: Enrichment only (find contact emails for verification)
   - Not on critical path; can defer to Phase 2.5

#### Success Criteria
- [ ] BrightLocal: campaign creation + status polling working
- [ ] Yext: knowledge API integration complete
- [ ] Both support real-time verification
- [ ] Dashboard shows multi-directory submission status
- [ ] Error handling for rate limits (see rate limiter below)
- [ ] Integration tests for campaign polling

#### Blockers
- ⚠️ **BrightLocal API key not yet obtained** — **BLOCKING FACTOR #1**
  - Unblock: Contact account manager, request API key
  - Timeline: ~1 day to receive
  - Impact: Without it, need to implement 458 individual directory APIs manually
  - Workaround: Implement free APIs first (Phase 2A) while waiting

- ⚠️ **LinkedIn app approval pending** (not on critical path, but start now)
  - Timeline: 1-2 weeks for LinkedIn approval
  - Impact: LinkedIn is 250K monthly views; can defer to Phase 2.5
  - Action: Apply for developer app now; use manual workflow while waiting

---

### 🟡 Workstream 3: Production Infrastructure (2 weeks, can start Week 1)
**Owner:** [Assign DevOps/infrastructure engineer]

#### Deliverables
1. **Rate Limiting Module**
   - Effort: MEDIUM (2-3 days)
   - Implementation: Token bucket algorithm
   - Config: Store limits in directories table
   - Purpose: Prevent API bans, respect rate limits (Google 1K/day, Yelp 5K/hour, etc.)
   - **Required before Phase 2 launch**

2. **Centralized Verification Poller**
   - Effort: LOW-MEDIUM (1-2 days)
   - Implementation: Cron job that polls all pending submissions
   - Polling interval: Every 6 hours
   - Status updates: Write back to submissions table
   - **Required for automated verification**

3. **NAP Validation Service**
   - Effort: MEDIUM (2-3 days)
   - Validation: USPS address normalization + phone number formatting (libphonenumber)
   - Purpose: Increase API acceptance rate, improve data consistency
   - Dashboard integration: Show validation warnings before submission
   - **Nice-to-have for Phase 2, required for Phase 3**

#### Success Criteria
- [ ] Rate limiter: tested with burst submissions (no API bans)
- [ ] Verification poller: running cron job, status updates visible in dashboard
- [ ] NAP validation: working in submission form, shows errors before API call
- [ ] Load test: can handle 1000 submissions/day without hitting rate limits
- [ ] Monitoring: Alerts on rate limit blocks, API timeouts

#### Blockers
- None (all infrastructure-only)

---

## Build Timeline (Gantt-style)

```
Week 1:     [Phase 2A: Free APIs ————————]
            [Rate Limiter (parallel) ——]
Week 2:     [Phase 2A continues ———]
            [Rate Limiter ——]
            [Verification Poller ——]
Week 3:     [Phase 2B: Aggregators ——————————]
            [NAP Validation ——————]
Week 4:     [Phase 2B continues ————]
            [Testing & Monitoring ———————]
Week 5:     [Phase 2B wrap-up ——]
            [Infrastructure hardening ———]
Week 6:     [Testing, docs, launch prep ————]
            [Load testing ——————]
```

**Total: 6 weeks to Phase 2 launch**

---

## File Changes Required

### Files to Create (New)
```
convex/
├── submitAppleMaps.ts              # Apple Maps mutation
├── submitBing.ts                   # Bing Places mutation
├── integrations/apple.ts           # Apple Maps API helper
├── integrations/bing.ts            # Bing Places API helper
├── rateLimiter.ts                  # NEW: Rate limiter module
├── verificationPoller.ts           # NEW: Cron-based poller
└── napValidation.ts                # NEW: Address/phone validation

app/api/integrations/
├── apple/route.ts                  # Apple Maps endpoint
├── bing/route.ts                   # Bing Places endpoint
└── ...

tests/
├── integrations/apple.test.ts      # NEW: Unit tests
├── integrations/bing.test.ts       # NEW: Unit tests
├── integrations/brightlocal.test.ts # NEW: Update stubbed test
└── ...
```

### Files to Update (Existing)
```
convex/
├── submitBrightLocal.ts            # FILL IN (currently stubbed with TODO comment)
├── integrations/brightlocal.ts     # COMPLETE implementation
├── formSubmit.ts                   # ADD Playwright framework
└── schema.ts                       # OPTIONAL: add campaignId, lastPolledAt fields

app/
├── (protected)/submissions/page.tsx  # Show multi-directory status
└── ...
```

### No Breaking Changes ✅
- Current schema supports all Phase 2 integrations
- API endpoint pattern established (no refactoring needed)
- Error handling consistent (just copy pattern)

---

## Critical Dependencies & Blockers

### Blocking Issue #1: BrightLocal API Key ⚠️ **ACTION REQUIRED TODAY**
- **Status:** Not obtained yet
- **Owner:** [Michael / Operations]
- **Action:** Contact BrightLocal account manager, request API key
- **Timeline:** ~1 day to receive
- **Unblock Cost:** 0 (should be included in existing BrightLocal subscription)
- **Impact:** Without it, Phase 2B (aggregators) can't start
- **Fallback:** Implement free APIs first (Phase 2A) while waiting

### Blocking Issue #2: LinkedIn App Approval ⚠️ **ACTION REQUIRED THIS WEEK**
- **Status:** Not applied yet (approval takes 1-2 weeks)
- **Owner:** [Michael / Ops]
- **Action:** Apply for LinkedIn developer app approval now
- **Timeline:** 1-2 weeks for LinkedIn to respond
- **Impact:** LinkedIn is 250K views/month; can defer to Phase 2.5 if needed
- **Fallback:** Manual workflow (guide users to claim on LinkedIn.com)

### Blocking Issue #3: Microsoft Azure App (Non-blocking, but required for Bing)
- **Status:** Not set up yet
- **Owner:** [DevOps]
- **Action:** Create Azure app, get Client ID + Secret
- **Timeline:** 1-2 days
- **Impact:** Needed for Bing Places OAuth
- **Fallback:** Can skip Bing if Azure setup delayed (not critical path)

---

## Recommended Agent Spawning Strategy

### For sr-engineering-director Orchestration

```typescript
// Phase 2A: Parallel workstreams
spawn_agent({
  role: "backend-engineer",
  task: "Implement Apple Maps + Bing Places integrations",
  duration: "2 weeks",
  deliverables: [
    "convex/submitAppleMaps.ts",
    "convex/submitBing.ts",
    "app/api/integrations/apple/route.ts",
    "app/api/integrations/bing/route.ts",
    "convex/integrations/apple.ts",
    "convex/integrations/bing.ts",
  ],
  dependencies: ["Microsoft Azure app ready"],
  success_criteria: ["All endpoints tested", "Integration tests pass"],
})

// Phase 2B: Critical path
spawn_agent({
  role: "backend-engineer",
  task: "Complete BrightLocal integration + start Yext",
  duration: "3 weeks",
  deliverables: [
    "convex/submitBrightLocal.ts (complete stubbed file)",
    "convex/integrations/brightlocal.ts (complete implementation)",
    "app/api/integrations/brightlocal/route.ts",
    "convex/submitYext.ts",
    "convex/integrations/yext.ts",
    "app/api/integrations/yext/route.ts",
  ],
  dependencies: ["BrightLocal API key obtained"],
  success_criteria: ["458 dirs submitted in 1 call", "Polling works"],
  blocking: true,
})

// Phase 2C: Infrastructure (parallel)
spawn_agent({
  role: "devops-engineer",
  task: "Implement rate limiter, verification poller, NAP validation",
  duration: "2 weeks",
  deliverables: [
    "convex/rateLimiter.ts",
    "convex/verificationPoller.ts",
    "convex/napValidation.ts",
  ],
  dependencies: ["None"],
  success_criteria: ["Rate limiter: no API bans", "Poller: auto-verification works"],
})

// Testing & QA
spawn_agent({
  role: "qa-engineer",
  task: "Full Phase 2 QA + load testing",
  duration: "1 week",
  deliverables: [
    "tests/ (comprehensive test suite)",
    "load-test-report.md",
  ],
  dependencies: ["All Phase 2A + 2B implementations done"],
  success_criteria: ["0 API bans under load", "All integrations tested"],
})
```

---

## Success Metrics

### Phase 2A Completion (Week 2)
- [ ] Apple Maps: 2+ locations submitted & verified
- [ ] Bing Places: 2+ locations submitted & verified
- [ ] Playwright framework: test form submission working
- [ ] Unit tests: 80%+ code coverage
- [ ] Dashboard: shows all 5 directory statuses (Google, Yelp, Facebook, Apple, Bing)

### Phase 2B Completion (Week 5)
- [ ] BrightLocal: 458 directories submitted in 1 API call
- [ ] Yext: 400+ directories submitted in 1 API call
- [ ] Verification polling: automated, updates every 6 hours
- [ ] Integration tests: 85%+ code coverage
- [ ] Dashboard: shows multi-directory aggregation

### Phase 2 Launch (Week 7)
- [ ] Rate limiter: tested with 1000 submissions/day (no API bans)
- [ ] NAP validation: prevents invalid submissions
- [ ] Load test: passes at 2000 submissions/day
- [ ] Monitoring: alerts on API failures
- [ ] Documentation: API reference + integration guide for partners

---

## Effort Breakdown (in days)

| Task | Effort | Owner |
|------|--------|-------|
| Apple Maps (submit + verify) | 2 days | Backend |
| Bing Places (submit + verify + OAuth) | 3 days | Backend |
| Playwright framework | 2 days | Backend |
| BrightLocal (complete implementation) | 4 days | Backend |
| Yext (submit + verify) | 3 days | Backend |
| Rate limiter | 2 days | DevOps |
| Verification poller | 1.5 days | Backend |
| NAP validation | 3 days | Backend |
| Tests + QA | 5 days | QA |
| Docs + integration guide | 2 days | Tech Writer |
| **Total** | **28 days** | **6 weeks (1 team)** |

If running in parallel with 3 engineers:
- **Phase 2A (Backend):** 7 days = ~1 week
- **Phase 2B (Backend):** 7 days = ~1 week
- **Infrastructure (DevOps):** 6 days = ~1 week (parallel)
- **QA + Docs:** 7 days = ~1 week (parallel/end)
- **Total Timeline:** 4-5 weeks (with 3 engineers)

---

## Decision Gate Checklist

Before launching Phase 2 build:
- [ ] BrightLocal API key obtained (unblock Phase 2B)
- [ ] Microsoft Azure app created (for Bing OAuth)
- [ ] LinkedIn app approval applied (don't wait, do in parallel)
- [ ] Convex deployment credentials ready
- [ ] Vercel environment variables prepared
- [ ] Team assigned (1 backend lead, 1 DevOps, 1 QA minimum)
- [ ] Sprint planning: Phase 2A & 2C run in parallel, Phase 2B after API key

---

## Red Flags to Watch

| Flag | Action |
|------|--------|
| BrightLocal API key not received after 3 days | Escalate to account manager, prepare fallback (individual directory APIs) |
| Rate limit blocks in staging | Reduce burst test load, increase rate limiter token bucket |
| LinkedIn approval denied | Use manual workflow, defer to Phase 2.5 |
| Playwright form breaks on directory update | Set up automated testing, create rapid response plan |
| API errors on production launch | Fallback to "pending verification" state, manual admin review |

---

## Next Steps (TODAY)

1. **[Michael/Ops]** — Contact BrightLocal account manager for API key
2. **[Michael/Ops]** — Apply for LinkedIn developer app approval
3. **[DevOps]** — Create Microsoft Azure app for Bing OAuth
4. **[Engineering Lead]** — Review this plan with team
5. **[Team]** — Schedule Phase 2A kickoff (goal: start work Monday)

---

**Plan Version:** 1.0  
**Created:** 2025-03-28  
**Status:** Ready for sr-engineering-director review  
**Next Review:** After blockers are unblocked (target: today or tomorrow)
