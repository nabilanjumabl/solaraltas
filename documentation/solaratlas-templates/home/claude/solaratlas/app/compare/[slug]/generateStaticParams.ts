// app/compare/[slug]/generateStaticParams.ts

import { getAllCompareSlugs } from '@/lib/data'

export function generateStaticParams() {
  return getAllCompareSlugs()
}
