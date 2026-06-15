# SolarAtlas — Agent Instructions (agent.md)

> AI agent file for building a Programmatic SEO solar potential website.
> Stack: Next.js 14 + TypeScript + Tailwind + Prisma + Recharts
> Platform: Bolt.new (2M token budget)

---

## PROJECT OVERVIEW

**SolarAtlas** is a programmatic SEO website that generates thousands of pages showing solar energy potential for every US city. Each page is powered by real government data from the NLR (National Laboratory of the Rockies) PVWatts API.

**Goal**: Rank on Google for "solar potential [city]", "solar savings [state]", "solar calculator [zip]" — thousands of long-tail keywords.

**Model**: Like Zillow for solar data. 1 template × 30,000 cities = 30,000 SEO pages.

---

## TECH STACK (STRICT — Do Not Change)

```
Framework:     Next.js 14 App Router
Language:      TypeScript (strict mode)
Styling:       Tailwind CSS only (no CSS modules, no styled-components)
Database:      Prisma ORM + SQLite (dev) / PostgreSQL (prod)
Charts:        Recharts only
Icons:         Lucide React
SEO:           next-sitemap, next/head metadata API
Deployment:    Vercel
Fonts:         Google Fonts (Syne for headings, DM Sans for body)
```

---

## FILE STRUCTURE

```
solaratlas/
├── app/
│   ├── layout.tsx                    # Root layout with nav + footer
│   ├── page.tsx                      # Homepage
│   ├── solar/
│   │   ├── [state]/
│   │   │   ├── page.tsx              # State page (e.g., /solar/texas)
│   │   │   └── [city]/
│   │   │       └── page.tsx          # City page (e.g., /solar/texas/austin)
│   └── compare/
│       └── [slug]/
│           └── page.tsx              # Compare page (e.g., /compare/austin-vs-phoenix)
├── components/
│   ├── SolarChart.tsx                # Monthly production bar chart
│   ├── SavingsCalculator.tsx         # Interactive payback calculator
│   ├── SunHoursChart.tsx             # Sun hours by month
│   ├── CityCard.tsx                  # Card for city listings
│   ├── SearchBar.tsx                 # City search with autocomplete
│   ├── HeroSection.tsx               # Homepage hero
│   └── SEOHead.tsx                   # Dynamic meta tags
├── lib/
│   ├── api/
│   │   ├── pvwatts.ts                # NLR PVWatts API client
│   │   └── geocoding.ts              # City → lat/lng lookup
│   ├── db/
│   │   └── prisma.ts                 # Prisma client singleton
│   └── utils/
│       ├── solar.ts                  # Solar calculation helpers
│       └── formatters.ts             # Number/currency formatters
├── prisma/
│   ├── schema.prisma                 # DB schema
│   └── seed.ts                       # Seed 500 US cities
├── scripts/
│   └── fetch-solar-data.ts           # Batch fetch + store solar data
├── public/
│   └── robots.txt
├── next-sitemap.config.js
└── next.config.js
```

---

## DATABASE SCHEMA (Prisma)

```prisma
model City {
  id               Int      @id @default(autoincrement())
  name             String
  slug             String   @unique
  state            String
  stateSlug        String
  lat              Float
  lng              Float
  population       Int?
  
  // Solar Data (from NLR PVWatts API)
  annualKwh        Float?   // Annual kWh output for 4kW system
  avgSunHours      Float?   // Average peak sun hours/day
  monthlyData      Json?    // Array of 12 monthly kWh values
  
  // Economic Data
  avgElectricRate  Float?   // $/kWh (from EIA)
  annualSavings    Float?   // Estimated annual $ savings
  paybackYears     Float?   // System payback period
  systemCost       Float?   // Avg 4kW system cost in area
  
  // SEO
  metaTitle        String?
  metaDescription  String?
  
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
}

model State {
  id              Int      @id @default(autoincrement())
  name            String
  slug            String   @unique
  abbreviation    String
  avgSunHours     Float?
  totalInstalls   Int?
  avgSavings      Float?
}
```

