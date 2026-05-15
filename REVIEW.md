# FALLOW REVIEW

## HEALTH

## Vital Signs

| Metric | Value |
|:-------|------:|
| Total LOC | 4440 |
| Avg Cyclomatic | 2.6 |
| P90 Cyclomatic | 6 |
| Dead Files | 4.4% |
| Dead Exports | 0.0% |
| Maintainability (avg) | 96.1 |
| Circular Deps | 0 |
| Unused Deps | 5 |

## Fallow: 26 high complexity functions

| File | Function | Severity | Cyclomatic | Cognitive | CRAP | Lines |
|:-----|:---------|:---------|:-----------|:----------|:-----|:------|
| `app/submit/page.tsx:9` | `SubmitPage` | critical | 16 | 10 | 272.0 **!** | 162 |
| `app/api/auth/route.ts:14` | `POST` | critical | 12 | 19 **!** | 156.0 **!** | 78 |
| `convex/apiSubmit.ts:35` | `handler` | critical | 12 | 16 **!** | 156.0 **!** | 101 |
| `convex/apiSubmit.ts:148` | `handler` | critical | 11 | 14 | 132.0 **!** | 37 |
| `app/locations/%5Bid%5D/edit/page.tsx:31` | `<arrow>` | high | 9 | 8 | 90.0 **!** | 11 |
| `app/dashboard/push-to-directories/page.tsx:8` | `PushToDirectoriesPage` | high | 8 | 5 | 72.0 **!** | 167 |
| `convex/formSubmit.ts:128` | `submitCitySearch` | high | 8 | 8 | 72.0 **!** | 53 |
| `app/locations/page.tsx:8` | `LocationsPage` | high | 8 | 5 | 72.0 **!** | 215 |
| `scripts/ship.mts:23` | `run` | high | 7 | 6 | 56.0 **!** | 17 |
| `convex/integrations/facebook.ts:123` | `verifyFacebookSubmission` | high | 7 | 4 | 56.0 **!** | 38 |
| `app/locations/new/page.tsx:23` | `handleSubmit` | high | 7 | 5 | 56.0 **!** | 26 |
| `app/locations/%5Bid%5D/edit/page.tsx:43` | `handleSubmit` | high | 7 | 5 | 56.0 **!** | 27 |
| `convex/submissions.ts:251` | `handler` | moderate | 6 | 5 | 42.0 **!** | 51 |
| `app/directories/page.tsx:7` | `DirectoriesPage` | moderate | 6 | 3 | 42.0 **!** | 61 |
| `convex/integrations/brightlocal.ts:168` | `getBrightLocalCampaignStatus` | moderate | 6 | 5 | 42.0 **!** | 46 |
| `convex/formSubmit.ts:94` | `submitToFormDirectory` | moderate | 6 | 1 | 42.0 **!** | 26 |
| `app/auth/page.tsx:14` | `handleSubmit` | moderate | 6 | 6 | 42.0 **!** | 35 |
| `app/locations/%5Bid%5D/edit/page.tsx:10` | `EditLocationPage` | moderate | 6 | 5 | 42.0 **!** | 219 |
| `convex/submissions.ts:15` | `handler` | moderate | 5 | 4 | 30.0 **!** | 29 |
| `convex/submissions.ts:72` | `handler` | moderate | 5 | 4 | 30.0 **!** | 39 |
| `convex/submissions.ts:128` | `handler` | moderate | 5 | 4 | 30.0 **!** | 29 |
| `convex/submissions.ts:164` | `handler` | moderate | 5 | 4 | 30.0 **!** | 19 |
| `convex/integrations/brightlocal.ts:86` | `submitBrightLocalCampaign` | moderate | 5 | 4 | 30.0 **!** | 45 |
| `app/api/seed-directories/route.ts:26` | `POST` | moderate | 5 | 5 | 30.0 **!** | 47 |
| `app/auth/page.tsx:6` | `AuthPage` | moderate | 5 | 5 | 30.0 **!** | 101 |
| `app/submit/page.tsx:31` | `handleSubmit` | moderate | 5 | 4 | 30.0 **!** | 23 |

**45** files, **178** functions analyzed (thresholds: cyclomatic > 20, cognitive > 15, CRAP >= 30.0)



## AUDIT

Comparing against baseline: /Users/michael/Projects/citation-manager/.fallow/baselines/dead-code.json
Comparing against duplication baseline: /Users/michael/Projects/citation-manager/.fallow/baselines/dupes.json
Comparing against health baseline: /Users/michael/Projects/citation-manager/.fallow/baselines/health.json

Audit scope: 54 changed files vs master (463b848..HEAD)
✓ No issues in 54 changed files (0.30s)


## DEAD

## Fallow: 7 issues found

### Unused files (2)

- `components/ErrorBoundary.tsx`
- `index.ts`

### Unused dependencies (2)

- `@clerk/nextjs`
- `@convex-dev/auth`

### Unused devDependencies (3)

- `@typescript-eslint/eslint-plugin`
- `@typescript-eslint/parser`
- `eslint-config-next`




## DUPLICATION

## Fallow: 13 clone groups found (15.2% duplication)

### Duplicates

