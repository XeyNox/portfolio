import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import NotesPage from '../pages/oral/NotesPage'
import { SLIDES } from '../pages/oral/slides'

describe('NotesPage', () => {
  it('lists every slide title', () => {
    render(<NotesPage />)
    for (const slide of SLIDES) {
      expect(screen.getAllByText(slide.title).length).toBeGreaterThan(0)
    }
  })
})
