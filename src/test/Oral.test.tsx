import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Oral from '../pages/Oral'

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

  it('shows slide counter starting at 01 / 47', () => {
    renderOral()
    expect(screen.getByText('01 / 47')).toBeInTheDocument()
  })

  it('navigates to the next slide on button click', async () => {
    renderOral()
    await userEvent.click(screen.getByRole('button', { name: 'Diapositive suivante' }))
    expect(screen.getByText('SMP Moules')).toBeInTheDocument()
  })

  it('disables the prev button on the first slide', () => {
    renderOral()
    expect(screen.getByRole('button', { name: 'Diapositive précédente' })).toBeDisabled()
  })

  it('disables the next button on the last slide', async () => {
    renderOral()
    const nextBtn = screen.getByRole('button', { name: 'Diapositive suivante' })
    for (let i = 0; i < 46; i++) {
      await userEvent.click(nextBtn)
    }
    expect(nextBtn).toBeDisabled()
  })

  it('has a link back to the portfolio', () => {
    renderOral()
    expect(screen.getByRole('link', { name: /portfolio/i })).toHaveAttribute('href', '/')
  })
})
