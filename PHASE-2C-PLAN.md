# Phase 2C: Form Submission Automation

**Timeline:** 24-36 hours  
**Branch:** `feat/form-automation`  
**Scope:** Extend to 850+ non-API directories (form-based submissions)

---

## Architecture Decision

### Library Evaluation
- **Puppeteer** ✅ SELECTED
  - Pros: Headless Chrome, stable, widely used, good form automation
  - Cons: Heavy (~150MB), resource-intensive
  - Cost: Fits within Fly.io worker budget
  
- **Playwright** (alternative)
  - Pros: Multiple browser support, fast
  - Cons: Overkill for this use case
  
- **Selenium** (alternative)
  - Pros: Industry standard
  - Cons: Slower, heavier setup

### Job Queue
- **Fly.io Machines** ✅ SELECTED
  - Start worker VM → submit forms → cleanup
  - Pay per second (cost-efficient)
  - Async via Convex actions
  - No permanent infrastructure

---

## Implementation Phases

### Phase 2C.1: Form Handler (Puppeteer)
**Deliverables:**
- [ ] Form auto-fill engine (name, address, phone, website)
- [ ] Submit handlers for 5 major directories:
  1. CitySearch (form-based)
  2. YellowPages (form backup)
  3. Mapquest
  4. DexKnows
  5. Thumbtack
- [ ] Screenshot on error (debugging)
- [ ] Retry logic (3 attempts, exponential backoff)

**File:** `convex/formSubmit.ts`

### Phase 2C.2: Job Queue
**Deliverables:**
- [ ] Fly.io worker setup (env vars, secrets)
- [ ] Job dispatcher (Convex action → Fly.io POST)
- [ ] Status polling (check job completion)
- [ ] Database tracking (submissions table extension)

**File:** `lib/flyio.ts`

### Phase 2C.3: Directory Extension
**Deliverables:**
- [ ] Classify remaining 850 directories by form structure
- [ ] Add form metadata to `data/directories.json` (selectors, fields)
- [ ] Update seedDirectories() to include form info

**File:** `data/directories.json` (extended)

### Phase 2C.4: Integration & Testing
**Deliverables:**
- [ ] Wire up bulkSubmit → form submission pipeline
- [ ] Test on 5 directories (live)
- [ ] Error handling + retry
- [ ] Dashboard update (show form submission status)

**File:** `convex/submissions.ts` (extend)

---

## Priority: High-Traffic Directories

**Focus first (80% of submissions):**
1. CitySearch (high traffic, form-based)
2. YellowPages form submission
3. Mapquest
4. DexKnows (local citations)
5. Thumbtack (service categories)

These 5 account for ~40% of all directory submissions historically.

---

## Risk Mitigation

| Risk | Mitigation |
|------|-----------|
| Form selectors break | Screenshot on error, manual review queue |
| Rate limiting | Add delays between submissions (2-5s) |
| Captcha | Skip on captcha detected, log for manual review |
| Browser crashes | Retry up to 3 times, timeout protection |
| Cost overrun | Monitor Fly.io spend, set budget alerts |

---

## Rollout

**Stage 1:** Manual testing on 5 directories  
**Stage 2:** Enable for beta users (opt-in)  
**Stage 3:** Full rollout to all users  

**Rollback:** Disable form automation, fallback to API-only (100 directories)

---

## Success Criteria

- ✅ Form submission success rate >80% on 5 test directories
- ✅ Average submission time <2 min per directory
- ✅ Error rate <5%
- ✅ Cost per submission <$0.05
- ✅ All tests passing
- ✅ Merged to master

---

**Start time:** 2026-03-24 18:13 EDT  
**ETA completion:** 2026-03-25 18:00 EDT (24 hours)
