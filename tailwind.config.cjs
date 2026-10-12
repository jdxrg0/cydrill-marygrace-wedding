/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        terracotta: {
          DEFAULT: '#6B8467',
          light: '#8FA68B',
          dark: '#3E523B',
        },
        rust: {
          DEFAULT: '#3E523B',
          deep: '#2B3B29',
        },
        sienna: '#D49499',
        sand: {
          light: '#F2F5F0',
          DEFAULT: '#E4EBE1',
          dark: '#CCD8C8',
        },
        alabaster: '#FAFBF9',
        sage: {
          light: '#B8C7B4',
          DEFAULT: '#6B8467',
          dark: '#3E523B',
          deep: '#2B3B29',
        },
        blush: {
          light: '#F7E8EA',
          DEFAULT: '#E8C5C8',
          rose: '#D49499',
          deep: '#B06970',
        },
        champagne: '#C8A97E',
        espresso: {
          DEFAULT: '#222B23',
          muted: '#4A584B',
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        script: ['"Alex Brush"', '"Parisienne"', 'cursive'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'envelope': '0 25px 60px -15px rgba(34, 43, 35, 0.24), 0 10px 25px -10px rgba(107, 132, 103, 0.18)',
        'wax': '0 8px 20px rgba(160, 90, 96, 0.42), inset 0 2px 4px rgba(255, 235, 238, 0.45), inset 0 -4px 6px rgba(110, 50, 56, 0.45)',
        'polaroid': '0 14px 32px -8px rgba(34, 43, 35, 0.14), 0 4px 10px -2px rgba(34, 43, 35, 0.07)',
        'card': '0 18px 40px -12px rgba(70, 89, 67, 0.11)',
      },
    },
  },
  plugins: [],
};
