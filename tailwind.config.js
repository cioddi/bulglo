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
        primary: {
          50: '#f0f9ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        success: '#22c55e',
        error: '#ef4444',
        warning: '#f59e0b',
      },
      fontFamily: {
        'cyrillic': ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
