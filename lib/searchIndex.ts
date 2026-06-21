import { allCities, allStates } from './data'

export interface SearchItem {
  type: 'city' | 'state'
  name: string
  subtitle: string
  href: string
}

export function buildSearchIndex(): SearchItem[] {
  const cityItems: SearchItem[] = allCities.map(c => ({
    type: 'city',
    name: c.name,
    subtitle: `${c.state} · Score ${c.solarScore}/100`,
    href: `/solar/${c.stateSlug}/${c.slug}`,
  }))

  const stateItems: SearchItem[] = allStates.map(s => ({
    type: 'state',
    name: s.name,
    subtitle: `${s.cityCount} cities · Score ${s.solarScore}/100`,
    href: `/solar/${s.slug}`,
  }))

  return [...stateItems, ...cityItems]
}
