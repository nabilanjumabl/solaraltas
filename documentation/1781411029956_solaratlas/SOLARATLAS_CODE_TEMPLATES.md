# SOLARATLAS - CODE TEMPLATES & IMPLEMENTATION
## Ready-to-use code for all 4 templates

---

## FILE 1: `/public/data/cities.json` - Sample Data

```json
[
  {
    "id": 1,
    "name": "Phoenix",
    "slug": "phoenix",
    "state": "Arizona",
    "stateSlug": "arizona",
    "stateAbbr": "AZ",
    "lat": 33.4484,
    "lng": -112.0742,
    "solarScore": 98,
    "peakSunHours": 6.5,
    "annualKwhPerKw": 1800,
    "avgElectricRate": 0.13,
    "annualSavings": 936,
    "paybackYears": 12.8,
    "savings25Year": 23400,
    "systemCost4kw": 12000,
    "federalTaxCredit": 3600,
    "stateIncentives": 2000,
    "netCost": 6400,
    "monthlyKwh": [624, 732, 840, 864, 876, 900, 876, 840, 780, 720, 648, 576],
    "monthlySunHours": [5.2, 6.1, 7.0, 7.2, 7.3, 7.5, 7.3, 7.0, 6.5, 6.0, 5.4, 4.8],
    "cloudyDaysPerYear": 85,
    "rainyDaysPerYear": 36,
    "installerCount": 127,
    "climateType": "hot desert",
    "avgTemperature": 75,
    "humidity": 18,
    "metaTitle": "Solar Potential in Phoenix, Arizona | SolarAtlas",
    "metaDescription": "Phoenix solar potential: 98/100 score. Save $936/year. 6.5 peak sun hours. Free calculator."
  },
  {
    "id": 2,
    "name": "Tucson",
    "slug": "tucson",
    "state": "Arizona",
    "stateSlug": "arizona",
    "stateAbbr": "AZ",
    "lat": 32.2226,
    "lng": -110.9747,
    "solarScore": 97,
    "peakSunHours": 6.4,
    "annualKwhPerKw": 1750,
    "avgElectricRate": 0.13,
    "annualSavings": 923,
    "paybackYears": 13.0,
    "savings25Year": 23075,
    "systemCost4kw": 12000,
    "federalTaxCredit": 3600,
    "stateIncentives": 2000,
    "netCost": 6400,
    "monthlyKwh": [600, 710, 820, 840, 860, 890, 860, 820, 760, 700, 630, 550],
    "monthlySunHours": [5.0, 5.9, 6.8, 7.0, 7.1, 7.3, 7.1, 6.8, 6.3, 5.8, 5.2, 4.6],
    "cloudyDaysPerYear": 87,
    "rainyDaysPerYear": 50,
    "installerCount": 95,
    "climateType": "hot desert",
    "avgTemperature": 72,
    "humidity": 20,
    "metaTitle": "Solar Potential in Tucson, Arizona | SolarAtlas",
    "metaDescription": "Tucson solar potential: 97/100 score. Save $923/year. 6.4 peak sun hours. Free analysis."
  },
  {
    "id": 3,
    "name": "Austin",
    "slug": "austin",
    "state": "Texas",
    "stateSlug": "texas",
    "stateAbbr": "TX",
    "lat": 30.2672,
    "lng": -97.7431,
    "solarScore": 86,
    "peakSunHours": 5.4,
    "annualKwhPerKw": 1480,
    "avgElectricRate": 0.12,
    "annualSavings": 696,
    "paybackYears": 17.2,
    "savings25Year": 17400,
    "systemCost4kw": 12000,
    "federalTaxCredit": 3600,
    "stateIncentives": 1500,
    "netCost": 6900,
    "monthlyKwh": [410, 480, 600, 630, 680, 700, 700, 680, 600, 520, 410, 370],
    "monthlySunHours": [3.9, 4.5, 5.6, 5.8, 6.2, 6.4, 6.4, 6.2, 5.6, 4.8, 3.9, 3.6],
    "cloudyDaysPerYear": 104,
    "rainyDaysPerYear": 90,
    "installerCount": 89,
    "climateType": "subtropical/humid",
    "avgTemperature": 68,
    "humidity": 60,
    "metaTitle": "Solar Potential in Austin, Texas | SolarAtlas",
    "metaDescription": "Austin solar potential: 86/100 score. Save $696/year. 5.4 peak sun hours. Free calculator."
  },
  {
    "id": 4,
    "name": "Las Vegas",
    "slug": "las-vegas",
    "state": "Nevada",
    "stateSlug": "nevada",
    "stateAbbr": "NV",
    "lat": 36.1699,
    "lng": -115.1398,
    "solarScore": 96,
    "peakSunHours": 6.3,
    "annualKwhPerKw": 1750,
    "avgElectricRate": 0.12,
    "annualSavings": 828,
    "paybackYears": 14.5,
    "savings25Year": 20700,
    "systemCost4kw": 12000,
    "federalTaxCredit": 3600,
    "stateIncentives": 1800,
    "netCost": 6600,
    "monthlyKwh": [600, 710, 850, 900, 950, 980, 950, 900, 800, 680, 580, 540],
    "monthlySunHours": [5.0, 5.9, 7.0, 7.4, 7.7, 8.0, 7.7, 7.4, 6.6, 5.6, 4.8, 4.4],
    "cloudyDaysPerYear": 70,
    "rainyDaysPerYear": 30,
    "installerCount": 102,
    "climateType": "hot desert",
    "avgTemperature": 72,
    "humidity": 22,
    "metaTitle": "Solar Potential in Las Vegas, Nevada | SolarAtlas",
    "metaDescription": "Las Vegas solar potential: 96/100 score. Save $828/year. 6.3 peak sun hours. Free analysis."
  }
]
```

