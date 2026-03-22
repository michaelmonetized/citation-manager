# Directory Registry Research — 958 Directories Aggregation

## Status
**Top 20:** Complete (data/directories.json)
**Remaining 938:** Research in progress

## Research Sources
1. **Bright Local** — Offers list of 958 verified directories (industry benchmark)
2. **Moz Local** — Directory rankings + domain authority
3. **Text/eLocal** — Directory aggregator data
4. **Uberall** — Competitor directory partnerships (100+ directories)
5. **Whitespark** — Local SEO directory research
6. **Local business forums** — Community-recommended directories

## Directory Categories (Preliminary)

### Tier 1: High-Authority (Top 50)
- Google Business Profile, Yelp, Apple Maps, Facebook Business, LinkedIn
- BBB, Bright Local, Moz Local, Uberall, YellowPages
- Merchant Circle, Bing Places, Manta, Dun & Bradstreet, Foursquare
- Waze, Trustpilot, Nextdoor, CitySearch, SuperPages
- [30 more to research]

### Tier 2: Industry-Specific (Next 200)
- **Golf:** PGA, USGA, Golf Digest, Golf Channel directories
- **Hospitality:** Tripadvisor, Booking.com, Hotels.com
- **Healthcare:** Healthgrades, ZocDoc, Zocdoc, Vitals
- **Professional:** Avvo, Justia (legal), GlassDoor (employers)
- **Food/Beverage:** OpenTable, Resy, ZomatoOmniFood
- **Fitness:** ClassPass, Mindbody, Gym directories
- **Local Services:** Angi, TaskRabbit, Care.com 
- [100+ more]

### Tier 3: Regional/State Directories (Next 300)
- State-level business registries (all 50 states)
- Chamber of Commerce directories (1000+ chambers nationwide)
- Local newspapers business listings
- Regional tourism boards
- County/city business directories

### Tier 4: Niche + Aggregators (Remaining 400+)
- Trade association directories (industry-specific)
- Business.com, Yellowbook, LocalStack
- Google Places, Mapquest, TomTom
- Bing Maps, Here Maps
- Industry vertical directories (e.g., golf courses, restaurants, salons)
- Review aggregators (Trustindex, Trustpilot, Reviews.io)
- Web directories (DMOZ alternative, directory.com)
- Payment processor directories (Square, Stripe listings)
- Email directory services (ZoomInfo, Apollo)

## Data Structure (directories.json)

```json
{
  "rank": 1,
  "name": "Directory Name",
  "url": "https://example.com",
  "submissionMethod": "api|form|manual|email|phone",
  "apiAvailable": true|false,
  "apiDocsUrl": "https://...",
  "category": "search_aggregator|review_platform|business_directory|etc",
  "isFree": true|false,
  "estimatedMonthlyViews": 100000,
  "notes": "Brief description"
}
```

## Next Steps

1. **Scrape Bright Local directory list** (958 directories)
   - Extract: name, URL, submission method, category
   - Rank by Moz DA / traffic data

2. **API research** (identify free + paid APIs)
   - Which directories expose APIs?
   - Authentication requirements
   - Rate limits

3. **Submission method classification**
   - API: Automated submission possible
   - Form: Browser automation or manual
   - Manual: Requires human interaction
   - Email: Batch submission
   - Phone: Requires direct contact

4. **Build Convex mutation for bulk insertion**
   - Load directories.json into Convex database
   - Enable filtering by rank, category, API availability
   - Rank by search authority (Moz DA, Ahrefs DR)

5. **Create submission engine**
   - Auto-submit via API where available
   - Queue form submissions for automation/manual
   - Track verification status per directory

## Revenue Model
- **Free tier:** Submit to top 10 directories
- **Pro tier:** Submit to top 100
- **Enterprise:** Submit to all 958, custom integrations

## Competitive Analysis

| Tool | Directories | Price | API | Automation |
|------|------------|-------|-----|-----------|
| **Uberall** | 800+ | $499-2000/mo | Yes | Yes |
| **Bright Local** | 958 | $299-999/mo | Yes | Yes |
| **Yext** | 150+ | $999-5000+/mo | Yes | Yes |
| **Citation Manager (ours)** | 958 | $29-99/mo | Yes (free) | Yes |

**Competitive Advantage:** 10x cheaper, API-first, modern tech stack.

## Timeline
- Week 1: Aggregate top 100 directories (prioritize high-traffic + API availability)
- Week 2: Remaining 858 directories (bulk scraping + automation)
- Week 3: API integrations for submission automation
