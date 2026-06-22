import type { Metadata } from 'next'
import fs from 'fs'
import path from 'path'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import sanitizeHtml from 'sanitize-html'

interface BlogPost {
  slug: string
  title: string
  excerpt: string
  content: string
  tags: string[]
  keyword: string
  date: string
  published: boolean
}

const SITE_URL = 'https://solaraltas.vercel.app'

function getAllPosts(): BlogPost[] {
  const dir = path.join(process.cwd(), 'data', 'blog')
  if (!fs.existsSync(dir)) return []
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'))
  return files
    .map(f => {
      try {
        return JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')) as BlogPost
      } catch {
        return null
      }
    })
    .filter((p): p is BlogPost => p !== null)
}

function getPostBySlug(slug: string): BlogPost | undefined {
  return getAllPosts().find(p => p.slug === slug)
}

// Only allow a safe, known subset of tags/attributes — defense in depth
// against anything unexpected coming out of the AI generation pipeline.
function sanitizeContent(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: ['h2', 'h3', 'p', 'ul', 'ol', 'li', 'strong', 'em', 'br', 'a'],
    allowedAttributes: {
      a: ['href', 'rel', 'target'],
    },
    allowedSchemes: ['http', 'https', 'mailto'],
    transformTags: {
      a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer' }),
    },
  })
}

export async function generateStaticParams() {
  return getAllPosts().map(p => ({ slug: p.slug }))
}

type BlogPostParams = Promise<{ slug: string }>

export async function generateMetadata(
  { params }: { params: BlogPostParams }
): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return { title: 'Post Not Found | SolarAtlas' }
  return {
    title: `${post.title} | SolarAtlas Blog`,
    description: post.excerpt,
    alternates: {
      canonical: `${SITE_URL}/blog/${slug}`,
    },
  }
}

export default async function BlogPostPage(
  { params }: { params: BlogPostParams }
) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const safeContent = sanitizeContent(post.content)

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'SolarAtlas', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
      { '@type': 'ListItem', position: 3, name: post.title, item: `${SITE_URL}/blog/${slug}` },
    ],
  }

  const blogPostingSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    author: { '@type': 'Organization', name: 'SolarAtlas' },
    publisher: { '@type': 'Organization', name: 'SolarAtlas' },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/blog/${slug}` },
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }} />

      <article className="max-w-3xl mx-auto">
        <div className="text-sm text-slate-400 mb-8">
          <Link href="/" className="hover:text-white transition">SolarAtlas</Link>
          <span className="mx-2">/</span>
          <Link href="/blog" className="hover:text-white transition">Blog</Link>
          <span className="mx-2">/</span>
          <span className="text-white">{post.title}</span>
        </div>

        <div className="text-sm text-slate-400 mb-4">{post.date}</div>
        <h1 className="text-4xl font-black mb-6 leading-tight">{post.title}</h1>

        <div className="flex flex-wrap gap-2 mb-10">
          {(post.tags || []).map(tag => (
            <span key={tag} className="text-xs bg-slate-800 border border-slate-700 text-emerald-400 px-3 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>

        <div
          className="prose prose-invert prose-emerald max-w-none text-slate-300 leading-relaxed [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-white [&_h2]:mt-8 [&_h2]:mb-4 [&_p]:mb-4"
          dangerouslySetInnerHTML={{ __html: safeContent }}
        />

        <div className="mt-16 pt-8 border-t border-slate-800 flex items-center justify-between">
          <Link href="/blog" className="text-emerald-400 hover:text-emerald-300 transition text-sm font-semibold">
            ← Back to all posts
          </Link>
          <a
            href="#"
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm font-bold transition"
          >
            Get a Free Solar Quote
          </a>
        </div>
      </article>
    </div>
  )
}
