import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Oral from '../pages/Oral'
import { generateSteps, STEPS } from '../pages/oral/slides'

describe('generateSteps', () => {
  it('produces one overview step per slide', () => {
    const slides = [
      { id: 'a', section: 'S', title: 'T', points: [{ text: 'p1' }, { text: 'p2' }] },
      { id: 'b', section: 'S', title: 'T2', points: [{ text: 'p3' }] },
    ]
    const steps = generateSteps(slides)
    const overviews = steps.filter(s => s.kind === 'overview')
    expect(overviews).toHaveLength(2)
  })

  it('produces no zoom step for a text-only slide', () => {
    const slides = [
      { id: 'a', section: 'S', title: 'T', points: [{ text: 'p1' }, { text: 'p2' }] },
    ]
    const zooms = generateSteps(slides).filter(s => s.kind === 'zoom')
    expect(zooms).toHaveLength(0)
  })

  it('produces a zoom step only for points that have a visual', () => {
    const slides = [
      {
        id: 'a',
        section: 'S',
        title: 'T',
        points: [
          { text: 'img', image: '/a.png' },
          { text: 'vid', video: '/a.mp4' },
          { text: 'code', code: 'x' },
          { text: 'diag', diagram: 'db' as const },
          { text: 'plain' },
        ],
      },
    ]
    const zooms = generateSteps(slides).filter(s => s.kind === 'zoom')
    expect(zooms).toHaveLength(4)
  })

  it('orders the overview before its zoom steps', () => {
    const slides = [
      {
        id: 'a',
        section: 'S',
        title: 'T',
        points: [{ text: 'p1', image: '/a.png' }, { text: 'p2', code: 'x' }],
      },
    ]
    const steps = generateSteps(slides)
    expect(steps[0]).toMatchObject({ kind: 'overview', slideIndex: 0 })
    expect(steps[1]).toMatchObject({ kind: 'zoom', slideIndex: 0, pointIndex: 0 })
    expect(steps[2]).toMatchObject({ kind: 'zoom', slideIndex: 0, pointIndex: 1 })
  })
})

function renderOral() {
  return render(
    <MemoryRouter>
      <Oral />
    </MemoryRouter>
  )
}

describe('Oral', () => {
  it('renders the first slide on mount', () => {
    renderOral()
    expect(screen.getByText('SMP-Commercial')).toBeInTheDocument()
  })

  it('shows slide counter starting at 01', () => {
    renderOral()
    expect(screen.getByText(/^01\s*\/\s*\d+$/)).toBeInTheDocument()
  })

  it('navigates to the next slide after one click (first slide has no visual points)', async () => {
    renderOral()
    await userEvent.click(screen.getByRole('button', { name: 'Diapositive suivante' }))
    expect(screen.getByText('SMP Moules')).toBeInTheDocument()
  })

  it('disables the prev button on the first slide', () => {
    renderOral()
    expect(screen.getByRole('button', { name: 'Diapositive précédente' })).toBeDisabled()
  })

  it('disables the next button on the last step', async () => {
    renderOral()
    const nextBtn = screen.getByRole('button', { name: 'Diapositive suivante' })
    for (let i = 0; i < STEPS.length - 1; i++) {
      await userEvent.click(nextBtn)
    }
    expect(nextBtn).toBeDisabled()
  })

  it('has a link back to the portfolio', () => {
    renderOral()
    expect(screen.getByRole('link', { name: /portfolio/i })).toHaveAttribute('href', '/')
  })
})
