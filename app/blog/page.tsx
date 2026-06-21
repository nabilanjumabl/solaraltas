import type { Metadata } from 'next'
import fs from 'fs'
import path from 'path'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Solar Energy Blog | SolarAtlas',
  description: 'Daily insights on solar savings, incentives, and installation across the US — auto-updated with fresh research.',
}

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

function getAllPosts(): BlogPost[] {
  const dir = path.join(process.cwd(), 'data', 'blog')
  if (!fs.existsSync(dir)) return []

  const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'))
  const posts = files
    .map(f => {
      try {
        const raw = fs.readFileSync(path.join(dir, f), 'utf8')
        return JSON.parse(raw) as BlogPost
      } catch {
        return null
      }
    })
    .filter((p): p is BlogPost => p !== null && p.published !== false)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return posts
}

export default function BlogIndexPage() {
  const posts = getAllPosts()

  return (
    <div className="min-h-screen bg-slate-900 text-white px-6 py-16">
      <div className="max-w-5xl mx-auto">
        <div className="text-sm text-slate-400 mb-8">
          <Link href="/" className="hover:text-white transition">SolarAtlas</Link>
          <span className="mx-2">/</span>
          <span className="text-white">Blog</span>
        </div>

        <h1 className="text-4xl font-black mb-3">Solar Energy Blog</h1>
        <p className="text-slate-400 mb-12">
          {posts.length} articles on solar savings, incentives, and installation — updated regularly.
        </p>

        {posts.length === 0 ? (
          <p className="text-slate-400">No posts published yet. Check back soon.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {posts.map(post => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-emerald-600 rounded-2xl p-6 transition group"
              >
                <div className="text-xs text-slate-400 mb-3">{post.date}</div>
                <h2 className="text-xl font-bold mb-2 group-hover:text-emerald-400 transition">
                  {post.title}
                </h2>
                <p className="text-slate-300 text-sm leading-relaxed mb-4">{post.excerpt}</p>
                <div className="flex flex-wrap gap-2">
                  {(post.tags || []).slice(0, 3).map(tag => (
                    <span key={tag} className="text-xs bg-slate-700 text-emerald-400 px-2 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
