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
          primary: '#4F46E5', // Indigo
          'primary-content': '#FFFFFF',
          secondary: '#F59E0B', // Amber
          'secondary-content': '#1F2937',
          accent: '#10B981', // Emerald
          'accent-content': '#FFFFFF',
          neutral: '#374151', // Gray
          'neutral-content': '#FFFFFF',
          'base-100': '#FFFFFF',
          'base-200': '#F3F4F6',
          'base-300': '#E5E7EB',
          'base-content': '#1F2937',
          info: '#3B82F6', // Blue
          success: '#10B981', // Emerald
          warning: '#F59E0B', // Amber
          error: '#EF4444', // Red
          '--rounded-btn': '0.5rem',
          '.tooltip': { '--tooltip-tail': '6px' },
          '.link': { textUnderlineOffset: '2px' },
          '.link:hover': { opacity: '80%' },
        },
      },
      {
        dark: {
          primary: '#6366F1', // Indigo
          'primary-content': '#F9FAFB',
          secondary: '#FBBF24', // Amber
          'secondary-content': '#1F2937',
          accent: '#34D399', // Emerald
          'accent-content': '#F9FAFB',
          neutral: '#1F2937', // Gray
          'neutral-content': '#F9FAFB',
          'base-100': '#111827',
          'base-200': '#1F2937',
          'base-300': '#374151',
          'base-content': '#F9FAFB',
          info: '#60A5FA', // Blue
          success: '#34D399', // Emerald
          warning: '#FBBF24', // Amber
          error: '#F87171', // Red
          '--rounded-btn': '0.5rem',
          '.tooltip': { '--tooltip-tail': '6px', '--tooltip-color': 'oklch(var(--p))' },
          '.link': { textUnderlineOffset: '2px' },
          '.link:hover': { opacity: '80%' },
        },
      },
    ],
  },
  theme: {
    extend: {
      boxShadow: {
        center: '0 0 12px -2px rgb(0 0 0 / 0.1)',
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
};