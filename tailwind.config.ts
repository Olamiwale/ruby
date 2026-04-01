import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'light-wine': '#8b3a45',
        'wine': '#7a0d20',
      },
    },
  },
  plugins: [],
}

export default config
