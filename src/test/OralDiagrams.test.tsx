import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import ArchitectureDiagram from '../pages/oral/diagrams/ArchitectureDiagram'
import DbSchemaDiagram from '../pages/oral/diagrams/DbSchemaDiagram'

describe('diagrams', () => {
  it('architecture diagram shows the three layers', () => {
    render(<ArchitectureDiagram />)
    expect(screen.getByText(/Presentation/i)).toBeInTheDocument()
    expect(screen.getByText(/Domain/i)).toBeInTheDocument()
    expect(screen.getByText(/Data/i)).toBeInTheDocument()
  })

  it('db schema shows the five entities', () => {
    render(<DbSchemaDiagram />)
    for (const e of ['CATEGORIES', 'PRODUCTS', 'CONTACTS', 'MEDIA_FILES', 'APP_SETTINGS']) {
      expect(screen.getByText(e)).toBeInTheDocument()
    }
  })
})