---

## API CONFIGURATION

### NLR PVWatts API (CRITICAL: New Domain)
```
Base URL: https://developer.nlr.gov/api/pvwatts/v8/output.json
Old URL:  https://developer.nrel.gov  ← RETIRED May 2026, DO NOT USE

Required params:
- api_key: (get free key at developer.nlr.gov)
- system_capacity: 4  (4kW standard system)
- lat: [city latitude]
- lon: [city longitude]
- azimuth: 180  (south-facing)
- tilt: [state-based optimal tilt]
- array_type: 1  (fixed open rack)
- module_type: 0  (standard)
- losses: 14  (standard losses %)
```

### Response to Store
```typescript
{
  ac_annual: number,          // Annual kWh
  ac_monthly: number[],       // 12 monthly values
  solrad_annual: number,      // Annual solar radiation
  solrad_monthly: number[]    // Monthly sun hours
}
```

---

## PAGE REQUIREMENTS

### Homepage (/)
- Hero with city search (large, prominent)
- Trust bar: "Powered by NLR Government Data"
- Stats: 30,000+ cities, 50 states, free tool
- Featured cities grid (top 20 by population)
- How It Works section (3 steps)
- Footer with state directory

### State Page (/solar/[state])
- State header with average sun hours + stats
- Top 20 cities table with solar scores
- State-level solar chart
- State incentives section (static content per state)
- Links to all cities in state

### City Page (/solar/[state]/[city]) ← MOST IMPORTANT
Must include ALL of these:
1. City header: name, state, avg sun hours, solar score
2. **Monthly Production Chart** (Recharts BarChart — 12 months)
3. **Savings Calculator** (interactive: system size slider, bill input)
4. **Payback Period** display (years + total ROI)
5. **Sun Hours Histogram** (Recharts)
6. **System Sizing Guide** (table: 3kW / 5kW / 8kW options)
7. Environmental impact (CO2 offset, trees equivalent)
8. FAQ section (5 questions, with schema markup)
9. Nearby cities links (5 closest cities)

### Compare Page (/compare/[city1]-vs-[city2])
- Side-by-side data table
- Combined bar chart comparing both cities
- Winner badges (e.g., "Austin wins on Sun Hours")
- Both city links

---

## SEO RULES (CRITICAL)

