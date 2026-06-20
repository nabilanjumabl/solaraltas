'use client'

import { useState } from 'react'
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import {
  Sun, DollarSign, Zap, MapPin, ChevronDown, TrendingUp, Award,
  Shield, Battery, Home, Cloud, Thermometer, Droplets, CheckCircle2, XCircle,
} from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────────────

interface NearbyCity {
  name: string
  slug: string
  stateSlug: string
  solarScore: number
  annualSavings: number
}

interface CityData {
  id: number
  name: string
  slug: string
  state: string
  stateSlug: string
  stateAbbr: string
  solarScore: number
  peakSunHours: number
  annualKwhPerKw: number
  avgElectricRate: number
  annualSavings: number
  paybackYears: number
  savings25Year: number
  systemCost4kw: number
  federalTaxCredit: number
  stateIncentives: number
  netCost: number
  monthlyKwh: number[]
  monthlySunHours: number[]
  cloudyDaysPerYear: number
  rainyDaysPerYear: number
  installerCount: number
  climateType: string
  avgTemperature: number
  humidity: number
  nearByCities: NearbyCity[]
  topInstallers: string[]
  metaTitle: string
  metaDescription: string
  localInsight?: string
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// ─── Score verdict helper ─────────────────────────────────────────────────────

function getVerdict(score: number) {
  if (score >= 90) return { label: 'Excellent', color: 'emerald', emoji: '🌟', desc: 'Among the best solar cities in the US. Go solar now.' }
  if (score >= 75) return { label: 'Good', color: 'yellow', emoji: '☀️', desc: 'Above average solar potential. ROI is solid.' }
  return { label: 'Moderate', color: 'orange', emoji: '⛅', desc: 'Solar can still pay off, but shop carefully.' }
}

// ─── FAQ helper ──────────────────────────────────────────────────────────────

function FAQItem({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) {
  return (
    <div className="border border-slate-700 rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-slate-800 transition"
      >
        <span className="font-semibold pr-4 text-sm">{q}</span>
        <ChevronDown size={16} className={`text-emerald-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="px-6 pb-5 text-slate-300 text-sm leading-relaxed">{a}</div>}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function CityPageClient({ city }: { city: CityData }) {
  const verdict = getVerdict(city.solarScore)

  // Calculator state
  const [systemKw, setSystemKw] = useState(4)
  const [monthlyBill, setMonthlyBill] = useState(150)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  // Dynamic calculations
  const calcAnnualOutput = Math.round(systemKw * city.annualKwhPerKw)
  const calcAnnualSavings = Math.round(calcAnnualOutput * city.avgElectricRate)
  const calcSystemCost = Math.round(systemKw * 3000)
  const calcAfterCredit = Math.round(calcSystemCost * 0.7 - city.stateIncentives)
  const calcPayback = calcAnnualSavings > 0 ? (calcAfterCredit / calcAnnualSavings).toFixed(1) : '—'
  const calcMonthlyPayment = Math.round(calcAfterCredit / 120)

  // Chart data — scaled from the city's real 4kW baseline to the selected system size
  const scaleFactor = systemKw / 4
  const monthlyChartData = MONTHS.map((m, i) => ({
    month: m,
    kWh: Math.round(city.monthlyKwh[i] * scaleFactor),
    sunHours: city.monthlySunHours[i],
    savings: Math.round(city.monthlyKwh[i] * scaleFactor * city.avgElectricRate),
  }))

  const projectionData = [0, 5, 10, 15, 20, 25].map(yr => ({
    year: yr === 0 ? 'Now' : `Yr ${yr}`,
    cumSavings: yr === 0 ? 0 : Math.round(calcAnnualSavings * yr * (1 + yr * 0.025)),
    withoutSolar: yr === 0 ? 0 : Math.round(monthlyBill * 12 * yr * (1 + yr * 0.03)),
  }))

  const costBreakdown = [
    { label: 'Gross system cost', value: calcSystemCost, type: 'cost' },
    { label: 'Federal tax credit (30%)', value: -Math.round(calcSystemCost * 0.3), type: 'credit' },
    { label: `${city.state} state incentives`, value: -city.stateIncentives, type: 'credit' },
    { label: 'Your net investment', value: calcAfterCredit, type: 'total' },
  ]

  const faqItems = [
    {
      q: `Is solar worth it in ${city.name}?`,
      a: `Yes — ${city.name} scores ${city.solarScore}/100 with ${city.peakSunHours} peak sun hours/day. At $0.${Math.round(city.avgElectricRate * 100)} per kWh and $${city.annualSavings}/year average savings, most homeowners break even in ${city.paybackYears} years.`,
    },
    {
      q: `How much does a solar system cost in ${city.name}?`,
      a: `A 4 kW system in ${city.name} costs ~$12,000 gross. After the 30% federal tax credit ($3,600) and $${city.stateIncentives.toLocaleString()} in ${city.state} incentives, your net cost is ~$${city.netCost.toLocaleString()}.`,
    },
    {
      q: `What's the payback period in ${city.name}?`,
      a: `Based on current electricity rates ($0.${Math.round(city.avgElectricRate * 100)}/kWh) and ${city.peakSunHours} sun hours, a standard 4 kW system pays back in ${city.paybackYears} years. Adjust the calculator above for your exact situation.`,
    },
    {
      q: `Who are the top solar installers in ${city.name}?`,
      a: `${city.topInstallers.join(', ')} all operate in ${city.name}. We recommend getting 3+ quotes — local installers often beat national brands on price by 10–20%.`,
    },
    {
      q: `Does ${city.name} have good net metering?`,
      a: `${city.state} has a rated net metering policy. Excess energy you export earns retail-rate credits on your bill, directly reducing your payback period.`,
    },
    {
      q: `What system size do most ${city.name} homeowners install?`,
      a: `Most ${city.name} homeowners with average usage install 5–7 kW. At ${city.peakSunHours} sun hours, a 6 kW system produces ~${Math.round(city.peakSunHours * 6 * 365).toLocaleString()} kWh/year — enough for most homes.`,
    },
  ]

  return (
    <div className="min-h-screen bg-slate-900 text-white">

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section className="relative px-6 py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950">
        <div className="max-w-6xl mx-auto">

          {/* Breadcrumb */}
          <div className="text-sm text-slate-400 mb-8">
            <a href="/" className="hover:text-white transition">SolarAtlas</a>
            <span className="mx-2">/</span>
            <a href={`/solar/${city.stateSlug}`} className="hover:text-white transition">{city.state}</a>
            <span className="mx-2">/</span>
            <span className="text-white">{city.name}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10">
            <div className="flex-1">
              <h1 className="text-5xl font-black mb-3">
                Solar Potential in<br />
                <span className="text-emerald-400">{city.name}, {city.stateAbbr}</span>
              </h1>
              <p className="text-lg text-slate-300 mb-6">
                {city.climateType} climate · {city.peakSunHours} peak sun hours/day ·
                {' '}{city.installerCount} certified installers nearby
              </p>
              {city.localInsight && (
                <p className="text-slate-400 text-sm mb-6 max-w-2xl leading-relaxed border-l-2 border-emerald-700 pl-4">
                  {city.localInsight}
                </p>
              )}
              <div className="flex flex-wrap gap-3">
                <a href="#calculator" className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-bold transition">
                  Calculate My Savings
                </a>
                <a href="#installers" className="px-6 py-3 border border-slate-600 hover:border-emerald-400 rounded-lg transition">
                  Get Installer Quotes
                </a>
              </div>
            </div>

            {/* Score badge + quick stats */}
            <div className="flex flex-col items-center gap-4">
              <div className={`flex flex-col items-center justify-center w-28 h-28 rounded-2xl border-2 ${
                city.solarScore >= 90 ? 'bg-emerald-900/60 border-emerald-700' : 'bg-yellow-900/60 border-yellow-700'
              }`}>
                <span className={`text-4xl font-black ${city.solarScore >= 90 ? 'text-emerald-400' : 'text-yellow-400'}`}>
                  {city.solarScore}
                </span>
                <span className="text-xs text-slate-400 mt-0.5">/ 100</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Annual savings', value: `$${city.annualSavings.toLocaleString()}` },
                  { label: 'Payback period', value: `${city.paybackYears} yrs` },
                  { label: '25-yr savings', value: `$${(city.savings25Year / 1000).toFixed(0)}k` },
                  { label: 'Net cost', value: `$${city.netCost.toLocaleString()}` },
                ].map(stat => (
                  <div key={stat.label} className="bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-center">
                    <div className="text-lg font-bold text-emerald-400">{stat.value}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── QUICK VERDICT ────────────────────────────────────────────────────── */}
      <section className="px-6 py-8 bg-slate-800 border-b border-slate-700">
        <div className="max-w-6xl mx-auto">
          <div className={`flex items-center gap-4 p-5 rounded-xl border ${
            verdict.color === 'emerald' ? 'bg-emerald-950/60 border-emerald-800' :
            verdict.color === 'yellow' ? 'bg-yellow-950/60 border-yellow-800' :
            'bg-orange-950/60 border-orange-800'
          }`}>
            <span className="text-3xl">{verdict.emoji}</span>
            <div>
              <span className={`font-bold text-lg ${
                verdict.color === 'emerald' ? 'text-emerald-400' :
                verdict.color === 'yellow' ? 'text-yellow-400' : 'text-orange-400'
              }`}>{verdict.label} Solar City</span>
              <p className="text-slate-300 text-sm mt-0.5">{verdict.desc} Score: {city.solarScore}/100 · Ranked in top {city.solarScore >= 90 ? '5%' : '20%'} of US cities.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── INTERACTIVE CALCULATOR ───────────────────────────────────────────── */}
      <section id="calculator" className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-2">Savings Calculator</h2>
          <p className="text-slate-400 text-sm mb-8">Adjust sliders to see how a solar system matches your usage.</p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Controls */}
            <div className="bg-slate-800 rounded-2xl p-6 space-y-8">
              <div>
                <div className="flex justify-between text-sm mb-3">
                  <span className="text-slate-400">System size</span>
                  <span className="font-bold text-emerald-400">{systemKw} kW</span>
                </div>
                <input type="range" min={2} max={12} step={0.5} value={systemKw}
                  onChange={e => setSystemKw(Number(e.target.value))}
                  className="w-full accent-emerald-500" />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>2 kW (small)</span><span>12 kW (large)</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-3">
                  <span className="text-slate-400">Monthly electricity bill</span>
                  <span className="font-bold text-emerald-400">${monthlyBill}</span>
                </div>
                <input type="range" min={50} max={600} step={10} value={monthlyBill}
                  onChange={e => setMonthlyBill(Number(e.target.value))}
                  className="w-full accent-emerald-500" />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>$50</span><span>$600</span>
                </div>
              </div>

              {/* Results grid */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Annual savings', value: `$${calcAnnualSavings.toLocaleString()}` },
                  { label: 'Payback period', value: `${calcPayback} yrs` },
                  { label: 'Monthly payment', value: `$${calcMonthlyPayment}/mo` },
                  { label: '25-yr savings', value: `$${(calcAnnualSavings * 25).toLocaleString()}` },
                ].map(r => (
                  <div key={r.label} className="bg-slate-700 rounded-xl p-4">
                    <div className="text-xs text-slate-400 mb-1">{r.label}</div>
                    <div className="text-xl font-bold text-emerald-400">{r.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Monthly savings chart */}
            <div className="bg-slate-800 rounded-2xl p-6">
              <h3 className="text-sm text-slate-400 uppercase tracking-wider mb-4">Monthly kWh Output</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={monthlyChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                    formatter={(v: any, n: any) => [n === 'kWh' ? `${v} kWh` : `$${v}`, n]}
                  />
                  <Bar dataKey="kWh" fill="#10b981" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>

              <div className="mt-4 bg-slate-700 rounded-xl p-4 flex justify-between text-sm">
                <div>
                  <div className="text-slate-400 text-xs mb-1">Annual kWh output</div>
                  <div className="font-bold">{calcAnnualOutput.toLocaleString()} kWh</div>
                </div>
                <div className="text-right">
                  <div className="text-slate-400 text-xs mb-1">At $0.{Math.round(city.avgElectricRate * 100)}/kWh</div>
                  <div className="font-bold text-emerald-400">${calcAnnualSavings.toLocaleString()} saved</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── COST BREAKDOWN ───────────────────────────────────────────────────── */}
      <section className="px-6 py-16 bg-slate-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-8">Cost Breakdown</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-slate-700 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-600 font-semibold text-sm">
                {systemKw} kW System · {city.name}, {city.stateAbbr}
              </div>
              <table className="w-full">
                <tbody>
                  {costBreakdown.map(row => (
                    <tr key={row.label} className={`border-b border-slate-600/50 last:border-0 ${row.type === 'total' ? 'bg-slate-600/40' : ''}`}>
                      <td className="px-6 py-4 text-sm text-slate-300">{row.label}</td>
                      <td className={`px-6 py-4 text-right font-bold ${
                        row.type === 'credit' ? 'text-emerald-400' :
                        row.type === 'total' ? 'text-white text-lg' : 'text-slate-200'
                      }`}>
                        {row.value < 0 ? `-$${Math.abs(row.value).toLocaleString()}` : `$${row.value.toLocaleString()}`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 25-year projection chart */}
            <div className="bg-slate-700 rounded-2xl p-6">
              <h3 className="text-sm text-slate-400 uppercase tracking-wider mb-4">25-Year: Solar vs No Solar</h3>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={projectionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                  <XAxis dataKey="year" stroke="#64748b" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 10 }} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                    formatter={(v: any, n: any) => [`$${v.toLocaleString()}`, n === 'cumSavings' ? 'With solar' : 'Without solar']}
                  />
                  <Area type="monotone" dataKey="withoutSolar" stroke="#ef4444" fill="#ef444420" strokeWidth={2} />
                  <Area type="monotone" dataKey="cumSavings" stroke="#10b981" fill="#10b98120" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
              <div className="mt-3 text-xs text-slate-400 text-center">
                Red = cumulative electric bills paid · Green = cumulative savings with solar
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MONTHLY SUN HOURS ────────────────────────────────────────────────── */}
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-8">Monthly Solar Data — {city.name}</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-slate-800 p-6 rounded-2xl">
              <h3 className="text-sm text-slate-400 uppercase tracking-wider mb-4">Sun Hours by Month</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={monthlyChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 10 }} domain={[0, 10]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                    formatter={(v: any) => [`${v} hrs`, 'Sun hours']}
                  />
                  <Bar dataKey="sunHours" fill="#fbbf24" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-slate-800 p-6 rounded-2xl">
              <h3 className="text-sm text-slate-400 uppercase tracking-wider mb-4">Monthly Savings Estimate</h3>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={monthlyChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 10 }} tickFormatter={v => `$${v}`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                    formatter={(v: any) => [`$${v}`, 'Savings']}
                  />
                  <Line type="monotone" dataKey="savings" stroke="#10b981" strokeWidth={2} dot={{ r: 3, fill: '#10b981' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      {/* ── WEATHER ANALYSIS ─────────────────────────────────────────────────── */}
      <section className="px-6 py-16 bg-slate-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-8">Weather & Climate Analysis</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { icon: <Sun size={22} />, label: 'Climate type', value: city.climateType },
              { icon: <Thermometer size={22} />, label: 'Avg temperature', value: `${city.avgTemperature}°F` },
              { icon: <Cloud size={22} />, label: 'Cloudy days/yr', value: `${city.cloudyDaysPerYear}` },
              { icon: <Droplets size={22} />, label: 'Humidity', value: `${city.humidity}%` },
            ].map(item => (
              <div key={item.label} className="bg-slate-700 p-5 rounded-xl flex items-start gap-3">
                <div className="text-emerald-400 mt-0.5">{item.icon}</div>
                <div>
                  <div className="text-xs text-slate-400 mb-1">{item.label}</div>
                  <div className="font-bold">{item.value}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 bg-slate-700 rounded-xl p-5 text-sm text-slate-300">
            <strong className="text-white">{city.name} weather impact:</strong>{' '}
            With {365 - city.cloudyDaysPerYear} sunny days per year and only {city.cloudyDaysPerYear} overcast days,
            solar panels in {city.name} operate at near-peak efficiency for most of the year.
            {city.humidity < 30
              ? ` Low humidity (${city.humidity}%) means panels stay cleaner for longer.`
              : ` Moderate humidity (${city.humidity}%) may require occasional panel cleaning.`}
          </div>
        </div>
      </section>

      {/* ── SHADING & ROOF ───────────────────────────────────────────────────── */}
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-8">Shading & Roof Assessment</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-800 rounded-2xl p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Home size={18} className="text-emerald-400" /> Roof Condition Guide
              </h3>
              <ul className="space-y-3 text-sm">
                {[
                  { condition: 'Roof <10 years old', status: 'green', note: 'Ideal — install solar now' },
                  { condition: 'Roof 10–15 years old', status: 'yellow', note: 'Fine — may last 10+ more years' },
                  { condition: 'Roof 15–20 years old', status: 'orange', note: 'Consider replacing roof first' },
                  { condition: 'Roof >20 years old', status: 'red', note: 'Replace roof before solar install' },
                ].map(item => (
                  <li key={item.condition} className="flex items-center gap-3">
                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                      item.status === 'green' ? 'bg-emerald-400' :
                      item.status === 'yellow' ? 'bg-yellow-400' :
                      item.status === 'orange' ? 'bg-orange-400' : 'bg-red-400'
                    }`} />
                    <span className="flex-1 text-slate-300">{item.condition}</span>
                    <span className="text-slate-400 text-xs">{item.note}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-800 rounded-2xl p-6">
              <h3 className="font-semibold mb-4">Shading Sources in {city.name}</h3>
              <ul className="space-y-3 text-sm">
                {[
                  { source: 'Nearby trees', impact: 'Low–Medium', note: 'Trim or add microinverters to offset' },
                  { source: 'Neighboring buildings', impact: 'Low', note: `${city.name} has relatively low building density` },
                  { source: 'Roof obstructions', impact: 'Variable', note: 'Chimneys, vents can cause partial shading' },
                  { source: 'Seasonal sun angle', impact: 'Low', note: `${city.avgTemperature > 70 ? 'High sun angle year-round' : 'Winter angle reduces output ~15%'}` },
                ].map(item => (
                  <li key={item.source} className="flex flex-col gap-0.5 pb-3 border-b border-slate-700 last:border-0 last:pb-0">
                    <div className="flex justify-between">
                      <span className="font-medium">{item.source}</span>
                      <span className="text-xs text-slate-400">{item.impact} impact</span>
                    </div>
                    <span className="text-slate-400 text-xs">{item.note}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── TOP INSTALLERS ───────────────────────────────────────────────────── */}
      <section id="installers" className="px-6 py-16 bg-slate-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-2">Top Solar Installers in {city.name}</h2>
          <p className="text-slate-400 text-sm mb-8">{city.installerCount} licensed installers active in {city.name}, {city.stateAbbr}. Always compare at least 3 quotes.</p>

          <div className="space-y-3">
            {city.topInstallers.map((name, i) => (
              <div key={name} className="flex items-center gap-5 bg-slate-700 rounded-xl p-5">
                <div className="text-xl font-black text-slate-500 w-7 shrink-0">#{i + 1}</div>
                <div className="flex-1">
                  <div className="font-bold">{name}</div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {i === 0 ? 'Largest US installer · 25-yr warranty' :
                     i === 1 ? 'Premium panels · Highest efficiency' :
                     i === 2 ? 'Tesla Powerwall bundles available' :
                     'Local pricing · Fast installation'}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-emerald-400">
                    {['⭐⭐⭐⭐⭐', '⭐⭐⭐⭐⭐', '⭐⭐⭐⭐½', '⭐⭐⭐⭐', '⭐⭐⭐⭐'][i]}
                  </div>
                  <div className="text-xs text-slate-400">customer rating</div>
                </div>
                <button className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 rounded-lg text-sm font-semibold transition">
                  Get Quote
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINANCING OPTIONS ────────────────────────────────────────────────── */}
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-8">Financing Options in {city.name}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                type: 'Cash Purchase',
                pro: 'Best ROI — no interest, max savings',
                con: 'Requires upfront $' + city.netCost.toLocaleString(),
                ideal: 'Homeowners with available capital',
                badge: '🏆 Best ROI',
              },
              {
                type: 'Solar Loan',
                pro: '$0 down, own the system & credits',
                con: 'Pay interest (~6–8% APR)',
                ideal: 'Most homeowners — ~$' + Math.round(city.netCost / 120) + '/mo',
                badge: '📈 Most Popular',
              },
              {
                type: 'Solar Lease',
                pro: '$0 down, no maintenance responsibility',
                con: 'Don\'t own system or tax credits',
                ideal: 'Low-risk option for fixed savings',
                badge: '✅ Low Risk',
              },
              {
                type: 'PPA',
                pro: 'Pay per kWh — no system cost',
                con: 'Long-term contract (20–25 yrs)',
                ideal: 'Immediate savings, zero upfront',
                badge: '💡 Zero Cost',
              },
            ].map(opt => (
              <div key={opt.type} className="bg-slate-800 rounded-2xl p-5 flex flex-col gap-3">
                <div className="text-xs font-bold text-emerald-400 bg-emerald-900/40 rounded-full px-3 py-1 self-start">
                  {opt.badge}
                </div>
                <div className="font-bold text-base">{opt.type}</div>
                <div className="flex items-start gap-2 text-sm">
                  <CheckCircle2 size={14} className="text-emerald-400 mt-0.5 shrink-0" />
                  <span className="text-slate-300">{opt.pro}</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <XCircle size={14} className="text-red-400 mt-0.5 shrink-0" />
                  <span className="text-slate-300">{opt.con}</span>
                </div>
                <div className="text-xs text-slate-400 mt-auto pt-3 border-t border-slate-700">{opt.ideal}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROS & CONS ──────────────────────────────────────────────────────── */}
      <section className="px-6 py-16 bg-slate-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-8">Solar in {city.name}: Pros & Cons</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-emerald-950 border border-emerald-800 rounded-2xl p-6">
              <h3 className="text-emerald-400 font-bold mb-4">✅ Why {city.name} is great for solar</h3>
              <ul className="space-y-3 text-sm">
                {[
                  `${city.solarScore}/100 solar score — top ${city.solarScore >= 90 ? '5%' : '20%'} in the US`,
                  `${city.peakSunHours} peak sun hours/day — ${city.peakSunHours >= 6 ? 'exceptional' : 'good'} energy production`,
                  `$${city.annualSavings.toLocaleString()} average annual savings`,
                  `${city.installerCount} certified installers = competitive pricing`,
                  `Federal 30% tax credit saves $${city.federalTaxCredit.toLocaleString()} on a $12k system`,
                  `$${city.stateIncentives.toLocaleString()} in ${city.state} state incentives available`,
                ].map(pro => (
                  <li key={pro} className="flex items-start gap-2 text-emerald-100">
                    <span className="text-emerald-400 shrink-0">•</span>{pro}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-red-950 border border-red-800 rounded-2xl p-6">
              <h3 className="text-red-400 font-bold mb-4">⚠️ Things to consider</h3>
              <ul className="space-y-3 text-sm">
                {[
                  `Net cost of $${city.netCost.toLocaleString()} requires upfront or financed investment`,
                  `${city.paybackYears}-year payback requires long-term ownership plan`,
                  city.humidity > 50 ? `Higher humidity (${city.humidity}%) means more frequent cleaning` : `Desert dust can reduce output 5–10% without cleaning`,
                  `Panel degradation ~0.5%/year reduces output over time`,
                  `HOA rules may restrict installation (check your HOA bylaws)`,
                  `Roof replacement within 5 years would require panel removal ($1,000–2,000)`,
                ].map(con => (
                  <li key={con} className="flex items-start gap-2 text-red-100">
                    <span className="text-red-400 shrink-0">•</span>{con}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── NEARBY CITIES ────────────────────────────────────────────────────── */}
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Compare with Nearby Cities</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {city.nearByCities.map(nearCity => (
              <a
                key={`${nearCity.stateSlug}-${nearCity.slug}`}
                href={`/solar/${nearCity.stateSlug}/${nearCity.slug}`}
                className="bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-emerald-600 rounded-xl p-4 text-center transition group"
              >
                <div className="font-semibold group-hover:text-emerald-400 transition text-sm">{nearCity.name}</div>
                <div className="text-emerald-400 text-xl font-bold mt-1">{nearCity.solarScore}</div>
                <div className="text-xs text-slate-400">score · ${nearCity.annualSavings}/yr</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────────── */}
      <section className="px-6 py-16 bg-slate-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-8">{city.name} Solar FAQ</h2>
          <div className="space-y-3">
            {faqItems.map((item, i) => (
              <FAQItem
                key={i} q={item.q} a={item.a}
                open={openFaq === i}
                onToggle={() => setOpenFaq(openFaq === i ? null : i)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── ENVIRONMENTAL IMPACT ─────────────────────────────────────────────── */}
      <section className="px-6 py-10 bg-emerald-950 border-y border-emerald-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-bold mb-6 text-emerald-300">Environmental Impact — Your {systemKw} kW System</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              { value: `${Math.round(calcAnnualOutput * 0.0007).toLocaleString()} tons`, label: 'CO₂ prevented/year' },
              { value: `${Math.round(calcAnnualOutput * 0.0007 * 25).toLocaleString()} tons`, label: 'CO₂ over 25 years' },
              { value: `${Math.round(calcAnnualOutput / 1200)} trees`, label: 'Equivalent trees planted' },
              { value: `${Math.round(calcAnnualOutput / 34000)} cars`, label: 'Cars off road equivalent' },
            ].map(stat => (
              <div key={stat.label}>
                <div className="text-2xl font-black text-emerald-400">{stat.value}</div>
                <div className="text-xs text-emerald-300/70 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEXT STEPS ───────────────────────────────────────────────────────── */}
      <section className="px-6 py-16 bg-slate-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-8">Your Next Steps</h2>
          <div className="space-y-4">
            {[
              { step: '1', title: 'Get 3+ installer quotes', desc: `Compare prices from ${city.installerCount} installers in ${city.name}. Quotes are free and no-obligation.` },
              { step: '2', title: 'Review your utility bill', desc: 'Gather 12 months of bills. Installers need your kWh usage to size the system correctly.' },
              { step: '3', title: 'Check your roof condition', desc: 'If your roof is >15 years old, get a roofing inspection before signing a solar contract.' },
              { step: '4', title: 'Apply for incentives', desc: `Federal 30% credit + $${city.stateIncentives.toLocaleString()} ${city.state} incentives. File with your tax return the year of installation.` },
            ].map(s => (
              <div key={s.step} className="flex items-start gap-5 bg-slate-700 rounded-xl p-5">
                <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-black flex items-center justify-center shrink-0">
                  {s.step}
                </div>
                <div>
                  <div className="font-semibold mb-1">{s.title}</div>
                  <div className="text-sm text-slate-300">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <section className="px-6 py-16 bg-emerald-600 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-black mb-3">Ready to go solar in {city.name}?</h2>
          <p className="text-emerald-100 mb-8">Get your personalized quote — free, no commitment, takes 2 minutes.</p>
          <button className="bg-white text-emerald-700 font-bold px-10 py-4 rounded-xl hover:bg-emerald-50 transition text-lg">
            Get Free Solar Quotes
          </button>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────────── */}
      <footer className="bg-slate-950 px-6 py-12 border-t border-slate-800">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-sm text-slate-400 mb-10">
          {[
            { title: 'Product', links: ['Solar Calculator', 'Solar Data', 'Compare Cities'] },
            { title: 'Learn', links: ['Blog', 'Guides', 'FAQ'] },
            { title: 'Company', links: ['About Us', 'Privacy', 'Terms'] },
            { title: 'Social', links: ['Twitter', 'Facebook', 'LinkedIn'] },
          ].map(col => (
            <div key={col.title}>
              <h3 className="font-bold text-white mb-3">{col.title}</h3>
              <ul className="space-y-2">
                {col.links.map(l => <li key={l}><a href="#" className="hover:text-white transition">{l}</a></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-6xl mx-auto pt-8 border-t border-slate-800 text-center text-slate-500 text-sm">
          © 2026 SolarAtlas · Data sourced from NREL · No signup required
        </div>
      </footer>
    </div>
  )
}
