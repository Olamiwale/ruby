This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.






app/
│
├── layout.tsx
├── page.tsx              // homepage (/)
├── globals.css
│
├── (public)/             // route group (optional but clean)
│   ├── about/page.tsx
│   ├── contact/page.tsx
│   ├── product/
│   │    ├── page.tsx
│   │    └── [slug]/page.tsx
│   ├── size/page.tsx
│   ├── signin/page.tsx
│   ├── signup/page.tsx
│
├── (shop)/
│   ├── cart/page.tsx
│   ├── checkout/page.tsx
│
├── (admin)/
│   └── admin/page.tsx
│
├── api/                  // if needed later
│
├── providers/            // global wrappers
│   ├── ReduxProvider.tsx
│   ├── AuthProvider.tsx
│
├── components/           // shared UI only
│   ├── ui/
│   │    ├── Navbar.tsx
│   │    ├── Footer.tsx
│   │    ├── Spinner.tsx
│   │
│   ├── layout/
│   │    ├── PageWrapper.tsx
│   │
│   ├── shared/
│        ├── Accordion.tsx
│        ├── ErrorBoundary.tsx
│
├── features/             // 🔥 best practice
│   ├── auth/
│   │    ├── AuthContext.tsx
│   │    ├── ProtectedRoute.tsx
│   │    ├── Profile.tsx
│   │    ├── ForgotPassword.tsx
│   │    ├── ResetPassword.tsx
│   │
│   ├── product/
│   │    ├── ProductDetails.tsx
│   │    ├── MoreProducts.tsx
│   │
│   ├── checkout/
│   │    ├── CheckOut.tsx
│   │    ├── BankTransfer.tsx
│   │    ├── PaymentCallback.tsx
│   │
│   ├── home/
│        ├── Hero.tsx
│        ├── Shop.tsx
│        ├── VideoPlayer.tsx
│
├── lib/                  // utilities
│
├── data/                 // static data
│   ├── products.json
│   ├── collection.json
│
└── assets/
    ├── images/
    │    └── logo.webp# ruby
