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
        vault: {
          bg: '#07050e',
          surface: '#0d0a1a',
          card: '#130f26',
          cardHover: '#1a1435',
          border: 'rgba(168, 85, 247, 0.15)',
          borderHover: 'rgba(168, 85, 247, 0.4)',
          purple: '#a855f7',
          purpleDark: '#7e22ce',
          purpleLight: '#c084fc',
          cyan: '#38bdf8',
          blue: '#3b82f6',
          muted: '#94a3b8',
          text: '#f8fafc',
        }
      },
      fontFamily: {
        gaming: ['Rajdhani', 'sans-serif'],
        sans: ['Inter', 'sans-serif']
      },
      boxShadow: {
        'glow-sm': '0 0 15px -3px rgba(168, 85, 247, 0.25)',
        'glow-md': '0 0 25px -5px rgba(168, 85, 247, 0.35)',
        'glow-cyan': '0 0 20px -5px rgba(56, 189, 248, 0.3)',
      }
    },
  },
  plugins: [],
}
