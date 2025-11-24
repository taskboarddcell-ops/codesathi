/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Nunito Sans"', 'sans-serif'],
        display: ['Fredoka', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        brand: {
          primary: '#2F6BFF',
          secondary: '#FFC83D',
          success: '#22C55E',
          error: '#FF6B6B',
          background: '#F7F8FC',
          text: '#111827',
        }
      },
      borderRadius: {
        'xl': '16px',
        'lg': '14px',
      },
      spacing: {
        '18': '4.5rem',
      }
    }
  },
  plugins: [],
}
