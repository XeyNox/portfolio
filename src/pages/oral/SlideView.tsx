import { SLIDES, type Slide, type Step } from './slides'
import ArchitectureDiagram from './diagrams/ArchitectureDiagram'
import DbSchemaDiagram from './diagrams/DbSchemaDiagram'

interface SlideViewProps {
  step: Step
}

function asset(path: string) {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
}

function OverviewSlide({ slide }: { slide: Slide }) {
  return (
    <>
      <p className="font-mono text-xs text-[#e8ff00] mb-6 uppercase tracking-widest">
        {slide.section}
      </p>
      <h1 className="text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-4">
        {slide.title}
      </h1>
      {slide.subtitle && <p className="text-zinc-400 text-lg mb-10">{slide.subtitle}</p>}
      <ul className="space-y-4 mt-8">
        {slide.points.map(point => (
          <li key={point.text} className="flex items-start gap-4 text-zinc-300 text-lg">
            <span className="text-[#e8ff00] mt-1 shrink-0 font-mono">—</span>
            <span>{point.text}</span>
          </li>
        ))}
      </ul>
    </>
  )
}

function ZoomSlide({ slide, pointIndex }: { slide: Slide; pointIndex: number }) {
  const point = slide.points[pointIndex]
  const hasMedia = !!(point.image || point.video)
  const hasDiagram = !!point.diagram
  const hasCode = !!point.code

  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-10">
        <p className="font-mono text-xs text-[#e8ff00] uppercase tracking-widest">
          {slide.section}
        </p>
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
                src={asset(point.image)}
                alt={point.text}
                className="max-h-[60vh] w-full object-contain rounded-lg"
              />
            )}
            {point.video && (
              <video src={asset(point.video)} controls className="max-h-[60vh] w-full rounded-lg" />
            )}
          </div>
          <p className="text-2xl font-semibold text-zinc-100 leading-snug">{point.text}</p>
        </div>
      ) : hasDiagram ? (
        <div className="flex flex-col gap-8">
          <p className="text-2xl font-semibold text-zinc-100 leading-snug">{point.text}</p>
          {point.diagram === 'architecture' ? <ArchitectureDiagram /> : <DbSchemaDiagram />}
        </div>
      ) : hasCode ? (
        <div className="flex flex-col gap-6">
          <p className="text-2xl font-semibold text-zinc-100 leading-snug">{point.text}</p>
          <pre className="bg-zinc-900 border border-zinc-700/60 rounded-xl p-5 text-[0.8rem] text-[#e8ff00]/90 font-mono leading-relaxed max-h-[60vh] overflow-y-auto whitespace-pre-wrap break-words">
            <code>{point.code}</code>
          </pre>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center gap-6 min-h-[40vh]">
          <p className="text-3xl font-semibold text-zinc-100 leading-snug max-w-2xl">{point.text}</p>
        </div>
      )}
    </div>
  )
}

export default function SlideView({ step }: SlideViewProps) {
  const slide = SLIDES[step.slideIndex]
  return step.kind === 'overview' ? (
    <OverviewSlide slide={slide} />
  ) : (
    <ZoomSlide slide={slide} pointIndex={step.pointIndex} />
  )
}
