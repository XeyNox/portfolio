export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-10 px-6 lg:px-10">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[10px] tracking-widest text-zinc-600 uppercase hover:text-white transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[10px] tracking-widest text-zinc-600 uppercase hover:text-white transition-colors"
          >
            LinkedIn
          </a>
        </div>
        <p className="font-mono text-[10px] tracking-widest text-zinc-700 uppercase">
          ©2026 — Fait avec soin
        </p>
        <a
          href="#"
          className="font-mono text-[10px] tracking-widest text-zinc-600 uppercase hover:text-white transition-colors flex items-center gap-2"
        >
          Haut de page
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </a>
      </div>
    </footer>
  )
}
