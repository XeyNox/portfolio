import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import SlideView, { OverviewSlide } from '../pages/oral/SlideView'
import { SLIDES, STEPS } from '../pages/oral/slides'
import type { Slide } from '../pages/oral/slides'

describe('SlideView', () => {
  it('renders the slide title on an overview step', () => {
    const stepIndex = STEPS.findIndex(s => s.kind === 'overview')
    render(<SlideView step={STEPS[stepIndex]} />)
    expect(screen.getByText(SLIDES[0].title)).toBeInTheDocument()
  })

  it('never renders a point detail (notes stay off the projected screen)', () => {
    const zoom = STEPS.find(
      s => s.kind === 'zoom' && !!SLIDES[s.slideIndex].points[s.pointIndex].detail,
    )!
    const point = SLIDES[zoom.slideIndex].points[(zoom as { pointIndex: number }).pointIndex]
    render(<SlideView step={zoom} />)
    expect(screen.getByText(point.text)).toBeInTheDocument()
    expect(screen.queryByText(point.detail as string)).not.toBeInTheDocument()
  })

  it('renders a stats visual alongside bullets on an overview slide', () => {
    const slide: Slide = {
      id: 't',
      section: 'S',
      title: 'Titre',
      visual: { kind: 'stats', items: [{ value: '9 700', label: 'lignes Kotlin' }] },
      points: [{ text: 'point un' }],
    }
    render(<OverviewSlide slide={slide} />)
    expect(screen.getByText('9 700')).toBeInTheDocument()
    expect(screen.getByText('lignes Kotlin')).toBeInTheDocument()
    expect(screen.getByText('point un')).toBeInTheDocument()
  })

  it('renders a compare visual on an overview slide', () => {
    const slide: Slide = {
      id: 'c',
      section: 'S',
      title: 'Cmp',
      visual: { kind: 'compare', columns: [{ heading: 'A', rows: ['r1'] }, { heading: 'B', rows: ['r2'] }] },
      points: [{ text: 'p' }],
    }
    render(<OverviewSlide slide={slide} />)
    expect(screen.getByText('A')).toBeInTheDocument()
    expect(screen.getByText('r1')).toBeInTheDocument()
  })

  it('renders bullets only when the slide has no visual', () => {
    const slide: Slide = { id: 'n', section: 'S', title: 'NoVis', points: [{ text: 'solo' }] }
    render(<OverviewSlide slide={slide} />)
    expect(screen.getByText('solo')).toBeInTheDocument()
  })
})
