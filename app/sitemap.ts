// app/sitemap.ts
// Generates sitemap.xml at build time — crucial for SEO on 30k pages

import { MetadataRoute } from 'next'
import { allCities, allStates, getTopCities } from '@/lib/data'

const BASE_URL = 'https://solaratlas.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE_URL}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
  ]

  // State pages — all 50
  const statePages: MetadataRoute.Sitemap = allStates.map(state => ({
    url: `${BASE_URL}/solar/${state.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // City pages
  const cityPages: MetadataRoute.Sitemap = allCities.map(city => ({
    url: `${BASE_URL}/solar/${city.stateSlug}/${city.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: city.solarScore >= 85 ? 0.9 : 0.7,
  }))

  // Compare pages — top 20 cities cross-compared
  const top20 = getTopCities(20)
  const comparePages: MetadataRoute.Sitemap = []
  for (let i = 0; i < top20.length; i++) {
    for (let j = i + 1; j < top20.length; j++) {
      comparePages.push({
        url: `${BASE_URL}/compare/${top20[i].slug}-vs-${top20[j].slug}`,
        lastModified: now,
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      })
    }
  }

  return [...staticPages, ...statePages, ...cityPages, ...comparePages]
}
