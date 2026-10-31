// Forest-green shades unify existing portfolio accent utilities.
const steel = {
  50: '#f0f7f2', 100: '#dfede3', 200: '#bfd8c7', 300: '#95baa2',
  400: '#669476', 500: '#427656', 600: '#305f43', 700: '#244c35',
  800: '#203f2d', 900: '#1c3427', 950: '#0e1d15',
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        black: '#0b1220',
        blue: steel,
        purple: steel,
        brand: { base: '#faf9f6', accent: '#244c35', 'accent-hover': '#193b28' },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