**Clone group 1** (23 lines, 2 instances)

- `app/api/auth/route.ts:4-14`
- `app/api/seed-directories/route.ts:4-26`

**Clone group 2** (54 lines, 4 instances)

- `app/dashboard/error.tsx:1-54`
- `app/directories/error.tsx:1-54`
- `app/locations/error.tsx:1-54`
- `app/submissions/error.tsx:1-54`

**Clone group 3** (35 lines, 5 instances)

- `app/dashboard/error.tsx:10-44`
- `app/directories/error.tsx:10-44`
- `app/locations/error.tsx:10-44`
- `app/submissions/error.tsx:10-44`
- `components/ErrorBoundary.tsx:35-61`

**Clone group 4** (61 lines, 3 instances)

- `app/directories/error.tsx:1-61`
- `app/locations/error.tsx:1-61`
- `app/submissions/error.tsx:1-61`

**Clone group 5** (17 lines, 2 instances)

- `app/directories/page.tsx:10-26`
- `app/submissions/page.tsx:6-22`

**Clone group 6** (38 lines, 2 instances)

- `app/locations/%5Bid%5D/edit/page.tsx:17-28`
- `app/locations/new/page.tsx:11-48`

**Clone group 7** (22 lines, 2 instances)

- `app/locations/%5Bid%5D/edit/page.tsx:41-62`
- `app/locations/new/page.tsx:21-41`

**Clone group 8** (45 lines, 2 instances)

- `app/locations/%5Bid%5D/edit/page.tsx:92-136`
- `app/locations/new/page.tsx:50-94`

**Clone group 9** (46 lines, 2 instances)

- `app/locations/%5Bid%5D/edit/page.tsx:136-181`
- `app/locations/new/page.tsx:94-139`

**Clone group 10** (12 lines, 2 instances)

- `convex/apiSubmit.ts:21-32`
- `convex/formSubmit.ts:48-59`

**Clone group 11** (5 lines, 3 instances)

- `convex/integrations/facebook.ts:191-195`
- `convex/integrations/googleBusiness.ts:163-167`
- `convex/integrations/yelp.ts:152-156`

**Clone group 12** (15 lines, 2 instances)

- `convex/locations.ts:61-71`
- `convex/submissions.ts:49-63`

**Clone group 13** (10 lines, 3 instances)

- `convex/locations.ts:61-69`
- `convex/submissions.ts:49-58`
- `convex/submissions.ts:70-79`

### Clone Families

**Family 1** (1 group, 23 lines across `app/api/auth/route.ts`, `app/api/seed-directories/route.ts`)

- Extract shared function (23 lines) from route.ts, route.ts (~23 lines saved)

**Family 2** (1 group, 54 lines across `app/dashboard/error.tsx`, `app/directories/error.tsx`, `app/locations/error.tsx`, `app/submissions/error.tsx`)

- Extract 1 shared clone group (54 lines) from error.tsx, error.tsx, error.tsx, error.tsx into a shared directory (~162 lines saved)

**Family 3** (1 group, 35 lines across `app/dashboard/error.tsx`, `app/directories/error.tsx`, `app/locations/error.tsx`, `app/submissions/error.tsx`, `components/ErrorBoundary.tsx`)

- Extract shared function (35 lines) from error.tsx, error.tsx, error.tsx, error.tsx, ErrorBoundary.tsx (~140 lines saved)

**Family 4** (1 group, 61 lines across `app/directories/error.tsx`, `app/locations/error.tsx`, `app/submissions/error.tsx`)

- Extract 1 shared clone group (61 lines) from error.tsx, error.tsx, error.tsx into a shared directory (~122 lines saved)

**Family 5** (1 group, 17 lines across `app/directories/page.tsx`, `app/submissions/page.tsx`)

- Extract shared function (17 lines) from page.tsx, page.tsx (~17 lines saved)

**Family 6** (4 groups, 151 lines across `app/locations/%5Bid%5D/edit/page.tsx`, `app/locations/new/page.tsx`)

- Extract 4 shared clone groups (151 lines) from page.tsx, page.tsx into a shared directory (~151 lines saved)

**Family 7** (1 group, 12 lines across `convex/apiSubmit.ts`, `convex/formSubmit.ts`)

- Extract shared function (12 lines) from apiSubmit.ts, formSubmit.ts (~12 lines saved)

**Family 8** (1 group, 5 lines across `convex/integrations/facebook.ts`, `convex/integrations/googleBusiness.ts`, `convex/integrations/yelp.ts`)

- Extract shared function (5 lines) from facebook.ts, googleBusiness.ts, yelp.ts (~10 lines saved)

**Family 9** (2 groups, 25 lines across `convex/locations.ts`, `convex/submissions.ts`)

- Extract shared function (15 lines) from locations.ts, submissions.ts (~15 lines saved)
- Extract shared function (10 lines) from locations.ts, submissions.ts, submissions.ts (~20 lines saved)

**Summary:** 659 duplicated lines (15.2%) across 18 files



## DOCSTRINGS

### Docstring Coverage

- Status: fail
- Coverage: 67.65%
- Documented symbols: 46/68
- Missing docstrings: 22

