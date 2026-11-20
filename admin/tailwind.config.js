/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
    '../frontend/index.html',
    '../frontend/src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        headline: ['Plus Jakarta Sans', 'sans-serif'],
        body: ['Plus Jakarta Sans', 'sans-serif'],
        label: ['Plus Jakarta Sans', 'sans-serif'],
      },
      colors: {
        border: 'hsl(214.3 31.9% 91.8%)',
        rust: '#B23A0F',
        rust_light: '#E57373',
        warm_off_white: '#FAF9F6',
      },
      borderRadius: {
        card: '14px',
        pill: '50px',
      },
    },
  },
  plugins: [],
}