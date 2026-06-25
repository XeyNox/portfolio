import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import CompareColumns from '../pages/oral/visuals/CompareColumns'

describe('CompareColumns', () => {
  it('renders each column heading and its rows', () => {
    render(
      <CompareColumns
        columns={[
          { heading: 'Flow', rows: ['réactif', 're-émet'] },
          { heading: 'one-shot', rows: ['une fois'] },
        ]}
      />,
    )
    expect(screen.getByText('Flow')).toBeInTheDocument()
    expect(screen.getByText('réactif')).toBeInTheDocument()
    expect(screen.getByText('re-émet')).toBeInTheDocument()
    expect(screen.getByText('one-shot')).toBeInTheDocument()
    expect(screen.getByText('une fois')).toBeInTheDocument()
  })
})
