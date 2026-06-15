// lib/data.ts
// Utility functions for loading and computing solar data

import citiesJson from '@/public/data/cities.json'
import statesJson from '@/public/data/states.json'
import usaStats from '@/public/data/usa-stats.json'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CityRecord {
  id: number
  name: string
  slug: string
  state: string
  stateSlug: string
  abbr: string
  solarScore: number
  sunHours: number
  annualSavings: number
  paybackYears: number
  lat: number
  lng: number
}

export interface StateRecord {
  id: number
  name: string
  slug: string
  abbr: string
  solarScore: number
  sunHours: number
  annualSavings: number
  paybackYears: number
  cityCount: number
  climateType: string
  rank: number
}

// ─── Raw exports ──────────────────────────────────────────────────────────────

export const allCities: CityRecord[] = citiesJson as CityRecord[]
export const allStates: StateRecord[] = statesJson as StateRecord[]
export const nationalStats = usaStats

// ─── Lookups ──────────────────────────────────────────────────────────────────

export function getCityBySlug(citySlug: string): CityRecord | undefined {
  return allCities.find(c => c.slug === citySlug)
}

export function getStateBySlug(stateSlug: string): StateRecord | undefined {
  return allStates.find(s => s.slug === stateSlug)
}

export function getCitiesInState(stateSlug: string): CityRecord[] {
  return allCities.filter(c => c.stateSlug === stateSlug)
}

export function getTopCities(n = 10): CityRecord[] {
  return [...allCities].sort((a, b) => b.solarScore - a.solarScore).slice(0, n)
}

export function getTopStates(n = 10): StateRecord[] {
  return [...allStates].sort((a, b) => b.solarScore - a.solarScore).slice(0, n)
}

// ─── Solar calculations ───────────────────────────────────────────────────────

export const FEDERAL_CREDIT_RATE = 0.30
export const SYSTEM_COST_PER_KW = 3000          // $/kW installed
export const PANEL_DEGRADATION_RATE = 0.005     // 0.5%/yr
export const ELECTRICITY_RATE_INCREASE = 0.032  // 3.2%/yr historical avg

export function calcSystemCost(kw: number) {
  return kw * SYSTEM_COST_PER_KW
}

export function calcFederalCredit(kw: number) {
  return Math.round(calcSystemCost(kw) * FEDERAL_CREDIT_RATE)
}

export function calcAnnualOutput(kw: number, sunHours: number) {
  return Math.round(kw * sunHours * 365)
}

export function calcAnnualSavings(kw: number, sunHours: number, ratePerKwh: number) {
  return Math.round(calcAnnualOutput(kw, sunHours) * ratePerKwh)
}

export function calcPaybackYears(netCost: number, annualSavings: number) {
  return annualSavings > 0 ? (netCost / annualSavings).toFixed(1) : '—'
}

export function calc25YearSavings(annualSavings: number, rateIncrease = ELECTRICITY_RATE_INCREASE) {
  // Accounts for electricity rate increases (savings grow each year)
  let total = 0
  for (let yr = 0; yr < 25; yr++) {
    total += annualSavings * Math.pow(1 + rateIncrease, yr)
  }
  return Math.round(total)
}

// ─── generateStaticParams helpers ────────────────────────────────────────────

export function getAllStateSlugs(): { state: string }[] {
  return allStates.map(s => ({ state: s.slug }))
}

export function getAllCitySlugs(): { state: string; city: string }[] {
  return allCities.map(c => ({ state: c.stateSlug, city: c.slug }))
}

export function getAllCompareSlugs(): { slug: string }[] {
  // Generate top-city pairings for static compare pages
  const top20 = getTopCities(20)
  const pairs: { slug: string }[] = []
  for (let i = 0; i < top20.length; i++) {
    for (let j = i + 1; j < top20.length; j++) {
      pairs.push({ slug: `${top20[i].slug}-vs-${top20[j].slug}` })
    }
  }
  return pairs
}

// ─── SEO helpers ─────────────────────────────────────────────────────────────

export function getCityMeta(city: CityRecord) {
  return {
    title: `Solar Potential in ${city.name}, ${city.abbr} | ${city.solarScore}/100 | SolarAtlas`,
    description: `${city.name} solar score: ${city.solarScore}/100. Save $${city.annualSavings.toLocaleString()}/year. ${city.sunHours} peak sun hours. Free interactive calculator & installer comparison.`,
  }
}

export function getStateMeta(state: StateRecord) {
  return {
    title: `${state.name} Solar Potential | ${state.cityCount} Cities Analyzed | SolarAtlas`,
    description: `${state.name} solar: avg score ${state.solarScore}/100. $${state.annualSavings}/yr savings. Ranked #${state.rank} in the US. Full breakdown for all ${state.cityCount} cities.`,
  }
}

export function getCompareMeta(cityA: CityRecord, cityB: CityRecord) {
  return {
    title: `${cityA.name} vs ${cityB.name} Solar Comparison | SolarAtlas`,
    description: `${cityA.name} (${cityA.solarScore}/100) vs ${cityB.name} (${cityB.solarScore}/100). Which city is better for solar? Full savings, payback & incentives comparison.`,
  }
}