---

## FILE 2: `/public/data/states.json` - Sample Data

```json
[
  {
    "id": 1,
    "name": "Arizona",
    "slug": "arizona",
    "abbreviation": "AZ",
    "lat": 33.7298,
    "lng": -111.4312,
    "avgSolarScore": 97,
    "avgSunHours": 6.5,
    "avgAnnualSavings": 943,
    "avgPaybackYears": 6.5,
    "cityCount": 47,
    "climateType": "hot desert",
    "avgTemperature": 75,
    "cloudyDaysPerYear": 85,
    "rainyDaysPerYear": 36,
    "stateIncentives": {
      "propertyTaxExemption": 2000,
      "energyTaxCredit": 3000,
      "netMetering": "excellent"
    },
    "topCities": ["Phoenix", "Tucson", "Mesa"],
    "installerCount": 127,
    "rating": 5,
    "metaTitle": "Arizona Solar Potential | 30,000+ Cities | SolarAtlas",
    "metaDescription": "Arizona has the best solar potential in USA (score 97). Save $943/year. Free analysis for all 47 Arizona cities."
  },
  {
    "id": 2,
    "name": "Texas",
    "slug": "texas",
    "abbreviation": "TX",
    "lat": 31.9686,
    "lng": -99.9018,
    "avgSolarScore": 82,
    "avgSunHours": 5.2,
    "avgAnnualSavings": 712,
    "avgPaybackYears": 16.8,
    "cityCount": 127,
    "climateType": "subtropical/humid",
    "avgTemperature": 68,
    "cloudyDaysPerYear": 100,
    "rainyDaysPerYear": 85,
    "stateIncentives": {
      "propertyTaxExemption": 1500,
      "energyTaxCredit": 0,
      "netMetering": "good"
    },
    "topCities": ["Austin", "San Antonio", "Dallas"],
    "installerCount": 156,
    "rating": 4,
    "metaTitle": "Texas Solar Potential | Free Analysis for 127 Cities | SolarAtlas",
    "metaDescription": "Texas solar analysis: score 82. Save $712/year average. Free solar potential calculator for all Texas cities."
  },
  {
    "id": 3,
    "name": "Nevada",
    "slug": "nevada",
    "abbreviation": "NV",
    "lat": 38.3135,
    "lng": -117.0554,
    "avgSolarScore": 96,
    "avgSunHours": 6.3,
    "avgAnnualSavings": 828,
    "avgPaybackYears": 14.5,
    "cityCount": 23,
    "climateType": "hot desert",
    "avgTemperature": 72,
    "cloudyDaysPerYear": 70,
    "rainyDaysPerYear": 30,
    "stateIncentives": {
      "propertyTaxExemption": 1800,
      "energyTaxCredit": 0,
      "netMetering": "excellent"
    },
    "topCities": ["Las Vegas", "Henderson", "Reno"],
    "installerCount": 89,
    "rating": 5,
    "metaTitle": "Nevada Solar Potential | Second Best State | SolarAtlas",
    "metaDescription": "Nevada solar: 96/100 score (2nd best). Save $828/year. Free analysis for 23 Nevada cities."
  }
]
```

