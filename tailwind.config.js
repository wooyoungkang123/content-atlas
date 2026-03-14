/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'netflix-red': '#E50914',
        'netflix-dark': '#141414',
        'netflix-gray': '#808080',
        'netflix-light-gray': '#B3B3B3',
        'netflix-card': '#1F1F1F',
        'netflix-hover': '#2F2F2F',
      },
      fontFamily: {
        netflix: ['"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
