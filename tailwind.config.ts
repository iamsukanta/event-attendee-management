import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        baisakh: {
          red:        '#C41E3A',
          'red-dark': '#9B1527',
          'red-mid':  '#E53E3E',
          'red-light':'#FEE2E2',
          green:      '#15803D',
          'green-light':'#DCFCE7',
          gold:       '#D97706',
          'gold-light':'#FEF3C7',
          cream:      '#FFFBEB',
        },
      },
      backgroundImage: {
        'alpona': "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23C41E3A' fill-opacity='0.06'%3E%3Ccircle cx='20' cy='20' r='8'/%3E%3Ccircle cx='20' cy='20' r='4'/%3E%3C/g%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
}

export default config
