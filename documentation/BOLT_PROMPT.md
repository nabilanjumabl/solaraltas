# BOLT PROMPT — SolarAtlas Programmatic SEO Website

---

## PASTE THIS ENTIRE PROMPT INTO BOLT.NEW

---

Build a complete programmatic SEO website called **SolarAtlas** — a solar energy potential database for every US city. This is similar to how Zillow works for real estate: one template × thousands of cities = thousands of Google-ranking pages.

---

## STACK (STRICT)

- Next.js 14 App Router + TypeScript
- Tailwind CSS
- Prisma ORM + SQLite (for dev)
- Recharts (for all charts)
- Lucide React (for icons)
- next-sitemap (for XML sitemaps)
- Google Fonts: Syne (headings) + DM Sans (body)

---

## DESIGN SYSTEM

Dark premium solar aesthetic. Inspired by high-end fintech dashboards but with nature/energy feel.

```css
Colors:
--bg-primary: #0A0F0D
--bg-secondary: #111810
--bg-card: #141C16
--accent-green: #22C55E
--accent-amber: #F59E0B
--text-primary: #F0FDF4
--text-muted: #4B7A5E
--border: #1E3A2B

Typography:
- Headings: Syne (bold, geometric)
- Body: DM Sans
- Numbers/Data: JetBrains Mono
```

**Visual Style:**
- Deep dark backgrounds with subtle green tints
- Cards with glassmorphism + green glow on hover: `box-shadow: 0 0 40px rgba(34,197,94,0.08)`
- Amber/yellow accents for sun-related elements (sun icons, sun hours, ratings)
- NO pure white. Use #F0FDF4 for text
- Hero section: dark bg + subtle dot-grid pattern overlay
- Large monospace numbers for data display
- Smooth 300ms transitions on all interactive elements

---

## FILE STRUCTURE TO CREATE

```
app/
  layout.tsx          ← Root layout (nav + footer)
  page.tsx            ← Homepage
  solar/
    [state]/
      page.tsx        ← State page
      [city]/
        page.tsx      ← City page (MOST IMPORTANT)
  compare/
    [slug]/
      page.tsx        ← Compare two cities

components/
  Navbar.tsx
  Footer.tsx
  HeroSection.tsx
  SearchBar.tsx
  SolarChart.tsx      ← Monthly production (Recharts BarChart)
  SunHoursChart.tsx   ← Sun hours by month (Recharts AreaChart)
  SavingsCalculator.tsx ← Interactive calculator
  CityCard.tsx
  StatCard.tsx
  FAQSection.tsx

lib/
  api/
    pvwatts.ts        ← NLR PVWatts API client
  db/
    prisma.ts         ← Prisma client singleton
  utils/
    solar.ts          ← Calculation helpers
    formatters.ts     ← Number/currency formatters
    cities.ts         ← City data helpers

prisma/
  schema.prisma
  seed.ts             ← Seed 50 US cities with solar data

scripts/
  fetch-solar-data.ts ← Batch fetch from NLR API

next-sitemap.config.js
next.config.js
```

---

## PRISMA SCHEMA

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model City {
  id               Int      @id @default(autoincrement())
  name             String
  slug             String   @unique
  state            String
  stateSlug        String
  stateAbbr        String
  lat              Float
  lng              Float
  population       Int?
  
  // Solar Data
  annualKwh        Float?
  avgSunHours      Float?
  solarScore       Int?      // 1-100 score
  monthlyKwh       String?   // JSON array of 12 values
  monthlySunHours  String?   // JSON array of 12 values
  
  // Economic Data
  avgElectricRate  Float?    // $/kWh
  annualSavings    Float?
  paybackYears     Float?
  systemCost4kw    Float?
  
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
}

model State {
  id              Int      @id @default(autoincrement())
  name            String
  slug            String   @unique
  abbreviation    String
  avgSunHours     Float?
  avgSavings      Float?
  totalCities     Int?
}
```

---

## NLR PVWATTS API CLIENT

```typescript
// lib/api/pvwatts.ts
// CRITICAL: Use developer.nlr.gov NOT developer.nrel.gov (retired May 2026)

const NLR_API_BASE = 'https://developer.nlr.gov/api/pvwatts/v8/output.json'

