/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
    '../admin/index.html',
    '../admin/src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'headline': ['Plus Jakarta Sans', 'sans-serif'],
        'body': ['Plus Jakarta Sans', 'sans-serif'],
        'label': ['Plus Jakarta Sans', 'sans-serif'],
      },
      fontSize: {
        'headline-sm': ['1.625rem', { lineHeight: '2.125rem' }],
        'headline-md': ['1.375rem', { lineHeight: '1.875rem' }],
        'headline-lg': ['1.75rem', { lineHeight: '2.25rem' }],
        'label-sm': ['0.6875rem', { lineHeight: '1rem' }],
        'label-md': ['0.8125rem', { lineHeight: '1.125rem' }],
        'label-lg': ['0.9375rem', { lineHeight: '1.25rem' }],
      },
      spacing: {
        'space-2xs': '0.25rem',
        'space-xs': '0.5rem',
        'space-2': '0.75rem',
        'space-sm': '0.875rem',
        'space-md': '1rem',
        'space-lg': '1.25rem',
        'space-xl': '1.5rem',
        'space-2xl': '2rem',
        'space-3xl': '2.5rem',
        gutter: '1.5rem',
        margin: '1rem',
      },
      borderRadius: {
        lg: '14px',
        xl: '14px',
        pill: '50px',
      },
      colors: {
        border: 'hsl(214.3 31.9% 91.8%)',
        rust: '#B23A0F',
        rust_light: '#E57373',
        warm_off_white: '#FAF9F6',
      },
    },
  },
  plugins: [],
}