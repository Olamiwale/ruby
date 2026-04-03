// Greeting.test.tsx

import { render, screen } from '@testing-library/react'
import Greeting from './Greeting'

describe('Greeting', () => {
  it('renders the name passed as a prop', () => {
    render(<Greeting name="Ada" />)

    expect(screen.getByText('Hello, Ada!')).toBeInTheDocument()
  })
})