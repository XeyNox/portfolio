import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import Contact from '../components/Contact'

describe('Contact', () => {
  it('renders the contact form', () => {
    render(<Contact />)
    expect(screen.getByTestId('contact-form')).toBeInTheDocument()
    expect(screen.getByLabelText(/nom/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument()
  })

  it('shows success message after form submission', async () => {
    const user = userEvent.setup()
    render(<Contact />)

    await user.type(screen.getByLabelText(/nom/i), 'Jean Dupont')
    await user.type(screen.getByLabelText(/email/i), 'jean@example.com')
    await user.type(screen.getByLabelText(/message/i), 'Bonjour !')
    await user.click(screen.getByRole('button', { name: /envoyer/i }))

    expect(screen.getByTestId('success-message')).toBeInTheDocument()
    expect(screen.queryByTestId('contact-form')).not.toBeInTheDocument()
  })

  it('updates form fields on user input', async () => {
    const user = userEvent.setup()
    render(<Contact />)

    const nameInput = screen.getByLabelText(/nom/i)
    await user.type(nameInput, 'Test')
    expect(nameInput).toHaveValue('Test')
  })
})
