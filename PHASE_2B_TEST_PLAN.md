# Phase 2B Testing & Integration Plan

## Quick Start

This document tracks Phase 2B execution: manual testing + frontend integration for citation-manager.

### Test Environment

- **Convex:** Staging schema (use test data, avoid production)
- **Next.js:** Vercel staging preview
- **API Keys:** Use test accounts (Google, Yelp, Facebook)

### Execution Order

1. **API Integration Tests** (priority: Google > Yelp > Facebook)
   - 5 test submissions per provider
   - Verify response mapping to UI
   - Document any quirks in errors.log

2. **Frontend Wiring** (priority: Submit UI > Dashboard > Locations)
   - Connect API routes to React components
   - Add loading/error states
   - Test form validation end-to-end

3. **Staging Smoke Test**
   - Full submission pipeline
   - Real-time status updates
   - Browser DevTools: zero errors

4. **Production Go/No-Go**
   - All checks passing
   - Success rate > 90% per API
   - Error messages user-friendly

### Status

- [ ] Google Business Profile tests (est. 30 min)
- [ ] Yelp Business API tests (est. 30 min)
- [ ] Facebook Graph API tests (est. 30 min)
- [ ] Frontend Submit UI wiring (est. 45 min)
- [ ] Dashboard wiring (est. 30 min)
- [ ] Staging smoke test (est. 15 min)

**ETA for completion:** ~3 hours from start

