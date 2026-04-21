import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import Header from '../components/Header'

describe('Header', () => {
  it('renders navigation links in desktop nav', () => {
    render(<Header />)
    const desktopNav = screen.getByRole('navigation', { name: /navigation principale/i })
    expect(desktopNav).toHaveTextContent(/à propos/i)
    expect(desktopNav).toHaveTextContent(/projets/i)
    expect(desktopNav).toHaveTextContent(/contact/i)
  })

  it('renders the year brand', () => {
    render(<Header />)
    expect(screen.getByText(/©2026/i)).toBeInTheDocument()
  })

  it('toggles aria-expanded on mobile menu button click', async () => {
    const user = userEvent.setup()
    render(<Header />)

    const menuButton = screen.getByRole('button', { name: /ouvrir le menu/i })
    expect(menuButton).toHaveAttribute('aria-expanded', 'false')

    await user.click(menuButton)
    expect(screen.getByRole('button', { name: /fermer le menu/i })).toHaveAttribute('aria-expanded', 'true')
  })

  it('sets aria-expanded back to false after closing the mobile menu', async () => {
    const user = userEvent.setup()
    render(<Header />)

    const openBtn = screen.getByRole('button', { name: /ouvrir le menu/i })
    await user.click(openBtn)

    const closeBtn = screen.getByRole('button', { name: /fermer le menu/i })
    await user.click(closeBtn)

    expect(screen.getByRole('button', { name: /ouvrir le menu/i })).toHaveAttribute('aria-expanded', 'false')
  })
})
