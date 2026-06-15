# SolarAtlas — Programmatic SEO Feasibility Report

## ✅ VERDICT: HIGHLY FEASIBLE — DO IT

---

## 1. What Is This Project?

A programmatic SEO website that generates **thousands of unique pages** for solar potential data by city, state, and zip code — powered by free government API data (NLR/NREL PVWatts).

Each page answers: *"How much solar power can I generate in [City, State]?"*

---

## 2. Why This Works (The Business Case)

### Search Demand is Massive
- "solar potential [city]" → thousands of monthly searches
- "solar calculator [state]" → high commercial intent
- Long-tail: "solar panels cost in Austin TX", "solar savings in Phoenix AZ" — millions of variants
- Zero strong programmatic competitors currently own this space

### The Zillow/TripAdvisor Model
These sites generate millions of pages from one template + a database. Google ranks them because:
1. Each page has REAL data (not fake/thin content)
2. User intent is perfectly matched
3. Pages are structurally unique enough

SolarAtlas does the same: **1 template × 30,000+ US cities = 30,000+ indexed pages**

---

## 3. Data Sources (All Free)

| Source | What You Get | Cost |
|--------|-------------|------|
| NLR PVWatts API (formerly NREL) | kWh/year, system output, monthly data | FREE (API key) |
| Google Solar API | Rooftop area, panel count potential | FREE tier available |
| US Census/OpenDataSoft | All US cities + lat/lng | FREE |
| Electricity Rates (EIA API) | Average state electricity cost | FREE |
| OpenWeather | Sun hours data | FREE tier |

**Important**: NREL domain moved to `developer.nlr.gov` (retired `developer.nrel.gov` May 2026). Update all API calls accordingly.

---

## 4. Tech Stack Recommendation for Bolt

```
Next.js 14 (App Router)     → Framework
TypeScript                   → Type safety
Tailwind CSS                 → Styling
Prisma + SQLite/PostgreSQL  → Store pre-fetched city data
Recharts                     → Solar charts
next-sitemap                 → Auto-generate XML sitemaps
```

**Why pre-fetch data instead of live API calls?**
- 30,000 pages can't all hit the API on each request
- Store data in DB → static generation → fast pages → better SEO

---

## 5. Page Architecture (4 Templates)

```
/                              → Homepage (search + stats)
/solar/[state]                 → State page (e.g., /solar/texas)
/solar/[state]/[city]          → City page (e.g., /solar/texas/austin)
/compare/[city1]-vs-[city2]    → Comparison page
```

This creates:
- 50 state pages
- ~30,000 city pages  
- Millions of comparison combinations (top 1,000 = instant traffic)

---

## 6. What Makes It NOT Thin Content

Each city page must include:
- Monthly solar production chart (Recharts)
- Payback period calculator
- Estimated annual savings (based on local electricity rate)
- Sun hours histogram
- Best roof orientation advice
- Local installer section (affiliate opportunity)
- FAQ schema markup
- YouTube embed (solar installation for that region)

**Rule**: Each page must have 500+ unique data points rendered, not just swapped text.

---

## 7. Monetization

1. **AdSense** — High CPC solar niche ($3–8/click)
2. **Affiliate** — Solar installer referrals ($50–200/lead)
3. **Lead Gen** — Sell leads to local solar companies
4. **Sponsored Listings** — Local solar companies pay for placement

Realistic revenue at 100K monthly visitors: **$3,000–$15,000/month**

---

## 8. Risks & How to Avoid Them

| Risk | Solution |
|------|---------|
| Google thin content penalty | Ensure 500+ unique data points per page |
| API rate limits | Pre-fetch and cache all data in DB |
| Duplicate content | Each page MUST vary by actual data, not just city name |
| NLR API domain change | Use `developer.nlr.gov` not old nrel.gov |

---

## 9. Timeline Estimate (Using Bolt)

| Phase | Time |
|-------|------|
| Core templates + design | 2–4 hours in Bolt |
| Data fetching scripts | 1–2 hours |
| Seeding 500 cities | 1 hour |
| SEO setup + sitemap | 1 hour |
| Deploy to Vercel | 30 mins |
| **Total** | **~1 day** |

---

## ✅ Final Answer

**YES — Build this. The opportunity is real.**

- Free data ✅
- High search volume ✅  
- No strong programmatic competitor ✅
- Clear monetization path ✅
- Buildable with Bolt in 2M tokens ✅

---
*Report generated June 2026*
