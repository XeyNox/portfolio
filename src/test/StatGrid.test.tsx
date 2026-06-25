import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import StatGrid from '../pages/oral/visuals/StatGrid'

describe('StatGrid', () => {
  it('renders a value and label for each item', () => {
    render(
      <StatGrid
        items={[
          { value: '50+', label: 'ans' },
          { value: '1000+', label: 'moules' },
        ]}
      />,
    )
    expect(screen.getByText('50+')).toBeInTheDocument()
    expect(screen.getByText('ans')).toBeInTheDocument()
    expect(screen.getByText('1000+')).toBeInTheDocument()
    expect(screen.getByText('moules')).toBeInTheDocument()
  })
})
