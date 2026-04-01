# Phase 2B: Form Automation & Directory Registry

## Overview
Phase 2A delivered API integrations (Google, Yelp, Facebook).
Phase 2B focuses on automating form-based submissions for the remaining 938 directories.

## Scope
1. **Form Pattern Library** — Detect and standardize common directory form fields
   - Business name, address, phone, website, hours
   - Reusable selectors and fill patterns
   
2. **Puppeteer Integration** — Form automation engine
   - Headless browser submission for non-API directories
   - Screenshot capture for verification
   - Rate limiting (1 submission per 2 seconds max)

3. **Verification Tracking** — Post-submission status polling
   - Track submission timestamps
   - Log verification status (pending/live/failed)
   - Alert on failures

## Deliverables (Phase 2B)
- [ ] Form pattern detector (detect input fields by common labels)
- [ ] Puppeteer submission engine
- [ ] Registry expansion (add 50+ priority directories)
- [ ] Verification poller
- [ ] UI: Bulk submission dashboard
- [ ] Monitoring: Submission success rates by directory

## Timeline
- Week 1: Form patterns + Puppeteer integration
- Week 2: Registry expansion + verification polling
- Week 3: UI + monitoring

## Related
- Issue #4: Phase 2 master issue
- Issue #12: Phase 2A API integrations (shipped)
- Issue #15: Directory registry enhancement
- Issue #17: Known issues & blockers summary