Every city page MUST have:
```typescript
export const generateMetadata = ({ params }) => ({
  title: `Solar Potential in ${city}, ${state} | SolarAtlas`,
  description: `${city} gets ${sunHours} peak sun hours/day. A 4kW solar system generates ${annualKwh} kWh/year, saving you $${savings}/year. Free solar calculator.`,
  openGraph: { ... },
  alternates: { canonical: `https://solaratlas.com/solar/${stateSlug}/${citySlug}` }
})
```

Add JSON-LD schema on every city page:
```json
{
  "@type": "WebPage",
  "about": "Solar energy potential",
  "name": "Solar Potential in [City]",
  "description": "...",
  "breadcrumb": { ... }
}
```

Add FAQ schema with these questions:
1. How much solar power can I generate in [City]?
2. Is solar worth it in [City], [State]?
3. How long does solar payback take in [City]?
4. What size solar system do I need in [City]?
5. What solar incentives are available in [State]?

---

## DESIGN SYSTEM

### Color Palette
```css
--bg-primary: #0A0F0D       /* Near black with green tint */
--bg-secondary: #111810     /* Slightly lighter */
--bg-card: #141C16          /* Card backgrounds */
--accent-primary: #22C55E   /* Bright solar green */
--accent-secondary: #F59E0B /* Solar amber/gold */
--text-primary: #F0FDF4     /* Near white */
--text-secondary: #86EFAC   /* Muted green */
--text-muted: #4B7A5E       /* Dimmed text */
--border: #1E3A2B           /* Subtle borders */
--glow: rgba(34,197,94,0.15) /* Card glow effect */
```

### Typography
```
Headings: Syne (Google Fonts) — bold, geometric
Body: DM Sans (Google Fonts) — clean, readable
Mono: JetBrains Mono — for data/numbers
```

### Design Style
- Dark theme (deep forest-green blacks)
- Glassmorphism cards with subtle green glow
- Yellow/amber accents for sun/energy elements
- Large number displays with monospace font
- Subtle grid/dot patterns in hero backgrounds
- No pure white — use off-white warm tones
- Charts: green gradient fills, amber lines

### Component Style
```
Cards:    rounded-2xl, bg-card, border border-border, hover:border-accent-primary/50
Buttons:  bg-accent-primary text-black font-semibold rounded-xl px-6 py-3
Numbers:  font-mono text-4xl text-accent-primary
Labels:   text-xs uppercase tracking-widest text-text-muted
```

---

## CODING RULES

1. **Never use `any` type** — always type everything properly
2. **All API calls in lib/api/ only** — never inline in components
3. **Static Generation preferred** — use `generateStaticParams` for city pages
4. **ISR for data freshness** — `revalidate: 86400` (24 hours)
5. **Error boundaries** — wrap all data-dependent components
6. **Loading states** — use Suspense + skeleton components
7. **Mobile first** — all layouts responsive, test at 375px
8. **Accessibility** — all charts have aria-labels, all inputs have labels
9. **No external UI libraries** — Tailwind + custom components only
10. **Complete files** — never write stubs or TODOs

---

## DATA SEEDING PRIORITY

Seed these 50 cities FIRST (highest search volume):
New York, Los Angeles, Houston, Phoenix, Philadelphia, San Antonio, San Diego, Dallas, San Jose, Austin, Jacksonville, Fort Worth, Columbus, Charlotte, Indianapolis, San Francisco, Seattle, Denver, Nashville, Oklahoma City, El Paso, Washington DC, Las Vegas, Louisville, Memphis, Portland, Baltimore, Milwaukee, Albuquerque, Tucson, Fresno, Sacramento, Mesa, Kansas City, Atlanta, Omaha, Colorado Springs, Raleigh, Long Beach, Virginia Beach, Minneapolis, Tampa, New Orleans, Arlington, Bakersfield, Honolulu, Anchorage, Miami, Orlando, Boston

---

## PHASE PLAN

### Phase 1: Foundation (Complete First)
- [ ] next.config.js setup
- [ ] Tailwind config with design tokens
- [ ] Prisma schema + migration
- [ ] Root layout with nav/footer
- [ ] Homepage (static, no data yet)

### Phase 2: Data Layer
- [ ] PVWatts API client (nlr.gov)
- [ ] City seed data (50 cities)
- [ ] fetch-solar-data.ts script
- [ ] Run seed

### Phase 3: Core Pages
- [ ] City page template (most important)
- [ ] All charts (SolarChart, SunHoursChart)
- [ ] SavingsCalculator component
- [ ] State page

### Phase 4: SEO Layer
- [ ] generateMetadata for all pages
- [ ] JSON-LD FAQ schema
- [ ] next-sitemap config
- [ ] robots.txt

### Phase 5: Polish
- [ ] Compare page
- [ ] Search with autocomplete
- [ ] Mobile optimization
- [ ] Performance audit

---

## WHAT GROK/AI GOT WRONG (Don't Repeat)

1. ❌ Used old `developer.nrel.gov` domain (retired May 2026)
2. ❌ No database — tried to fetch live API on every request
3. ❌ Generic design (white bg, basic cards)
4. ❌ Thin pages — only swapped city name, no real data variance
5. ❌ No FAQ schema markup
6. ❌ No ISR/caching strategy
7. ❌ Missing generateStaticParams (pages not pre-generated)

---

## SUCCESS METRICS

- 30,000+ pages indexed within 90 days
- Top 10 rankings for "[city] solar potential" within 6 months
- 50,000+ monthly organic visitors within 1 year
- $2,000+/month AdSense revenue within 1 year

---

*Agent file version 1.0 — SolarAtlas Project — June 2026*
