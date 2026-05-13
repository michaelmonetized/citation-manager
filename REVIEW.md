# FALLOW REVIEW

## HEALTH

## Vital Signs

| Metric | Value |
|:-------|------:|
| Total LOC | 4673 |
| Avg Cyclomatic | 2.6 |
| P90 Cyclomatic | 6 |
| Dead Files | 2.3% |
| Dead Exports | 0.0% |
| Maintainability (avg) | 94.7 |
| Circular Deps | 0 |
| Unused Deps | 5 |

## Fallow: 24 high complexity functions

| File | Function | Severity | Cyclomatic | Cognitive | CRAP | Lines |
|:-----|:---------|:---------|:-----------|:----------|:-----|:------|
| `app/submit/page.tsx:9` | `SubmitPage` | critical | 16 | 10 | 272.0 **!** | 165 |
| `app/api/auth/route.ts:14` | `POST` | critical | 12 | 19 **!** | 156.0 **!** | 82 |
| `convex/apiSubmit.ts:28` | `handler` | critical | 12 | 16 **!** | 156.0 **!** | 111 |
| `convex/apiSubmit.ts:151` | `handler` | critical | 11 | 14 | 132.0 **!** | 48 |
| `app/locations/%5Bid%5D/edit/page.tsx:30` | `<arrow>` | high | 9 | 8 | 90.0 **!** | 11 |
| `app/dashboard/push-to-directories/page.tsx:8` | `PushToDirectoriesPage` | high | 8 | 5 | 72.0 **!** | 165 |
| `convex/formSubmit.ts:133` | `submitCitySearch` | high | 8 | 8 | 72.0 **!** | 56 |
| `app/locations/page.tsx:8` | `LocationsPage` | high | 8 | 5 | 72.0 **!** | 225 |
| `convex/integrations/facebook.ts:129` | `verifyFacebookSubmission` | high | 7 | 4 | 56.0 **!** | 42 |
| `app/locations/new/page.tsx:23` | `handleSubmit` | high | 7 | 5 | 56.0 **!** | 26 |
| `app/locations/%5Bid%5D/edit/page.tsx:42` | `handleSubmit` | high | 7 | 5 | 56.0 **!** | 27 |
| `convex/submissions.ts:250` | `handler` | moderate | 6 | 5 | 42.0 **!** | 51 |
| `app/directories/page.tsx:7` | `DirectoriesPage` | moderate | 6 | 3 | 42.0 **!** | 65 |
| `convex/integrations/brightlocal.ts:168` | `getBrightLocalCampaignStatus` | moderate | 6 | 5 | 42.0 **!** | 49 |
| `convex/formSubmit.ts:99` | `submitToFormDirectory` | moderate | 6 | 1 | 42.0 **!** | 26 |
| `app/auth/page.tsx:14` | `handleSubmit` | moderate | 6 | 6 | 42.0 **!** | 37 |
| `app/locations/%5Bid%5D/edit/page.tsx:9` | `EditLocationPage` | moderate | 6 | 5 | 42.0 **!** | 216 |
| `convex/submissions.ts:16` | `handler` | moderate | 5 | 4 | 30.0 **!** | 29 |
| `convex/submissions.ts:127` | `handler` | moderate | 5 | 4 | 30.0 **!** | 29 |
| `convex/submissions.ts:163` | `handler` | moderate | 5 | 4 | 30.0 **!** | 19 |
| `convex/integrations/brightlocal.ts:86` | `submitBrightLocalCampaign` | moderate | 5 | 4 | 30.0 **!** | 45 |
| `app/api/seed-directories/route.ts:26` | `POST` | moderate | 5 | 5 | 30.0 **!** | 53 |
| `app/auth/page.tsx:6` | `AuthPage` | moderate | 5 | 5 | 30.0 **!** | 111 |
| `app/submit/page.tsx:31` | `handleSubmit` | moderate | 5 | 4 | 30.0 **!** | 23 |

**44** files, **161** functions analyzed (thresholds: cyclomatic > 20, cognitive > 15, CRAP >= 30.0)



## AUDIT


Audit scope: 14 changed files vs master (c84b720..HEAD)
## Fallow: 5 issues found

### Unused dependencies (2)

- `@clerk/nextjs`
- `@convex-dev/auth`

### Unused devDependencies (3)

- `@typescript-eslint/eslint-plugin`
- `@typescript-eslint/parser`
- `eslint-config-next`


note: hid 5 clone groups below minOccurrences=3 (lower --min-occurrences to see them)
## Fallow: 1 clone group found (0.6% duplication)

### Duplicates

**Clone group 1** (10 lines, 3 instances)

- `convex/locations.ts:61-69`
- `convex/submissions.ts:50-59`
- `convex/submissions.ts:71-80`

### Clone Families

**Family 1** (1 group, 10 lines across `convex/locations.ts`, `convex/submissions.ts`)

- Extract shared function (10 lines) from locations.ts, submissions.ts, submissions.ts (~20 lines saved)

**Summary:** 29 duplicated lines (0.6%) across 2 files

## Vital Signs

| Metric | Value |
|:-------|------:|
| Total LOC | 1517 |
| Avg Cyclomatic | 2.6 |
| P90 Cyclomatic | 5 |
| Dead Files | 0.0% |
| Dead Exports | 0.0% |
| Maintainability (avg) | 92.5 |
| Circular Deps | 0 |
| Unused Deps | 5 |

## Fallow: 11 high complexity functions