export async function fetchSolarData(lat: number, lng: number) {
  const params = new URLSearchParams({
    api_key: process.env.NLR_API_KEY || 'DEMO_KEY',
    system_capacity: '4',
    lat: lat.toString(),
    lon: lng.toString(),
    azimuth: '180',
    tilt: '20',
    array_type: '1',
    module_type: '0',
    losses: '14',
  })
  
  const res = await fetch(`${NLR_API_BASE}?${params}`)
  const data = await res.json()
  
  return {
    annualKwh: data.outputs?.ac_annual,
    monthlyKwh: data.outputs?.ac_monthly,
    solradAnnual: data.outputs?.solrad_annual,
    solradMonthly: data.outputs?.solrad_monthly,
  }
}
```

---

## SEED DATA (50 cities with approximate solar data)

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const cities = [
  // [name, slug, state, stateSlug, stateAbbr, lat, lng, population, annualKwh, avgSunHours, solarScore, avgElectricRate]
  ['Phoenix', 'phoenix', 'Arizona', 'arizona', 'AZ', 33.45, -112.07, 1608139, 7200, 6.5, 98, 0.13],
  ['Las Vegas', 'las-vegas', 'Nevada', 'nevada', 'NV', 36.17, -115.14, 641903, 6900, 6.3, 96, 0.12],
  ['Los Angeles', 'los-angeles', 'California', 'california', 'CA', 34.05, -118.24, 3971883, 6200, 5.8, 90, 0.27],
  ['San Diego', 'san-diego', 'California', 'california', 'CA', 32.72, -117.16, 1386932, 6400, 5.9, 92, 0.27],
  ['Honolulu', 'honolulu', 'Hawaii', 'hawaii', 'HI', 21.31, -157.86, 347397, 6800, 6.2, 95, 0.32],
  ['Austin', 'austin', 'Texas', 'texas', 'TX', 30.27, -97.74, 961855, 5800, 5.4, 86, 0.12],
  ['Houston', 'houston', 'Texas', 'texas', 'TX', 29.76, -95.37, 2304580, 5600, 5.2, 84, 0.11],
  ['Dallas', 'dallas', 'Texas', 'texas', 'TX', 32.78, -96.80, 1343573, 5700, 5.3, 85, 0.12],
  ['Miami', 'miami', 'Florida', 'florida', 'FL', 25.77, -80.19, 470914, 5900, 5.5, 88, 0.13],
  ['Orlando', 'orlando', 'Florida', 'florida', 'FL', 28.54, -81.38, 309154, 5700, 5.4, 85, 0.13],
  ['Tampa', 'tampa', 'Florida', 'florida', 'FL', 27.95, -82.46, 399700, 5600, 5.3, 83, 0.13],
  ['Atlanta', 'atlanta', 'Georgia', 'georgia', 'GA', 33.75, -84.39, 498715, 5200, 4.9, 78, 0.12],
  ['Denver', 'denver', 'Colorado', 'colorado', 'CO', 39.74, -104.98, 715522, 5900, 5.5, 87, 0.13],
  ['Albuquerque', 'albuquerque', 'New Mexico', 'new-mexico', 'NM', 35.08, -106.65, 564559, 6500, 6.0, 93, 0.13],
  ['Tucson', 'tucson', 'Arizona', 'arizona', 'AZ', 32.22, -110.97, 542629, 7100, 6.4, 97, 0.13],
  ['Sacramento', 'sacramento', 'California', 'california', 'CA', 38.58, -121.49, 513624, 5900, 5.5, 87, 0.22],
  ['San Jose', 'san-jose', 'California', 'california', 'CA', 37.34, -121.89, 1013240, 5800, 5.4, 86, 0.27],
  ['San Francisco', 'san-francisco', 'California', 'california', 'CA', 37.77, -122.42, 873965, 5000, 4.8, 75, 0.28],
  ['Portland', 'portland', 'Oregon', 'oregon', 'OR', 45.52, -122.67, 652503, 4200, 4.0, 62, 0.11],
  ['Seattle', 'seattle', 'Washington', 'washington', 'WA', 47.61, -122.33, 749256, 3800, 3.7, 55, 0.11],
  ['New York', 'new-york', 'New York', 'new-york', 'NY', 40.71, -74.01, 8336817, 4500, 4.4, 68, 0.23],
  ['Boston', 'boston', 'Massachusetts', 'massachusetts', 'MA', 42.36, -71.06, 695506, 4300, 4.2, 65, 0.25],
  ['Philadelphia', 'philadelphia', 'Pennsylvania', 'pennsylvania', 'PA', 39.95, -75.17, 1584064, 4400, 4.3, 66, 0.16],
  ['Washington DC', 'washington-dc', 'District of Columbia', 'district-of-columbia', 'DC', 38.91, -77.04, 705749, 4600, 4.5, 70, 0.14],
  ['Charlotte', 'charlotte', 'North Carolina', 'north-carolina', 'NC', 35.23, -80.84, 885708, 5100, 4.8, 77, 0.13],
  ['Raleigh', 'raleigh', 'North Carolina', 'north-carolina', 'NC', 35.77, -78.64, 467665, 5000, 4.7, 75, 0.12],
  ['Nashville', 'nashville', 'Tennessee', 'tennessee', 'TN', 36.17, -86.78, 689447, 4900, 4.6, 73, 0.11],
  ['Memphis', 'memphis', 'Tennessee', 'tennessee', 'TN', 35.15, -90.05, 633104, 5000, 4.7, 75, 0.11],
  ['Louisville', 'louisville', 'Kentucky', 'kentucky', 'KY', 38.25, -85.76, 633045, 4700, 4.5, 71, 0.10],
  ['Indianapolis', 'indianapolis', 'Indiana', 'indiana', 'IN', 39.77, -86.16, 887642, 4600, 4.4, 69, 0.12],
  ['Columbus', 'columbus', 'Ohio', 'ohio', 'OH', 39.96, -82.99, 905748, 4500, 4.3, 67, 0.13],
  ['Chicago', 'chicago', 'Illinois', 'illinois', 'IL', 41.88, -87.63, 2696555, 4400, 4.3, 66, 0.16],
  ['Milwaukee', 'milwaukee', 'Wisconsin', 'wisconsin', 'WI', 43.04, -87.91, 577222, 4200, 4.1, 62, 0.17],
  ['Minneapolis', 'minneapolis', 'Minnesota', 'minnesota', 'MN', 44.98, -93.27, 429954, 4500, 4.4, 68, 0.14],
  ['Kansas City', 'kansas-city', 'Missouri', 'missouri', 'MO', 39.10, -94.58, 508090, 4900, 4.6, 73, 0.11],
  ['Omaha', 'omaha', 'Nebraska', 'nebraska', 'NE', 41.26, -95.94, 486051, 5000, 4.7, 75, 0.11],
  ['Oklahoma City', 'oklahoma-city', 'Oklahoma', 'oklahoma', 'OK', 35.47, -97.52, 681054, 5300, 5.0, 80, 0.10],
  ['San Antonio', 'san-antonio', 'Texas', 'texas', 'TX', 29.42, -98.49, 1434625, 5700, 5.3, 85, 0.11],
  ['El Paso', 'el-paso', 'Texas', 'texas', 'TX', 31.76, -106.49, 678815, 6400, 5.9, 93, 0.12],
  ['Fort Worth', 'fort-worth', 'Texas', 'texas', 'TX', 32.75, -97.33, 935508, 5700, 5.3, 85, 0.12],
  ['Jacksonville', 'jacksonville', 'Florida', 'florida', 'FL', 30.33, -81.66, 949611, 5500, 5.2, 82, 0.13],
  ['Charlotte', 'charlotte-nc', 'North Carolina', 'north-carolina', 'NC', 35.23, -80.84, 874579, 5100, 4.8, 77, 0.12],
  ['Virginia Beach', 'virginia-beach', 'Virginia', 'virginia', 'VA', 36.85, -75.98, 459470, 4800, 4.6, 72, 0.13],
  ['Baltimore', 'baltimore', 'Maryland', 'maryland', 'MD', 39.29, -76.61, 585708, 4500, 4.4, 68, 0.15],
  ['New Orleans', 'new-orleans', 'Louisiana', 'louisiana', 'LA', 29.95, -90.07, 383997, 5400, 5.1, 81, 0.09],
  ['Mesa', 'mesa', 'Arizona', 'arizona', 'AZ', 33.42, -111.83, 504258, 7100, 6.4, 97, 0.13],
  ['Fresno', 'fresno', 'California', 'california', 'CA', 36.74, -119.77, 530093, 6300, 5.8, 92, 0.22],
  ['Bakersfield', 'bakersfield', 'California', 'california', 'CA', 35.37, -119.02, 403455, 6500, 6.0, 94, 0.22],
  ['Colorado Springs', 'colorado-springs', 'Colorado', 'colorado', 'CO', 38.83, -104.82, 478221, 5900, 5.5, 87, 0.13],
  ['Long Beach', 'long-beach', 'California', 'california', 'CA', 33.77, -118.19, 466742, 6100, 5.7, 89, 0.27],
]

async function main() {
  console.log('Seeding cities...')
  for (const [name, slug, state, stateSlug, stateAbbr, lat, lng, population, annualKwh, avgSunHours, solarScore, avgElectricRate] of cities) {
    const annualSavings = (annualKwh as number) * (avgElectricRate as number)
    const systemCost = 12000 // average 4kW system
    const paybackYears = systemCost / annualSavings

    // Generate realistic monthly data based on annual
    const monthlyFactors = [0.06, 0.07, 0.09, 0.10, 0.10, 0.10, 0.10, 0.10, 0.09, 0.08, 0.06, 0.05]
    const monthlyKwh = monthlyFactors.map(f => Math.round((annualKwh as number) * f))
    const monthlySunHours = monthlyFactors.map(f => Math.round((avgSunHours as number) * f * 30 * 10) / 10)

    await prisma.city.upsert({
      where: { slug: slug as string },
      update: {},
      create: {
        name: name as string,
        slug: slug as string,
        state: state as string,
        stateSlug: stateSlug as string,
        stateAbbr: stateAbbr as string,
        lat: lat as number,
        lng: lng as number,
        population: population as number,
        annualKwh: annualKwh as number,
        avgSunHours: avgSunHours as number,
        solarScore: solarScore as number,
        monthlyKwh: JSON.stringify(monthlyKwh),
        monthlySunHours: JSON.stringify(monthlySunHours),
        avgElectricRate: avgElectricRate as number,
        annualSavings: Math.round(annualSavings),
        paybackYears: Math.round(paybackYears * 10) / 10,
        systemCost4kw: systemCost,
      }
    })
  }
  console.log(`✅ Seeded ${cities.length} cities`)
}

main().catch(console.error).finally(() => prisma.$disconnect())
```

