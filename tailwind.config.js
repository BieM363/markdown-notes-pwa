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
        theme: {
          main: 'var(--bg-main)',
          card: 'var(--bg-card)',
          surface: 'var(--bg-surface)',
          subtle: 'var(--bg-subtle)',
          input: 'var(--bg-input)',
          text: 'var(--text-primary)',
          muted: 'var(--text-secondary)',
          submuted: 'var(--text-muted)',
          border: 'var(--border-color)',
          'border-subtle': 'var(--border-subtle)',
          accent: 'var(--accent)',
          'accent-hover': 'var(--accent-hover)',
        },
        sepia: {
          50: '#fbf0d9',
          100: '#f7e7c4',
          200: '#eed19c',
          800: '#433422',
          900: '#2b2114',
        },
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['Fira Code', 'JetBrains Mono', 'Menlo', 'monospace'],
        serif: ['Merriweather', 'Georgia', 'serif'],
      }
    },
  },
  plugins: [],
}
