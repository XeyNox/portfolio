import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import PresenterView from '../pages/oral/PresenterView'
import { SLIDES } from '../pages/oral/slides'

describe('PresenterView', () => {
  it('shows the speaker notes for the current step and a timer', () => {
    render(
      <MemoryRouter>
        <PresenterView />
      </MemoryRouter>,
    )
    // First step is the title overview; its first point detail is the speaker note source.
    expect(screen.getByText(SLIDES[0].points[0].detail as string)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /démarrer|pause/i })).toBeInTheDocument()
  })
})
