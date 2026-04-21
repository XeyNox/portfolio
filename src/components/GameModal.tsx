import { useEffect } from 'react'

interface GameModalProps {
  title: string
  url: string
  onClose: () => void
}

export default function GameModal({ title, url, onClose }: GameModalProps) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Jouer à ${title}`}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 lg:p-8"
      onClick={onClose}
    >
      <div
        className="relative flex flex-col w-full max-w-5xl bg-zinc-900 rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
        style={{ height: 'min(90vh, 700px)' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#e8ff00]" />
            <span className="font-mono text-xs text-zinc-400 tracking-wide">{title}</span>
          </div>
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="w-7 h-7 flex items-center justify-center rounded-full border border-white/10
                       text-zinc-500 hover:text-white hover:border-white/30 transition-all font-mono text-sm"
          >
            ✕
          </button>
        </div>
        <iframe
          src={url}
          title={title}
          className="flex-1 w-full"
          allow="autoplay"
        />
      </div>
    </div>
  )
}
