/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FFFDF8',
          100: '#FFF8F0',
          200: '#FFF0DC',
          300: '#FFE4C4',
        },
        sand: {
          100: '#F5EDD8',
          200: '#E8D5B7',
          300: '#D4B896',
          400: '#C09A75',
        },
        blush: {
          50: '#FFF0F0',
          100: '#FFE0E0',
          200: '#FFB3B3',
          300: '#F9D5D3',
          400: '#F4ACAA',
          500: '#E88080',
        },
        lavender: {
          50: '#F5F0FF',
          100: '#EDE4FF',
          200: '#D5C5F0',
          300: '#BBA3E8',
          400: '#9B7DD4',
          500: '#7B5AB8',
          600: '#634499',
          700: '#4B2E7A',
          800: '#32195C',
          900: '#1C0A3D',
        },
        sky: {
          50: '#F0F7FF',
          100: '#E0EFFE',
          200: '#C5DFF8',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
        },
        sage: {
          50: '#F0FBF0',
          100: '#DCF5E0',
          200: '#C8E6C9',
          300: '#A5D6A7',
          400: '#81C784',
          500: '#4CAF50',
        },
        peach: {
          50: '#FFF5EE',
          100: '#FFE8D6',
          200: '#FFCCAA',
          300: '#FFB088',
          400: '#FF9055',
        },
        rose: {
          50: '#FFF0F5',
          100: '#FFD6E7',
          200: '#FFB3CC',
          300: '#FF80AB',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'card': '0 1px 3px rgba(0,0,0,0.05), 0 4px 12px rgba(0,0,0,0.05)',
        'hover': '0 4px 20px -2px rgba(0, 0, 0, 0.1)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
}
