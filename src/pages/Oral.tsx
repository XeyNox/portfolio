import { useCallback, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { SLIDES, SECTIONS, STEPS } from './oral/slides'
import SlideView from './oral/SlideView'
import { useOralSync } from './oral/useOralSync'

export default function Oral() {
  const [stepIndex, setStepIndex] = useOralSync(0)

  const prev = useCallback(() => setStepIndex(Math.max(0, stepIndex - 1)), [stepIndex, setStepIndex])
  const next = useCallback(
    () => setStepIndex(Math.min(STEPS.length - 1, stepIndex + 1)),
    [stepIndex, setStepIndex],
  )

  const step = STEPS[stepIndex]
  const slide = SLIDES[step.slideIndex]
  const sectionIndex = SECTIONS.indexOf(slide.section)

  useEffect(() => {
    document.body.dataset.oral = 'true'
    return () => { delete document.body.dataset.oral }
  }, [])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [prev, next])

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans flex flex-col">
      {/* Top bar */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Link to="/" className="font-mono text-xs text-zinc-500 hover:text-[#e8ff00] transition-colors">
            ← Portfolio
          </Link>
          <Link to="/oral/presenter" className="font-mono text-xs text-zinc-500 hover:text-[#e8ff00] transition-colors">
            Présentateur ↗
          </Link>
        </div>
        <div className="flex items-center gap-6">
          {/* Section indicators */}
          <div className="hidden md:flex items-center gap-1.5">
            {SECTIONS.map((s, i) => (
              <button
                key={s}
                onClick={() => {
                  const slideIdx = SLIDES.findIndex(sl => sl.section === s)
                  const targetStep = STEPS.findIndex(st => st.slideIndex === slideIdx && st.kind === 'overview')
                  if (targetStep !== -1) setStepIndex(targetStep)
                }}
                title={s}
                aria-label={s}
                className={`px-2 py-0.5 font-mono text-[10px] rounded transition-all duration-300 ${
                  i === sectionIndex
                    ? 'bg-[#e8ff00] text-zinc-950 font-bold'
                    : 'text-zinc-600 hover:text-zinc-400'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <span className="font-mono text-xs text-zinc-500">
            {String(step.slideIndex + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
          </span>
        </div>
        <nav className="flex gap-2">
          <button
            onClick={prev}
            disabled={stepIndex === 0}
            aria-label="Diapositive précédente"
            className="px-3 py-1.5 font-mono text-xs border border-zinc-800 rounded hover:border-[#e8ff00] hover:text-[#e8ff00] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            ←
          </button>
          <button
            onClick={next}
            disabled={stepIndex === STEPS.length - 1}
            aria-label="Diapositive suivante"
            className="px-3 py-1.5 font-mono text-xs border border-zinc-800 rounded hover:border-[#e8ff00] hover:text-[#e8ff00] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            →
          </button>
        </nav>
      </header>

      {/* Slide content */}
      <main className="flex-1 flex items-center justify-center pt-24 pb-16 px-8 lg:px-24">
        <div
          key={`${step.slideIndex}-${step.kind}-${step.kind === 'zoom' ? step.pointIndex : ''}`}
          className={`w-full slide-enter ${
            step.kind === 'overview' && !SLIDES[step.slideIndex].visual ? 'max-w-3xl' : 'max-w-5xl'
          }`}
        >
          <SlideView step={step} />
        </div>
      </main>

      {/* Progress bar */}
      <div className="fixed bottom-0 left-0 right-0 h-0.5 bg-zinc-800/60">
        <div
          className="h-full bg-[#e8ff00] transition-all duration-500 ease-out"
          style={{ width: `${((stepIndex + 1) / STEPS.length) * 100}%` }}
        />
      </div>
    </div>
  )
}
