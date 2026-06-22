import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import SlideView from './SlideView'
import { useOralSync } from './useOralSync'
import { SLIDES, STEPS } from './slides'

function notesFor(stepIndex: number): string[] {
  const step = STEPS[stepIndex]
  const slide = SLIDES[step.slideIndex]
  if (step.kind === 'overview') {
    return slide.points.map(p => p.detail).filter((d): d is string => !!d)
  }
  const detail = slide.points[step.pointIndex].detail
  return detail ? [detail] : []
}

function nextLabel(stepIndex: number): string {
  const next = STEPS[stepIndex + 1]
  if (!next) return 'Fin'
  const slide = SLIDES[next.slideIndex]
  return next.kind === 'overview' ? slide.title : slide.points[next.pointIndex].text
}

function useTimer() {
  const [seconds, setSeconds] = useState(0)
  const [running, setRunning] = useState(false)
  const ref = useRef<number | null>(null)
  useEffect(() => {
    if (running) {
      ref.current = window.setInterval(() => setSeconds(s => s + 1), 1000)
      return () => { if (ref.current) window.clearInterval(ref.current) }
    }
  }, [running])
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0')
  const ss = String(seconds % 60).padStart(2, '0')
  return {
    label: `${mm}:${ss}`,
    running,
    toggle: () => setRunning(r => !r),
    reset: () => { setRunning(false); setSeconds(0) },
  }
}

export default function PresenterView() {
  const [stepIndex, setStepIndex] = useOralSync(0)
  const timer = useTimer()

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') setStepIndex(Math.max(0, stepIndex - 1))
      if (e.key === 'ArrowRight') setStepIndex(Math.min(STEPS.length - 1, stepIndex + 1))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [stepIndex, setStepIndex])

  const openPublic = () => window.open(`${import.meta.env.BASE_URL}oral`, 'oral-public')

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans grid grid-cols-2 gap-6 p-6">
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <span className="font-mono text-sm text-[#e8ff00]">{timer.label}</span>
          <button
            onClick={timer.toggle}
            className="px-3 py-1 font-mono text-xs border border-zinc-700 rounded hover:border-[#e8ff00]"
          >
            {timer.running ? 'Pause' : 'Démarrer'}
          </button>
          <button
            onClick={timer.reset}
            className="px-3 py-1 font-mono text-xs border border-zinc-700 rounded hover:border-[#e8ff00]"
          >
            Reset
          </button>
          <button
            onClick={openPublic}
            className="ml-auto px-3 py-1 font-mono text-xs border border-zinc-700 rounded hover:border-[#e8ff00]"
          >
            Ouvrir la fenêtre public ↗
          </button>
          <Link
            to="/oral/notes"
            className="px-3 py-1 font-mono text-xs text-zinc-500 hover:text-[#e8ff00]"
          >
            Notes ↗
          </Link>
        </div>
        <div className="flex-1 rounded-xl border border-zinc-800 p-6 overflow-auto">
          <SlideView step={STEPS[stepIndex]} />
        </div>
        <div className="flex justify-between font-mono text-xs text-zinc-500">
          <button onClick={() => setStepIndex(Math.max(0, stepIndex - 1))} disabled={stepIndex === 0}>
            ← Précédent
          </button>
          <span>{stepIndex + 1} / {STEPS.length}</span>
          <button
            onClick={() => setStepIndex(Math.min(STEPS.length - 1, stepIndex + 1))}
            disabled={stepIndex === STEPS.length - 1}
          >
            Suivant →
          </button>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex-1 rounded-xl border border-zinc-800 p-6 overflow-auto">
          <p className="font-mono text-xs uppercase tracking-widest text-[#e8ff00] mb-4">Notes</p>
          <ul className="space-y-4 text-zinc-300 text-lg leading-relaxed">
            {notesFor(stepIndex).map((n, i) => (
              <li key={i}>{n}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-zinc-800 p-4">
          <p className="font-mono text-xs uppercase tracking-widest text-zinc-500 mb-1">Suivant</p>
          <p className="text-zinc-300">{nextLabel(stepIndex)}</p>
        </div>
      </section>
    </div>
  )
}
