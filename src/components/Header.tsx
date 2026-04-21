import { useState, useEffect } from 'react'

const navLinks = [
  { label: '01 — À propos', href: '#about' },
  { label: '02 — Projets', href: '#projects' },
  { label: '03 — Contact', href: '#contact' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      data-testid="header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-zinc-950/80 backdrop-blur-xl border-b border-white/5' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between h-16">
          <a href="#" className="font-mono text-xs tracking-widest text-accent uppercase">
            ©2026
          </a>

          {/* Desktop */}
          <nav aria-label="Navigation principale" className="hidden sm:flex items-center gap-10">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-mono text-xs tracking-widest text-zinc-500 hover:text-white uppercase transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Mobile button */}
          <button
            aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="sm:hidden flex flex-col gap-1.5 p-2"
          >
            <span className={`block h-px w-6 bg-white transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block h-px w-6 bg-white transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-px w-6 bg-white transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2.5' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`sm:hidden transition-all duration-500 overflow-hidden ${menuOpen ? 'max-h-60' : 'max-h-0'}`}>
        <nav aria-label="Navigation mobile" className="border-t border-white/5 bg-zinc-950/95 backdrop-blur-xl px-6 py-6">
          <div className="flex flex-col gap-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="font-mono text-sm tracking-widest text-zinc-400 hover:text-white uppercase transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </nav>
      </div>
    </header>
  )
}
