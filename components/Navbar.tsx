'use client'

import { useState } from 'react'
import { Sun, Menu, X, Search } from 'lucide-react'
import Link from 'next/link'

const NAV_LINKS = [
  { label: 'Top States',  href: '#states'  },
  { label: 'Top Cities',  href: '#cities'  },
  { label: 'Compare',     href: '/compare' },
  { label: 'Calculator',  href: '#calculator' },
  { label: 'Blog',        href: '/blog'    },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-6">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
            <Sun size={18} className="text-white" />
          </div>
          <span className="font-black text-lg tracking-tight">
            Solar<span className="text-emerald-400">Atlas</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6 text-sm text-slate-400">
          {NAV_LINKS.map(l => (
            <Link key={l.label} href={l.href} className="hover:text-white transition">
              {l.label}
            </Link>
          ))}
        </div>

        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm w-52">
          <Search size={14} className="text-slate-500 shrink-0" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search city or state…"
            className="bg-transparent outline-none placeholder-slate-500 text-white w-full text-sm"
          />
        </div>

        {/* Mobile menu toggle */}
        <button onClick={() => setOpen(!open)} className="md:hidden text-slate-400 hover:text-white">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden bg-slate-800 border-t border-slate-700 px-6 py-4 space-y-3">
          <div className="flex items-center gap-2 bg-slate-700 rounded-lg px-3 py-2 mb-4">
            <Search size={14} className="text-slate-400" />
            <input placeholder="Search city or state…" className="bg-transparent outline-none text-sm text-white placeholder-slate-400 w-full" />
          </div>
          {NAV_LINKS.map(l => (
            <Link
              key={l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block text-slate-300 hover:text-white py-1 transition"
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
