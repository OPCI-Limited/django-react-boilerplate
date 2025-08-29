import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import { Register } from '.'

describe('Register page component', () => {
  it('should render with success', () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    )
    const linkElement = screen.getByText(/Register/i)
    expect(linkElement).toBeInTheDocument()
  })
})
