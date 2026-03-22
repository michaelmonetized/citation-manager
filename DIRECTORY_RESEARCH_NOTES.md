# Directory Research Notes — Bright Local 958 Aggregation

## Research Strategy

**Goal:** Aggregate 958 verified business directories (per Bright Local, Moz Local, Text Local, Uberall benchmarks)

**Approach:**
1. Prioritize by traffic authority (Moz DA, estimated monthly views)
2. Categorize by submission method (API, form, email, phone)
3. Identify free vs. paid directories
4. Build JSON with complete metadata

---

## Top 50 Directories (Research Required)

### Already Complete (1-20)
See `/data/directories.json` for full details:
1. Google Business Profile
2. Yelp
3. Apple Maps
4. Facebook Business
5. LinkedIn
6. Better Business Bureau
7. Bright Local
8. Moz Local
9. Uberall
10. YellowPages
11. Merchant Circle
12. Bing Places for Business
13. Manta
14. Dun & Bradstreet
15. Foursquare/Swarm
16. Waze
17. Trustpilot
18. Nextdoor
19. CitySearch
20. SuperPages

### Next 30 (21-50) — Research Required

**21-25: Review Platforms + Aggregators**
- Angi (formerly Angie's List) — https://www.angi.com
  - Category: Review platform (home services)
  - Traffic: 200K+ monthly
  - Submission: Form
  - Free: No (premium listings paid)

- Glassdoor — https://www.glassdoor.com
  - Category: Employer/company reviews
  - Traffic: 300K+ monthly
  - Submission: Form
  - Free: Yes (basic employer info)

- Indeed Company Pages — https://www.indeed.com
  - Category: Employer/job listings
  - Traffic: 500K+ monthly
  - Submission: Form
  - Free: Yes

- ZoomInfo — https://www.zoominfo.com
  - Category: B2B company database
  - Traffic: 100K+ monthly
  - Submission: Form / Manual outreach
  - Free: No (premium)

- Apollo — https://www.apollo.io
  - Category: B2B company database
  - Traffic: 50K+ monthly
  - Submission: API
  - Free: Yes (API available)

**26-30: Maps + Navigation**
- Google Maps (distinct from Business Profile) — https://maps.google.com
  - Category: Search aggregator
  - Traffic: 1M+ monthly
  - Submission: Integrated with Business Profile
  - Free: Yes

- Mapquest — https://www.mapquest.com
  - Category: Maps + navigation
  - Traffic: 100K+ monthly
  - Submission: Form
  - Free: Yes

- Here WeGo (Here Maps) — https://wego.here.com
  - Category: Maps (enterprise)
  - Traffic: 50K+ monthly
  - Submission: Form
  - Free: Yes

- TomTom Maps — https://www.tomtom.com
  - Category: Enterprise maps
  - Traffic: 30K+ monthly
  - Submission: Form
  - Free: No (enterprise)

- OpenStreetMap — https://www.openstreetmap.org
  - Category: Crowdsourced maps
  - Traffic: 200K+ monthly
  - Submission: Direct editing
  - Free: Yes

**31-35: Local Service Directories**
- Angi Services — https://www.angieslist.com
  - Category: Local services
  - Traffic: 150K+ monthly
  - Submission: Form
  - Free: No (paid for verified)

- Thumbtack — https://www.thumbtack.com
  - Category: Local services (contractors, professionals)
  - Traffic: 200K+ monthly
  - Submission: Form
  - Free: Yes (basic), paid (featured)

- ServiceTitan Partner Directory — https://www.servicetitan.com
  - Category: Service professionals
  - Traffic: 50K+ monthly
  - Submission: Form
  - Free: No (premium platform)

- Care.com — https://www.care.com
  - Category: Care services (nanny, senior care, pet care)
  - Traffic: 300K+ monthly
  - Submission: Form
  - Free: Yes (basic)

- TaskRabbit — https://www.taskrabbit.com
  - Category: Local services (handywork, moving, etc.)
  - Traffic: 150K+ monthly
  - Submission: Form
  - Free: Yes (basic)

**36-40: Accommodation + Travel**
- Airbnb — https://www.airbnb.com
  - Category: Vacation rental platform
  - Traffic: 1M+ monthly
  - Submission: Form
  - Free: Yes (basic)

- Booking.com — https://www.booking.com
  - Category: Hotel + accommodation
  - Traffic: 500K+ monthly
  - Submission: Form
  - Free: No (commission-based)

- Expedia — https://www.expedia.com
  - Category: Travel aggregator
  - Traffic: 400K+ monthly
  - Submission: Form
  - Free: No (commission-based)

- TripAdvisor — https://www.tripadvisor.com
  - Category: Travel + reviews
  - Traffic: 500K+ monthly
  - Submission: Form
  - Free: Yes

- Hotels.com — https://www.hotels.com
  - Category: Hotel booking
  - Traffic: 300K+ monthly
  - Submission: Form
  - Free: No (commission-based)

**41-45: Food + Dining**
- OpenTable — https://www.opentable.com
  - Category: Restaurant reservations
  - Traffic: 300K+ monthly
  - Submission: Form
  - Free: No (paid integration)

- Resy — https://resy.com
  - Category: Restaurant reservations (premium)
  - Traffic: 100K+ monthly
  - Submission: Form
  - Free: No (paid)

- DoorDash — https://www.doordash.com
  - Category: Food delivery
  - Traffic: 200K+ monthly
  - Submission: Form
  - Free: No (commission-based)

- Uber Eats — https://www.ubereats.com
  - Category: Food delivery
  - Traffic: 200K+ monthly
  - Submission: Form
  - Free: No (commission-based)

- Grubhub — https://www.grubhub.com
  - Category: Food delivery
  - Traffic: 200K+ monthly
  - Submission: Form
  - Free: No (commission-based)

**46-50: B2B + Professional Services**
- LinkedIn (Company Pages - premium) — https://www.linkedin.com/company/
  - Category: Professional network
  - Traffic: 300K+ monthly
  - Submission: Form
  - Free: Yes (basic)

- Crunchbase — https://www.crunchbase.com
  - Category: Company database (startups, investors)
  - Traffic: 100K+ monthly
  - Submission: Form
  - Free: Yes (basic)

- PitchBook — https://pitchbook.com
  - Category: Financial data (private company)
  - Traffic: 20K+ monthly
  - Submission: Form
  - Free: No (enterprise)

- CB Insights — https://www.cbinsights.com
  - Category: Market intelligence + company research
  - Traffic: 50K+ monthly
  - Submission: Form
  - Free: No (premium)

- Hunter.io — https://hunter.io
  - Category: B2B email finder + company data
  - Traffic: 100K+ monthly
  - Submission: API + Form
  - Free: Yes (freemium)

---

## Next Phase: 51-100 Categories

**Industry-Specific Directories (Golf, Healthcare, Education, etc.):**
- PGA Tour Directory
- USGA Courses Directory
- Healthgrades.com
- ZocDoc
- Education.com

**Regional + State Directories:**
- State-level business registries (all 50)
- Chamber of Commerce (1000+ nationwide)
- Local newspaper business sections

**Niche + Aggregators:**
- Business.com (web directory)
- Yellowbook (directory listings)
- LocalStack (local directory)
- Moz Local (already in top 10)

---

## Data Collection Strategy

1. **Prioritize by traffic** (search volume + monthly views)
2. **Classify by submission method** (optimize automation effort)
3. **Tag API availability** (identify free + paid APIs)
4. **Document auth requirements** (service account, OAuth, API key)

---

## Next Steps

1. **Obtain Bright Local list** (958 directories)
   - Check if public: https://www.brightlocal.com/resources/
   - If not public, research equivalent lists from Moz, Text, Uberall

2. **Fill in 51-100** (parallel research while awaiting team feedback)

3. **Rank by authority** (Moz DA, estimated monthly traffic)

4. **Classify by API availability** (prioritize free APIs for Phase 2A)

---

## Revenue Opportunity

**Tier-based submission limits:**
- Free: Top 10 directories
- Pro ($29/mo): Top 100 directories
- Enterprise ($99/mo): All 958 directories + custom integrations

**Competitive advantage:** Most competitors only cover 100-150 directories. We'll cover 958 + API-first approach.