---

## HOMEPAGE COMPONENT (app/page.tsx)

Build the homepage with this structure:
1. **HeroSection** — Full-width dark hero with dot-grid background, large search bar centered, tagline "Know Your Home's Solar Potential", subtitle "Free government data for 30,000+ US cities"
2. **TrustBar** — "Powered by NLR (National Lab of the Rockies) • Formerly NREL • U.S. Dept of Energy"
3. **StatsSection** — 4 stat cards: 30,000+ cities, 50 states, Free forever, 1M+ calculations
4. **FeaturedCities** — Grid of top 20 cities, each as CityCard with solarScore, annualKwh, annualSavings
5. **HowItWorks** — 3-step section: Search → See Data → Save Money
6. **StateDirectory** — Footer-area grid of all 50 states linking to state pages

---

## CITY PAGE (app/solar/[state]/[city]/page.tsx)

This is the most critical template. Build it with these sections IN ORDER:

### Section 1: City Header
```
[City Name], [State]            ← H1
Solar Potential Score: [XX]/100 ← Score badge (color coded: 90+ green, 70-89 yellow, <70 red)
[X.X] Peak Sun Hours/Day        ← Key metric
```

### Section 2: Key Metrics Row (4 cards)
- Annual Production: [X,XXX] kWh/year
- Annual Savings: $[X,XXX]/year
- Payback Period: [X.X] years
- Solar Score: [XX]/100