| File | Function | Severity | Cyclomatic | Cognitive | CRAP | Lines |
|:-----|:---------|:---------|:-----------|:----------|:-----|:------|
| `app/submit/page.tsx:9` | `SubmitPage` | critical | 16 | 10 | 272.0 **!** | 165 |
| `app/locations/%5Bid%5D/edit/page.tsx:30` | `<arrow>` | high | 9 | 8 | 90.0 **!** | 11 |
| `app/dashboard/push-to-directories/page.tsx:8` | `PushToDirectoriesPage` | high | 8 | 5 | 72.0 **!** | 165 |
| `app/locations/page.tsx:8` | `LocationsPage` | high | 8 | 5 | 72.0 **!** | 225 |
| `app/locations/%5Bid%5D/edit/page.tsx:42` | `handleSubmit` | high | 7 | 5 | 56.0 **!** | 27 |
| `convex/submissions.ts:250` | `handler` | moderate | 6 | 5 | 42.0 **!** | 51 |
| `app/locations/%5Bid%5D/edit/page.tsx:9` | `EditLocationPage` | moderate | 6 | 5 | 42.0 **!** | 216 |
| `convex/submissions.ts:16` | `handler` | moderate | 5 | 4 | 30.0 **!** | 29 |
| `convex/submissions.ts:127` | `handler` | moderate | 5 | 4 | 30.0 **!** | 29 |
| `convex/submissions.ts:163` | `handler` | moderate | 5 | 4 | 30.0 **!** | 19 |
| `app/submit/page.tsx:31` | `handleSubmit` | moderate | 5 | 4 | 30.0 **!** | 23 |

**8** files, **70** functions analyzed (thresholds: cyclomatic > 20, cognitive > 15, CRAP >= 30.0)

✗ dead code: 5 issues · complexity: 11 findings · duplication: 1 clone group · 14 changed files (0.26s)
  audit gate excluded 6 inherited findings (run with --gate all to enforce)


## DEAD

## Fallow: 7 issues found

### Unused files (1)

- `components/ErrorBoundary.tsx`

### Unused dependencies (2)

- `@clerk/nextjs`
- `@convex-dev/auth`

### Unused devDependencies (3)

- `@typescript-eslint/eslint-plugin`
- `@typescript-eslint/parser`
- `eslint-config-next`

### Unresolved imports (1)

- `convex/_generated/server.d.ts`
  - :22 `./dataModel.js`




## DUPLICATION

note: hid 7 clone groups below minOccurrences=3 (lower --min-occurrences to see them)
## Fallow: 5 clone groups found (14.2% duplication)

### Duplicates

**Clone group 1** (54 lines, 4 instances)

- `app/dashboard/error.tsx:1-54`
- `app/directories/error.tsx:1-54`
- `app/locations/error.tsx:1-54`
- `app/submissions/error.tsx:1-54`

**Clone group 2** (35 lines, 5 instances)

- `app/dashboard/error.tsx:10-44`
- `app/directories/error.tsx:10-44`
- `app/locations/error.tsx:10-44`
- `app/submissions/error.tsx:10-44`
- `components/ErrorBoundary.tsx:38-64`

**Clone group 3** (61 lines, 3 instances)

- `app/directories/error.tsx:1-61`
- `app/locations/error.tsx:1-61`
- `app/submissions/error.tsx:1-61`

**Clone group 4** (9 lines, 3 instances)

- `convex/integrations/facebook.ts:204-212`
- `convex/integrations/googleBusiness.ts:163-171`
- `convex/integrations/yelp.ts:155-163`

**Clone group 5** (10 lines, 3 instances)

- `convex/locations.ts:61-69`
- `convex/submissions.ts:50-59`
- `convex/submissions.ts:71-80`

### Clone Families

**Family 1** (1 group, 54 lines across `app/dashboard/error.tsx`, `app/directories/error.tsx`, `app/locations/error.tsx`, `app/submissions/error.tsx`)

- Extract 1 shared clone group (54 lines) from error.tsx, error.tsx, error.tsx, error.tsx into a shared directory (~162 lines saved)

**Family 2** (1 group, 35 lines across `app/dashboard/error.tsx`, `app/directories/error.tsx`, `app/locations/error.tsx`, `app/submissions/error.tsx`, `components/ErrorBoundary.tsx`)

- Extract shared function (35 lines) from error.tsx, error.tsx, error.tsx, error.tsx, ErrorBoundary.tsx (~140 lines saved)

**Family 3** (1 group, 61 lines across `app/directories/error.tsx`, `app/locations/error.tsx`, `app/submissions/error.tsx`)

- Extract 1 shared clone group (61 lines) from error.tsx, error.tsx, error.tsx into a shared directory (~122 lines saved)

**Family 4** (1 group, 9 lines across `convex/integrations/facebook.ts`, `convex/integrations/googleBusiness.ts`, `convex/integrations/yelp.ts`)

- Extract shared function (9 lines) from facebook.ts, googleBusiness.ts, yelp.ts (~18 lines saved)

**Family 5** (1 group, 10 lines across `convex/locations.ts`, `convex/submissions.ts`)

- Extract shared function (10 lines) from locations.ts, submissions.ts, submissions.ts (~20 lines saved)

**Summary:** 637 duplicated lines (14.2%) across 16 files



## DOCSTRINGS

### Docstring Coverage

- Status: fail
- Coverage: 56.32%
- Documented symbols: 49/87
- Missing docstrings: 38