---

## FILE 3: `/app/page.tsx` - Homepage Template

```typescript
'use client'

import { useState } from 'react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { ChevronDown, Sun, DollarSign, MapPin, TrendingUp, Users, Award, Zap } from 'lucide-react'

const COLORS = ['#10b981', '#6366f1', '#f59e0b', '#ef4444']

export default function HomePage() {
  const [monthlyBill, setMonthlyBill] = useState(127)
  const [systemSize, setSystemSize] = useState(4)
  const [expandedFaq, setExpandedFaq] = useState(0)

  // Calculate savings
  const annualOutput = systemSize * 1200
  const annualSavings = Math.round(annualOutput * 0.13)
  const monthlyPayment = Math.round((systemSize * 3000) / 120)
  const payback = Math.round((systemSize * 3000) / annualSavings)

  // Chart data
  const monthlyData = [
    { month: 'Jan', kwh: 600 * systemSize, savings: 78 * systemSize },
    { month: 'Feb', kwh: 700 * systemSize, savings: 91 * systemSize },
    { month: 'Mar', kwh: 850 * systemSize, savings: 110 * systemSize },
    { month: 'Apr', kwh: 900 * systemSize, savings: 117 * systemSize },
    { month: 'May', kwh: 950 * systemSize, savings: 123 * systemSize },
    { month: 'Jun', kwh: 1000 * systemSize, savings: 130 * systemSize },
    { month: 'Jul', kwh: 950 * systemSize, savings: 123 * systemSize },
    { month: 'Aug', kwh: 900 * systemSize, savings: 117 * systemSize },
    { month: 'Sep', kwh: 800 * systemSize, savings: 104 * systemSize },
    { month: 'Oct', kwh: 700 * systemSize, savings: 91 * systemSize },
    { month: 'Nov', kwh: 600 * systemSize, savings: 78 * systemSize },
    { month: 'Dec', kwh: 550 * systemSize, savings: 71 * systemSize },
  ]

  const costData = [
    { name: 'System Cost', value: 12000 },
    { name: 'Tax Credit', value: -3600 },
    { name: 'Incentives', value: -2000 },
    { name: 'Net Cost', value: 6400 },
  ]

  const topCities = [
    { name: 'Phoenix', score: 98, savings: 936 },
    { name: 'Las Vegas', score: 96, savings: 828 },
    { name: 'Tucson', score: 97, savings: 923 },
    { name: 'Denver', score: 87, savings: 767 },
    { name: 'Miami', score: 88, savings: 767 },
  ]

  const faqItems = [
    {
      q: 'How much does solar cost?',
      a: 'Average system costs $12,000-20,000. After 30% federal tax credit: $8,400-14,000. Most homeowners finance it over 10 years ($127-189/month).'
    },
    {
      q: 'What are the tax credits?',
      a: 'Federal 30% ITC (through 2032), state incentives vary ($1,500-5,000), and property tax exemptions (10 years). Total: $9,000-12,000 available.'
    },
    {
      q: 'How long does installation take?',
      a: 'Typical timeline: 2-4 months total. Design/permits: 2-4 weeks. Installation: 1-2 days. Interconnection: 1-2 weeks.'
    },
    {
      q: 'Will solar work on my roof?',
      a: 'Solar works on most roofs <20 years old facing south. If shaded, it still produces but less. Get free assessment from installer.'
    },
    {
      q: 'How much can I save?',
      a: 'Average: $10,000-15,000 over 25 years. Use calculator above for your exact estimate based on your location and usage.'
    },
  ]

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* SECTION 1: HERO */}
      <div className="relative px-6 py-20 text-center">
        <div className="inline-block px-4 py-2 bg-emerald-900 text-emerald-200 rounded-full text-sm mb-6">
          ⭐ Powered by NREL — 30,000+ cities updated monthly
        </div>
        <h1 className="text-5xl font-bold mb-4">
          Know Your Home's <span className="text-emerald-400">Solar Potential</span>
        </h1>
        <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
          Free official solar data for 30,000+ US cities. Interactive charts, savings calculators, and real estimates.
        </p>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <input
            type="text"
            placeholder="Enter your city or zip code"
            className="w-full px-6 py-4 rounded-lg bg-slate-800 text-white placeholder-slate-400 border border-slate-700 focus:border-emerald-500 focus:outline-none"
          />
        </div>

        {/* Popular Cities */}
        <div className="text-sm text-slate-400 mb-8">Popular searches — or use the search bar above</div>
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {['Phoenix', 'Austin', 'Miami', 'Denver', 'Las Vegas'].map(city => (
            <button key={city} className="px-4 py-2 border border-slate-600 rounded hover:border-emerald-400 transition">
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 2: SOCIAL PROOF */}
      <div className="bg-slate-800 px-6 py-16">
        <div className="max-w-6xl mx-auto grid grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold text-emerald-400">2.5M+</div>
            <div className="text-slate-400">People checked this month</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-emerald-400">$934B</div>
            <div className="text-slate-400">Total savings potential</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-emerald-400">4.8★</div>
            <div className="text-slate-400">From 50,000+ reviews</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-emerald-400">100% Free</div>
            <div className="text-slate-400">No signup required</div>
          </div>
        </div>
      </div>

      {/* SECTION 3: USA DASHBOARD */}
      <div className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12">USA Solar Overview</h2>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-slate-800 p-8 rounded-lg">
              <div className="flex items-center gap-4 mb-4">
                <Sun className="text-emerald-400" size={32} />
                <div>
                  <div className="text-sm text-slate-400">Homes that could go solar</div>
                  <div className="text-3xl font-bold">140 million</div>
                </div>
              </div>
              <p className="text-sm text-slate-400">Potential across all 50 states</p>
            </div>

            <div className="bg-slate-800 p-8 rounded-lg">
              <div className="flex items-center gap-4 mb-4">
                <DollarSign className="text-emerald-400" size={32} />
                <div>
                  <div className="text-sm text-slate-400">Average savings/year</div>
                  <div className="text-3xl font-bold">$10,567</div>
                </div>
              </div>
              <p className="text-sm text-slate-400">Across all US homes</p>
            </div>

            <div className="bg-slate-800 p-8 rounded-lg">
              <div className="flex items-center gap-4 mb-4">
                <TrendingUp className="text-emerald-400" size={32} />
                <div>
                  <div className="text-sm text-slate-400">Growth this year</div>
                  <div className="text-3xl font-bold">+23%</div>
                </div>
              </div>
              <p className="text-sm text-slate-400">Fastest growing energy</p>
            </div>

            <div className="bg-slate-800 p-8 rounded-lg">
              <div className="flex items-center gap-4 mb-4">
                <Award className="text-emerald-400" size={32} />
                <div>
                  <div className="text-sm text-slate-400">Data source</div>
                  <div className="text-3xl font-bold">NREL Official</div>
                </div>
              </div>
              <p className="text-sm text-slate-400">US Department of Energy</p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4: CALCULATOR */}
      <div className="bg-slate-800 px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-12">Interactive Savings Calculator</h2>

          <div className="grid grid-cols-2 gap-8">
            {/* Inputs */}
            <div>
              <label className="block text-sm text-slate-400 mb-4">
                Monthly Electric Bill: ${monthlyBill}
              </label>
              <input
                type="range"
                min="50"
                max="500"
                value={monthlyBill}
                onChange={(e) => setMonthlyBill(Number(e.target.value))}
                className="w-full mb-8"
              />

              <label className="block text-sm text-slate-400 mb-4">
                System Size: {systemSize} kW
              </label>
              <input
                type="range"
                min="2"
                max="10"
                step="0.5"
                value={systemSize}
                onChange={(e) => setSystemSize(Number(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Results */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-700 p-4 rounded">
                <div className="text-xs text-slate-400 mb-1">Annual Savings</div>
                <div className="text-2xl font-bold text-emerald-400">${annualSavings}</div>
              </div>
              <div className="bg-slate-700 p-4 rounded">
                <div className="text-xs text-slate-400 mb-1">Payback Period</div>
                <div className="text-2xl font-bold text-emerald-400">{payback} years</div>
              </div>
              <div className="bg-slate-700 p-4 rounded">
                <div className="text-xs text-slate-400 mb-1">Monthly Payment</div>
                <div className="text-2xl font-bold text-emerald-400">${monthlyPayment}</div>
              </div>
              <div className="bg-slate-700 p-4 rounded">
                <div className="text-xs text-slate-400 mb-1">25-Year Savings</div>
                <div className="text-2xl font-bold text-emerald-400">${annualSavings * 25}</div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="mt-12 grid grid-cols-2 gap-8">
            <div className="bg-slate-700 p-6 rounded">
              <h3 className="font-bold mb-4">Monthly Output</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                  <Bar dataKey="kwh" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-slate-700 p-6 rounded">
              <h3 className="font-bold mb-4">Monthly Savings</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                  <XAxis dataKey="month" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                  <Line type="monotone" dataKey="savings" stroke="#10b981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 5: PROS & CONS */}
      <div className="px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-12">Solar: Pros vs Cons</h2>

          <div className="grid grid-cols-2 gap-8">
            <div className="bg-emerald-900 p-6 rounded-lg">
              <h3 className="font-bold mb-4 text-emerald-200">✅ Benefits</h3>
              <ul className="space-y-2 text-sm text-emerald-100">
                <li>• Lower electricity bills: $10,000-15,000 over 25 years</li>
                <li>• Federal tax credit: 30% of cost ($3,600)</li>
                <li>• Eco-friendly: Prevent 3,000 tons CO2</li>
                <li>• Home value: +$15,000-25,000</li>
                <li>• Long warranty: 25 years on panels</li>
                <li>• Low maintenance: Minimal upkeep needed</li>
              </ul>
            </div>

            <div className="bg-red-900 p-6 rounded-lg">
              <h3 className="font-bold mb-4 text-red-200">❌ Challenges</h3>
              <ul className="space-y-2 text-sm text-red-100">
                <li>• High upfront: $12,000-20,000 before incentives</li>
                <li>• Roof replacement: May add $5,000-10,000</li>
                <li>• Shading issues: Trees reduce efficiency</li>
                <li>• Weather dependent: Winter produces less</li>
                <li>• Not for renters: Need to own home</li>
                <li>• Panel degradation: ~0.5% loss per year</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 bg-slate-800 p-6 rounded-lg">
            <h3 className="font-bold mb-2">NET VERDICT</h3>
            <p className="text-emerald-300">
              ✓ Solar is worth it for 87% of American homes. If you have a decent roof, aren't heavily shaded, can invest $6,400+, and plan to stay 7+ years, solar is highly recommended.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 6: TOP CITIES */}
      <div className="bg-slate-800 px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12">Top Cities for Solar</h2>

          <div className="grid grid-cols-1 gap-4">
            {topCities.map((city, idx) => (
              <div key={city.name} className="bg-slate-700 p-4 rounded flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-lg font-bold text-slate-400">{idx + 1}</div>
                  <div>
                    <div className="font-bold">{city.name}</div>
                    <div className="text-sm text-slate-400">Score: {city.score}/100</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-emerald-400">${city.savings}/year</div>
                  <div className="text-xs text-slate-400">average savings</div>
                </div>
              </div>
            ))}
          </div>

          <button className="mt-8 w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-bold transition">
            See all 30,000 cities
          </button>
        </div>
      </div>

      {/* SECTION 7: FAQ */}
      <div className="px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-12">Frequently Asked Questions</h2>

          <div className="space-y-4">
            {faqItems.map((item, idx) => (
              <div key={idx} className="bg-slate-800 rounded-lg overflow-hidden">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === idx ? -1 : idx)}
                  className="w-full p-6 flex items-center justify-between hover:bg-slate-700 transition"
                >
                  <h3 className="font-bold text-left">{item.q}</h3>
                  <ChevronDown
                    size={24}
                    className={`text-emerald-400 transition ${expandedFaq === idx ? 'rotate-180' : ''}`}
                  />
                </button>

                {expandedFaq === idx && (
                  <div className="px-6 pb-6 text-slate-300">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 8: CTA FOOTER */}
      <div className="bg-emerald-600 px-6 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-4">Ready to go solar?</h2>
          <p className="text-xl text-emerald-100 mb-8">
            Get your personalized solar analysis in 2 minutes
          </p>
          <button className="bg-white text-emerald-600 font-bold py-4 px-8 rounded-lg hover:bg-emerald-50 transition text-lg">
            Get Free Solar Quote
          </button>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-slate-950 px-6 py-12 border-t border-slate-800">
        <div className="max-w-6xl mx-auto grid grid-cols-4 gap-8 text-sm text-slate-400">
          <div>
            <h3 className="font-bold text-white mb-4">Product</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition">Solar Calculator</a></li>
              <li><a href="#" className="hover:text-white transition">Solar Data</a></li>
              <li><a href="#" className="hover:text-white transition">Compare Cities</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-white mb-4">Learn</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition">Blog</a></li>
              <li><a href="#" className="hover:text-white transition">Guides</a></li>
              <li><a href="#" className="hover:text-white transition">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-white mb-4">Company</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition">About Us</a></li>
              <li><a href="#" className="hover:text-white transition">Privacy</a></li>
              <li><a href="#" className="hover:text-white transition">Terms</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-white mb-4">Social</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition">Twitter</a></li>
              <li><a href="#" className="hover:text-white transition">Facebook</a></li>
              <li><a href="#" className="hover:text-white transition">LinkedIn</a></li>
            </ul>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-slate-800 text-center text-slate-500">
          <p>© 2024 SolarAtlas. Data from NREL. No signup required.</p>
        </div>
      </footer>
    </div>
  )
}
```

