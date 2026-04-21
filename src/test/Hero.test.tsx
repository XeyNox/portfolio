import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Hero from '../components/Hero'

describe('Hero', () => {
  it('renders the section', () => {
    render(<Hero />)
    expect(screen.getByTestId('hero')).toBeInTheDocument()
  })

  it('renders call-to-action links', () => {
    render(<Hero />)
    expect(screen.getByRole('link', { name: /projets/i })).toHaveAttribute('href', '#projects')
    expect(screen.getByRole('link', { name: /contact/i })).toHaveAttribute('href', '#contact')
  })

  it('renders the skills marquee', () => {
    render(<Hero />)
    expect(screen.getAllByText('React').length).toBeGreaterThan(0)
  })
})
