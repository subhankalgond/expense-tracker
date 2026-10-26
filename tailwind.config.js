/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FDFBF7',
          100: '#FAF8F5',
          200: '#F4EFE6',
          300: '#EAE2D3',
          400: '#DDD2BF',
        },
        ink: {
          950: '#0C0D0E',
          900: '#121214',
          800: '#1F2024',
          700: '#2E3036',
          600: '#3E414A',
          500: '#52545D',
          400: '#71747F',
          300: '#A1A4B0',
          200: '#D4D5DC',
          100: '#EAEBEE',
        },
        cobalt: {
          DEFAULT: '#1E40AF',
          light: '#2563EB',
          dark: '#172554',
          subtle: '#EFF6FF',
        },
        brutal: {
          green: '#047857',
          'green-bg': '#ECFDF5',
          red: '#B91C1C',
          'red-bg': '#FEF2F2',
          amber: '#B45309',
          'amber-bg': '#FFFBEB',
          darkBg: '#0F1012',
          darkCard: '#181A1F',
          darkCardElevated: '#21242B',
          darkBorder: '#323640',
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'Menlo', 'Monaco', 'Consolas', '"Courier New"', 'monospace'],
        sans: ['"IBM Plex Sans"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        serif: ['"Newsreader"', 'Georgia', 'Cambria', '"Times New Roman"', 'serif'],
      },
      boxShadow: {
        'xs': '0 1px 2px rgba(0, 0, 0, 0.04)',
        'brutal-sm': '2px 2px 0px #121214',
        'brutal': '3px 3px 0px #121214',
        'brutal-lg': '5px 5px 0px #121214',
        'brutal-xl': '8px 8px 0px #121214',
        'brutal-dark': '3px 3px 0px #E4E4E7',
        'brutal-dark-sm': '2px 2px 0px #E4E4E7',
        'brutal-dark-lg': '5px 5px 0px #E4E4E7',
      },
      borderWidth: {
        '3': '3px',
      }
    },
  },
  plugins: [],
}
