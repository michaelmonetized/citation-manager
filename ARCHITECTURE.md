# Citation Manager — Architecture

## Database Schema (Convex)

```
users
├── clerkId (string, indexed)
├── email (string, indexed)
├── name (optional)
├── organizationName (optional)
├── plan (free | pro | enterprise)
├── createdAt (number)
└── updatedAt (number)

locations
├── userId (ref -> users, indexed)
├── businessName (string, indexed)
├── address (string)
├── phone (string)
├── website (optional)
├── city (string)
├── state (string)
├── zipCode (string)
├── createdAt (number)
└── updatedAt (number)

directories
├── name (string)
├── url (string)
├── rank (number, indexed)
├── category (string, indexed)
├── submissionMethod (api | form | manual | email | phone)
├── apiAvailable (boolean)
├── apiDocsUrl (optional)
├── isFree (boolean)
└── estimatedMonthlyViews (optional)

submissions
├── locationId (ref -> locations, indexed)
├── directoryId (ref -> directories, indexed)
├── status (pending | submitted | verified | failed, indexed)
├── errorMessage (optional)
├── createdAt (number)
├── submittedAt (optional)
└── verifiedAt (optional)

verifications
├── submissionId (ref -> submissions, indexed)
├── apiResponse (object)
├── verifiedAt (number)
└── proofUrl (optional)
```

## API Endpoints (Convex Queries & Mutations)

### Queries
- `listLocations()` — Get all locations for authenticated user
- `getLocation(locationId)` — Get single location with auth check
- `listDirectories(category?, onlyFree?, limit?)` — Browse directories with filtering
- `getDirectory(directoryId)` — Get single directory
- `listTopDirectories(limit?)` — Top-ranked directories (default 50)

### Mutations
- `createLocation(businessName, address, phone, website?, city, state, zipCode)` — Add location
- `deleteLocation(locationId)` — Delete location
- (Future) `bulkSubmit(locationId, directoryIds[])` — Submit to multiple directories
- (Future) `createSubmission(locationId, directoryId)` — Individual submission

## Frontend Structure (Next.js 16)

```
app/
├── page.tsx                 # Root redirects to /dashboard or /sign-in
├── layout.tsx               # Root layout with Clerk + Convex providers
├── globals.css              # Tailwind + base styles
├── providers.tsx            # Convex client provider
├── dashboard/
│   └── page.tsx            # Dashboard home (4-card grid)
├── locations/
│   ├── page.tsx            # List locations
│   └── new/
│       └── page.tsx        # (Placeholder) Add location form
├── directories/
│   └── page.tsx            # Browse top 50 directories
└── submissions/
    └── page.tsx            # View submission status
```

## Authentication (Clerk)

- Middleware redirects unauthenticated users to `/sign-in`
- All Convex queries check `ctx.auth.getUserIdentity()` before returning data
- User identity tied to Clerk ID in `users` table

## Type Safety

- Strict TypeScript enabled (`"strict": true`)
- No implicit `any` types
- Convex values use `v.string()`, `v.number()`, etc.
- Return types inferred naturally; avoid explicit returns

## Code Quality

- `bun tsc --noEmit` — zero TypeScript errors
- `bun lint --max-warnings=9999` — zero linting errors
- ESLint rules enforce no `any`, no unused variables
- All code committed to `feat/auth-dashboard` branch
