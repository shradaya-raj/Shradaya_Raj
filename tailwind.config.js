// Flood-response field palette (option S): deep teal-blue ink + ops cyan accent.
// Purple scale = sand chips for highlight variety (≤3 color jobs).
const flood = {
  50: '#eef6f8',
  100: '#d5ebf2',
  200: '#a8d5e3',
  300: '#6bb8cd',
  400: '#1490ad',
  500: '#0e7490',
  600: '#0c627a',
  700: '#0b3a4a',
  800: '#092f3c',
  900: '#072530',
  950: '#04151c',
}

const sand = {
  50: '#f8f3eb',
  100: '#f0e6d4',
  200: '#e2cfb0',
  300: '#d4b88c',
  400: '#c4a574',
  500: '#b89560',
  600: '#9a7a4c',
  700: '#7a5f3c',
  800: '#5c4730',
  900: '#3f3122',
  950: '#241c14',
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
      fontFamily: {
        sans: ['var(--font-source-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-fraunces)', 'system-ui', 'serif'],
      },
      colors: {
        black: '#0b3a4a',
        blue: flood,
        purple: sand,
        brand: { base: '#e2e8ed', accent: '#0e7490', 'accent-hover': '#0c627a' },
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
