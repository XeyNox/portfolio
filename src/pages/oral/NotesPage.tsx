import { SLIDES } from './slides'

export default function NotesPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans px-8 py-10 print:p-0">
      <h1 className="text-2xl font-bold mb-1">Notes d'orateur — SMP-Commercial</h1>
      <p className="text-zinc-500 text-sm mb-8 print:hidden">
        Imprime cette page (Ctrl/Cmd+P) ou garde-la sur ton téléphone.
      </p>
      <div className="space-y-8">
        {SLIDES.map((slide, i) => (
          <section key={slide.id} className="break-inside-avoid">
            <p className="font-mono text-xs uppercase tracking-widest text-zinc-400">
              {String(i + 1).padStart(2, '0')} · {slide.section}
            </p>
            <h2 className="text-lg font-semibold">{slide.title}</h2>
            {slide.subtitle && <p className="text-zinc-500 text-sm">{slide.subtitle}</p>}
            <ul className="mt-2 space-y-2">
              {slide.points.map(point => (
                <li key={point.text}>
                  <span className="font-medium">{point.text}</span>
                  {point.detail && (
                    <span className="block text-zinc-600 text-sm leading-relaxed">{point.detail}</span>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  )
}
