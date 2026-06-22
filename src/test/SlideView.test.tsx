import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import SlideView from '../pages/oral/SlideView'
import { SLIDES, STEPS } from '../pages/oral/slides'

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
})
