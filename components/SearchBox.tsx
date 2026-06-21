'use client'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import { buildSearchIndex, SearchItem } from '@/lib/searchIndex'

const INDEX = buildSearchIndex()

export default function SearchBox({
  variant = 'compact',
  placeholder = 'Search city or state…',
}: {
  variant?: 'compact' | 'large'
  placeholder?: string
}) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)

  const results: SearchItem[] =
    query.trim().length > 0
      ? INDEX.filter(item => item.name.toLowerCase().includes(query.trim().toLowerCase())).slice(0, 8)
      : []

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function go(href: string) {
    setOpen(false)
    setQuery('')
    router.push(href)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && results.length > 0) go(results[0].href)
    if (e.key === 'Escape') setOpen(false)
  }

  const isLarge = variant === 'large'

  return (
    <div ref={containerRef} className="relative w-full">
      <div
        className={
          isLarge
            ? 'flex items-center gap-3 bg-slate-800 border-2 border-slate-600 hover:border-emerald-500 focus-within:border-emerald-500 rounded-2xl px-5 py-4 transition'
            : 'flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm w-52'
        }
      >
        <Search size={isLarge ? 20 : 14} className="text-slate-400 shrink-0" />
        <input
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={
            isLarge
              ? 'flex-1 bg-transparent outline-none text-white placeholder-slate-400 text-lg'
              : 'bg-transparent outline-none placeholder-slate-500 text-white w-full text-sm'
          }
        />
        {isLarge && (
          <button
            onClick={() => results.length > 0 && go(results[0].href)}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold text-sm transition shrink-0"
          >
            Search
          </button>
        )}
      </div>

      {open && results.length > 0 && (
        <div className="absolute z-50 mt-2 w-full bg-slate-800 border border-slate-700 rounded-xl shadow-xl overflow-hidden max-h-80 overflow-y-auto">
          {results.map(item => (
            <button
              key={item.href}
              onClick={() => go(item.href)}
              className="w-full text-left px-4 py-3 hover:bg-slate-700 transition flex items-center justify-between gap-3 border-b border-slate-700/50 last:border-0"
            >
              <div>
                <div className="font-semibold text-white text-sm">{item.name}</div>
                <div className="text-xs text-slate-400">{item.subtitle}</div>
              </div>
              <span className="text-xs text-slate-500 uppercase shrink-0">{item.type}</span>
            </button>
          ))}
        </div>
      )}

      {open && query.trim().length > 0 && results.length === 0 && (
        <div className="absolute z-50 mt-2 w-full bg-slate-800 border border-slate-700 rounded-xl shadow-xl px-4 py-3 text-sm text-slate-400">
          No matches for "{query}"
        </div>
      )}
    </div>
  )
}
