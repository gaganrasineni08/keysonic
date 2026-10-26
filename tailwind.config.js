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
        keysonic: {
          dark: '#0a0b0e',
          card: '#12141a',
          border: '#1f2430',
          accent: '#38bdf8',
          emerald: '#10b981',
          purple: '#8b5cf6',
          amber: '#f59e0b',
          rose: '#f43f5e'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      keyframes: {
        press: {
          '0%': { transform: 'scale(1) translateY(0px)' },
          '50%': { transform: 'scale(0.94) translateY(3px)' },
          '100%': { transform: 'scale(1) translateY(0px)' },
        },
        wave: {
          '0%, 100%': { height: '8px' },
          '50%': { height: '32px' }
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', filter: 'drop-shadow(0 0 8px rgba(56, 189, 248, 0.4))' },
          '50%': { opacity: '0.9', filter: 'drop-shadow(0 0 20px rgba(56, 189, 248, 0.8))' }
        }
      },
      animation: {
        press: 'press 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
        wave: 'wave 1.2s ease-in-out infinite',
        glow: 'pulseGlow 2.5s ease-in-out infinite'
      }
    },
  },
  plugins: [],
}
