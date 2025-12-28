/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#8B0000',
        secondary: '#2C1810',
        accent: '#FFD700',
      }
    },
  },
  plugins: [],
}

