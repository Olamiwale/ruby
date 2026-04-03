import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Product from "@/app/(public)/product/page";

//mock next.js image
jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

// Mock the products data
jest.mock("@/app/data/products.json", () => [
  { id: "1", name: "Red Gown", price: 5000, category: "gown", images: ["/red.jpg"], description: "A red gown",},
  { id: "2", name: "Blue Jumpsuit", price: 8000, category: "jumpsuit", images: ["/blue.jpg"], description: "A blue jumpsuit",},
  { id: "3", name: "Black Trouser", price: 3000, category: "trouser", images: ["/black.jpg"], description: "Black trousers",},
]);


describe("Product Page", () => {
    
// --- RENDERING ---
  it('renders the Shop heading', () => {
    render(<Product />)
    expect(screen.getByText('Shop')).toBeInTheDocument()
  })

  it('renders all products by default', () => {
    render(<Product />)
    expect(screen.getByText('Red Gown')).toBeInTheDocument()
    expect(screen.getByText('Blue Jumpsuit')).toBeInTheDocument()
    expect(screen.getByText('Black Trouser')).toBeInTheDocument()
  })

  it('renders prices correctly in Naira', () => {
    render(<Product />)
    expect(screen.getByText('₦5,000')).toBeInTheDocument()
  })


  // --- SEARCH ---

  it('filters products by search term', async () => {
    const user = userEvent.setup()
    render(<Product />)

    await user.type(screen.getByPlaceholderText('Search products...'), 'Gown')

    expect(screen.getByText('Red Gown')).toBeInTheDocument()
    expect(screen.queryByText('Blue Jumpsuit')).not.toBeInTheDocument()
    expect(screen.queryByText('Black Trouser')).not.toBeInTheDocument()
  })

  it('shows no products found when search has no match', async () => {
    const user = userEvent.setup()
    render(<Product />)

    await user.type(screen.getByPlaceholderText('Search products...'), 'xyz123')

    expect(screen.getByText('No products found')).toBeInTheDocument()
  })

  it('is case-insensitive when searching', async () => {
    const user = userEvent.setup()
    render(<Product />)

    await user.type(screen.getByPlaceholderText('Search products...'), 'gown') // lowercase

    expect(screen.getByText('Red Gown')).toBeInTheDocument()
  })


  // --- CATEGORY FILTER ---
  it('filters by Gown category', async () => {
    const user = userEvent.setup()
    render(<Product />)

    await user.click(screen.getByRole('button', { name: /gown/i }))

    expect(screen.getByText('Red Gown')).toBeInTheDocument()
    expect(screen.queryByText('Blue Jumpsuit')).not.toBeInTheDocument()
  })

  it('filters by Jumpsuit category', async () => {
    const user = userEvent.setup()
    render(<Product />)

    await user.click(screen.getByRole('button', { name: /jumpsuit/i }))

    expect(screen.getByText('Blue Jumpsuit')).toBeInTheDocument()
    expect(screen.queryByText('Red Gown')).not.toBeInTheDocument()
  })

  it('shows all products when All button is clicked', async () => {
    const user = userEvent.setup()
    render(<Product />)

    // Filter first
    await user.click(screen.getByRole('button', { name: /gown/i }))
    // Then reset
    await user.click(screen.getByRole('button', { name: /all/i }))

    expect(screen.getByText('Red Gown')).toBeInTheDocument()
    expect(screen.getByText('Blue Jumpsuit')).toBeInTheDocument()
  })

   // --- COMBINED search + filter ---
  it('applies both search and category filter together', async () => {
    const user = userEvent.setup()
    render(<Product />)

    await user.click(screen.getByRole('button', { name: /gown/i }))
    await user.type(screen.getByPlaceholderText('Search products...'), 'Blue')

    expect(screen.getByText('No products found')).toBeInTheDocument()
  })


});