/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./utils/**/*.{js,ts,jsx,tsx}",
  ],
  plugins: [require("daisyui")],
  darkTheme: "fitpal",
  darkMode: ["selector", "[data-theme='fitpal']"],
  daisyui: {
    themes: [
      {
        fitpal: {
          primary: '#9FFF5B',        // Neon Green
          'primary-content': '#000000',
          secondary: '#1C1C1E',      // Dark Grey
          'secondary-content': '#ffffff',
          accent: '#9FFF5B',         // Neon Green
          'accent-content': '#000000',
          neutral: '#2C2C2E',        // Medium Grey
          'neutral-content': '#ffffff',
          'base-100': '#000000',     // Pure Black
          'base-200': '#1C1C1E',     // Dark Grey
          'base-300': '#2C2C2E',     // Medium Grey
          'base-content': '#ffffff',
          info: '#9FFF5B',           // Neon Green
          success: '#9FFF5B',        // Neon Green
          warning: '#FFD426',        // Warning Yellow
          error: '#FF4545',          // Error Red
          
          // Custom properties
          '--rounded-btn': '0.75rem',
          '--border-btn': '1px',
          '.glass': {
            'background': 'rgba(28,28,30,0.8)',
            'backdrop-filter': 'blur(8px)',
          },
          '.chart-line': {
            'stroke': '#9FFF5B',
            'filter': 'drop-shadow(0 0 2px #9FFF5B)',
          },
        },
      },
    ],
  },
  theme: {
    extend: {
      colors: {
        'neon-green': '#9FFF5B',
        'dark-surface': '#1C1C1E',
        'darker-surface': '#000000',
        'medium-surface': '#2C2C2E',
      },
      boxShadow: {
        'neon-glow': '0 0 10px rgba(159, 255, 91, 0.3)',
        'neon-glow-strong': '0 0 15px rgba(159, 255, 91, 0.5)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
};