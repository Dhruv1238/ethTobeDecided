/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./utils/**/*.{js,ts,jsx,tsx}",
  ],
  plugins: [require("daisyui")],
  darkTheme: "dark",
  darkMode: ["selector", "[data-theme='dark']"],
  daisyui: {
    themes: [
      {
        light: {
          primary: '#000001',
          'primary-content': '#fbf8fe',
          secondary: '#2d2c2e',
          'secondary-content': '#fbf8fe',
          accent: '#b6b7bb',
          'accent-content': '#000001',
          neutral: '#a3a2a7',
          'neutral-content': '#fbf8fe',
          'base-100': '#fbf8fe',
          'base-200': '#2d2c2e',
          'base-300': '#000001',
          'base-content': '#000001',
          info: '#b6b7bb',
          success: '#34EEB6',
          warning: '#FFCF72',
          error: '#FF8863',
          '--rounded-btn': '9999rem',
          '.tooltip': { '--tooltip-tail': '6px' },
          '.link': { textUnderlineOffset: '2px' },
          '.link:hover': { opacity: '80%' }
        },
      },
      {
        dark: {
          primary: '#000001',          // Full Black
          'primary-content': '#fbf8fe', // White
          secondary: '#2d2c2e',        // Med Grey
          'secondary-content': '#fbf8fe', // White
          accent: '#b6b7bb',           // Inner Grey
          'accent-content': '#fbf8fe',  // White
          neutral: '#a3a2a7',          // Mid Grey
          'neutral-content': '#fbf8fe', // White
          'base-100': '#2d2c2e',       // Med Grey
          'base-200': '#000001',       // Full Black
          'base-300': '#2d2c2e',       // Med Grey
          'base-content': '#fbf8fe',    // White
          info: '#b6b7bb',             // Inner Grey
          success: '#34EEB6',
          warning: '#FFCF72',
          error: '#FF8863',
          '--rounded-btn': '9999rem',
          '.tooltip': { '--tooltip-tail': '6px', '--tooltip-color': 'oklch(var(--p))' },
          '.link': { textUnderlineOffset: '2px' },
          '.link:hover': { opacity: '80%' }
        },
      },
    ],
  },
  theme: {
    extend: {
      colors: {
        'full-black': '#000001',
        'med-grey': '#2d2c2e',
        'inner-grey': '#b6b7bb',
        'mid-grey': '#a3a2a7',
        'pure-white': '#fbf8fe',
      },
      boxShadow: { center: '0 0 12px -2px rgb(0 0 0 / 0.05)' },
      animation: { 'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite' }
    },
  },
};