### Section 3: Monthly Solar Production Chart
Recharts BarChart — 12 months on X axis, kWh on Y axis
- Bars: green gradient fill
- Add amber/yellow line for sun hours overlay
- Include chart title: "Monthly Solar Production (4kW System)"

### Section 4: Interactive Savings Calculator
```
System Size: [slider: 3kW — 10kW]
Monthly Electric Bill: $[input]
─────────────────────────────────
Annual Production:    X,XXX kWh
Annual Savings:       $X,XXX
Payback Period:       X.X years
25-Year ROI:          $XX,XXX
```

### Section 5: System Sizing Guide (table)
| System Size | Yearly Output | Cost Est. | Payback |
|-------------|--------------|-----------|---------|
| 3kW         | X,XXX kWh    | $9,000    | X.X yrs |
| 5kW         | X,XXX kWh    | $15,000   | X.X yrs |
| 8kW         | X,XXX kWh    | $22,000   | X.X yrs |

### Section 6: Environmental Impact
- CO2 offset per year (lbs)
- Equivalent trees planted
- Equivalent miles not driven

### Section 7: FAQ (with JSON-LD schema)
5 questions about solar in that specific city

### Section 8: Nearby Cities
5 cards linking to other city pages

---

## CHART COMPONENTS

### SolarChart.tsx (Monthly Production)
```tsx
// Use Recharts BarChart
// Props: monthlyData: number[], cityName: string
// Style: dark bg, green gradient bars, amber reference line for average
// Show month names on X axis (Jan, Feb, etc.)
// Show kWh values on Y axis
// Add tooltip with exact values
// Animate bars on mount
```

