import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { SLIDES, SECTIONS, STEPS, type Slide } from './oral/slides'

interface ZoomSlideProps {
  slide: Slide
  pointIndex: number
}

function ZoomSlide({ slide, pointIndex }: ZoomSlideProps) {
  const point = slide.points[pointIndex]
  const hasMedia = !!(point.image || point.video)
  const hasCode = !!point.code

  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-10">
        <p className="font-mono text-xs text-[#e8ff00] uppercase tracking-widest">{slide.section}</p>
        <span className="text-zinc-600 font-mono text-xs">·</span>
        <p className="text-zinc-400 text-sm truncate">{slide.title}</p>
        <span className="ml-auto font-mono text-xs text-zinc-500 shrink-0">
          {String(pointIndex + 1).padStart(2, '0')} / {String(slide.points.length).padStart(2, '0')}
        </span>
      </div>

      {hasMedia ? (
        <div className="grid grid-cols-2 gap-10 items-center">
          <div className="flex items-center justify-center">
            {point.image && (
              <img
                src={`${import.meta.env.BASE_URL}${point.image.replace(/^\//, '')}`}
                alt={point.text}
                className="max-h-[60vh] w-full object-contain rounded-lg"
              />
            )}
            {point.video && (
              <video
                src={`${import.meta.env.BASE_URL}${point.video.replace(/^\//, '')}`}
                controls
                className="max-h-[60vh] w-full rounded-lg"
              />
            )}
          </div>
          <div className="flex flex-col gap-5">
            <p className="text-2xl font-semibold text-zinc-100 leading-snug">{point.text}</p>
            {point.detail && (
              <p className="text-zinc-400 text-lg leading-relaxed">{point.detail}</p>
            )}
          </div>
        </div>
      ) : hasCode ? (
        <div className="grid grid-cols-2 gap-10 items-start">
          <div className="flex flex-col gap-5 pt-2">
            <p className="text-2xl font-semibold text-zinc-100 leading-snug">{point.text}</p>
            {point.detail && (
              <p className="text-zinc-400 text-base leading-relaxed">{point.detail}</p>
            )}
          </div>
          <pre className="bg-zinc-900 border border-zinc-700/60 rounded-xl p-5 text-sm text-[#e8ff00]/90 font-mono leading-relaxed overflow-auto max-h-[58vh] whitespace-pre">
            <code>{point.code}</code>
          </pre>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center gap-6 min-h-[40vh]">
          <p className="text-3xl font-semibold text-zinc-100 leading-snug max-w-2xl">{point.text}</p>
          {point.detail && (
            <p className="text-zinc-400 text-xl leading-relaxed max-w-xl">{point.detail}</p>
          )}
        </div>
      )}
    </div>
  )
}

export default function Oral() {
  const [stepIndex, setStepIndex] = useState(0)

  const prev = useCallback(() => setStepIndex(i => Math.max(0, i - 1)), [])
  const next = useCallback(() => setStepIndex(i => Math.min(STEPS.length - 1, i + 1)), [])

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
        <Link to="/" className="font-mono text-xs text-zinc-500 hover:text-[#e8ff00] transition-colors">
          ← Portfolio
        </Link>
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
          className={`w-full slide-enter ${step.kind === 'overview' ? 'max-w-3xl' : 'max-w-5xl'}`}
        >
          {step.kind === 'overview' ? (
            <>
              <p className="font-mono text-xs text-[#e8ff00] mb-6 uppercase tracking-widest">
                {slide.section}
              </p>
              <h1 className="text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-4">
                {slide.title}
              </h1>
              {slide.subtitle && (
                <p className="text-zinc-400 text-lg mb-10">{slide.subtitle}</p>
              )}
              <ul className="space-y-4 mt-8">
                {slide.points.map(point => (
                  <li key={point.text} className="flex items-start gap-4 text-zinc-300 text-lg">
                    <span className="text-[#e8ff00] mt-1 shrink-0 font-mono">—</span>
                    <span>{point.text}</span>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <ZoomSlide slide={slide} pointIndex={step.pointIndex} />
          )}
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
