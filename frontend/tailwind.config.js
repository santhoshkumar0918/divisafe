/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Warm, supportive color palette
        primary: {
          50: '#fef7f0',
          100: '#fdeee0',
          200: '#fad9c1',
          300: '#f6be97',
          400: '#f0996b',
          500: '#ea7c47',
          600: '#dc6332',
          700: '#b74d28',
          800: '#924026',
          900: '#763622',
        },
        secondary: {
          50: '#f0f9f4',
          100: '#dcf2e4',
          200: '#bbe5cc',
          300: '#8dd1a8',
          400: '#5bb67d',
          500: '#389e5c',
          600: '#2a7f47',
          700: '#23653a',
          800: '#1f5130',
          900: '#1c4329',
        },
        neutral: {
          50: '#fafaf9',
          100: '#f4f4f3',
          200: '#e5e5e4',
          300: '#d1d1cf',
          400: '#b0b0ad',
          500: '#8f8f8b',
          600: '#737370',
          700: '#5d5d5a',
          800: '#4f4f4c',
          900: '#434340',
        },
        accent: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}