### SunHoursChart.tsx
```tsx
// Use Recharts AreaChart
// Props: monthlySunHours: number[]
// Style: amber gradient fill, golden line
// Same dark bg to match design system
```

---

## SEO FOR EVERY CITY PAGE

```typescript
export async function generateMetadata({ params }) {
  const city = await getCityData(params.city)
  return {
    title: `Solar Potential in ${city.name}, ${city.state} (${new Date().getFullYear()} Data) | SolarAtlas`,
    description: `${city.name} averages ${city.avgSunHours} peak sun hours/day. A 4kW solar system produces ${city.annualKwh?.toLocaleString()} kWh/year, saving ~$${city.annualSavings?.toLocaleString()}/year. Free solar calculator.`,
    keywords: [
      `solar potential ${city.name}`,
      `solar panels ${city.name} ${city.stateAbbr}`,
      `solar energy ${city.name}`,
      `is solar worth it ${city.name}`,
      `solar calculator ${city.name}`
    ],
    openGraph: {
      title: `Solar Potential in ${city.name}, ${city.state}`,
      description: `${city.avgSunHours} sun hours/day • $${city.annualSavings?.toLocaleString()}/yr savings • Solar score: ${city.solarScore}/100`,
      type: 'website',
    },
    alternates: {
      canonical: `https://solaratlas.com/solar/${city.stateSlug}/${city.slug}`
    }
  }
}
```

Add this JSON-LD to every city page:
```tsx
<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": `How much solar power can I generate in ${city.name}?`,
      "acceptedAnswer": { "@type": "Answer", "text": `A standard 4kW solar system in ${city.name} generates approximately ${city.annualKwh?.toLocaleString()} kWh per year, based on the city's ${city.avgSunHours} average peak sun hours per day.` }
    },
    {
      "@type": "Question",
      "name": `Is solar worth it in ${city.name}, ${city.state}?`,
      "acceptedAnswer": { "@type": "Answer", "text": `Yes. ${city.name} has a solar score of ${city.solarScore}/100 and an estimated payback period of ${city.paybackYears} years. With local electricity rates at $${city.avgElectricRate}/kWh, you can save approximately $${city.annualSavings?.toLocaleString()} per year.` }
    }
  ]
})}} />
```

---

## NEXT-SITEMAP CONFIG

```javascript
// next-sitemap.config.js
module.exports = {
  siteUrl: 'https://solaratlas.com',
  generateRobotsTxt: true,
  changefreq: 'monthly',
  priority: 0.7,
  sitemapSize: 5000,
  exclude: ['/api/*'],
  additionalPaths: async (config) => {
    // Dynamically add all city pages from DB
    const cities = await prisma.city.findMany({ select: { slug: true, stateSlug: true } })
    return cities.map(city => ({
      loc: `/solar/${city.stateSlug}/${city.slug}`,
      changefreq: 'monthly',
      priority: 0.8,
    }))
  }
}
```

---

## ENVIRONMENT VARIABLES NEEDED

```
DATABASE_URL="file:./dev.db"
NLR_API_KEY="your_free_api_key_from_developer.nlr.gov"
NEXT_PUBLIC_SITE_URL="https://solaratlas.com"
```

---

## WHAT TO BUILD FIRST (Priority Order)

1. prisma/schema.prisma + migration
2. prisma/seed.ts + run seed
3. app/layout.tsx (Navbar + Footer)
4. app/page.tsx (Homepage with city cards from DB)
5. app/solar/[state]/[city]/page.tsx (CITY PAGE — most important)
6. All chart components (SolarChart, SunHoursChart)
7. SavingsCalculator.tsx
8. app/solar/[state]/page.tsx (State page)
9. SEO metadata + JSON-LD on all pages
10. next-sitemap config

---

## IMPORTANT NOTES

1. NREL domain is RETIRED. Use `developer.nlr.gov` for all API calls
2. Pre-generate all city pages with `generateStaticParams` + `revalidate: 86400`
3. Each city page must have 500+ words of unique data (not just name swapped)
4. Charts must render actual data, not placeholder data
5. Mobile-first: all layouts must work perfectly at 375px width
6. Use `font-mono` class for all number/data displays
7. Every page needs canonical URL to prevent duplicate content issues

---

BUILD THIS COMPLETELY. Do not use stubs or TODOs. Every file must be production-ready.
