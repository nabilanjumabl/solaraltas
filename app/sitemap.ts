// app/sitemap.ts
// Generates sitemap.xml at build time

import { MetadataRoute } from 'next'
import fs from 'fs'
import path from 'path'
import { allCities, allStates, getAllCompareSlugs } from '@/lib/data'

const BASE_URL = 'https://solaraltas.vercel.app'

function getBlogSlugs(): string[] {
  const dir = path.join(process.cwd(), 'data', 'blog')
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.json'))
    .map(f => {
      try {
        const post = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'))
        return post.slug as string
      } catch {
        return null
      }
    })
    .filter((s): s is string => !!s)
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE_URL}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/states`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/cities`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/compare`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/blog`, lastModified: now, changeFrequency: 'daily', priority: 0.6 },
  ]

  const statePages: MetadataRoute.Sitemap = allStates.map(state => ({
    url: `${BASE_URL}/solar/${state.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const cityPages: MetadataRoute.Sitemap = allCities.map(city => ({
    url: `${BASE_URL}/solar/${city.stateSlug}/${city.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: city.solarScore >= 85 ? 0.9 : 0.7,
  }))

  const comparePages: MetadataRoute.Sitemap = getAllCompareSlugs().map(p => ({
    url: `${BASE_URL}/compare/${p.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  const blogPages: MetadataRoute.Sitemap = getBlogSlugs().map(slug => ({
    url: `${BASE_URL}/blog/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }))

  return [...staticPages, ...statePages, ...cityPages, ...comparePages, ...blogPages]
}