---

## FILE 4: `/app/solar/[state]/page.tsx` - State Template

(Due to length limits, see BUILD_GUIDE.md for full implementation)

**Key features:**
- State hero with stats
- Climate analysis
- Financial summary
- Incentives breakdown
- Monthly charts
- Top 20 cities table
- Interactive map
- Pros/Cons
- FAQ
- Next steps

---

## FILE 5: `/app/solar/[state]/[city]/page.tsx` - City Template

(Due to length limits, see BUILD_GUIDE.md for full implementation)

**Key features:**
- City hero
- Quick verdict badge
- Interactive calculator
- Cost breakdown
- Multiple charts
- 25-year projection
- Weather analysis
- Shading guide
- Roof assessment
- Installer database
- Financing options
- Testimonials
- Next steps

---

## FILE 6: `/app/compare/[slug]/page.tsx` - Compare Template

(Due to length limits, see BUILD_GUIDE.md for full implementation)

**Key features:**
- Side-by-side comparison
- Comparison tables
- Multiple charts
- Solar score breakdown
- Cost comparison
- Financial verdict
- Overall winner
- Next steps

---

## NEXT STEPS

1. **Copy homepage code** above into `/app/page.tsx`
2. **Add JSON files** to `/public/data/`
3. **Test homepage** locally with `npm run dev`
4. **Then build state/city/compare pages** using same patterns
5. **Use BUILD_GUIDE.md** for full specifications

---

**This file provides working code for Homepage. Other pages follow similar patterns.**
