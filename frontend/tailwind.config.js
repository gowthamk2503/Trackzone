/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          lightest: '#F5EFFF',
          light: '#E5D9F2',
          soft: '#CDC1FF',
          primary: '#A294F9',
          darkBg: '#0C0A17',
          darkCard: '#131024',
          darkSurface: '#1C1736',
          darkBorder: '#2F275A',
        },
        lavender: {
          50: '#F5EFFF',
          100: '#E5D9F2',
          200: '#D7C7F7',
          300: '#CDC1FF',
          400: '#B7A9FB',
          500: '#A294F9',
          600: '#8E7DEE',
          700: '#7967DE',
          800: '#614FC4',
          900: '#4C3CA5',
          950: '#1E164D',
        },
        primary: {
          50: '#F5EFFF',
          100: '#E5D9F2',
          200: '#D7C7F7',
          300: '#CDC1FF',
          400: '#B7A9FB',
          500: '#A294F9',
          600: '#8E7DEE',
          700: '#7967DE',
          800: '#614FC4',
          900: '#4C3CA5',
          950: '#1E164D',
        },
        indigo: {
          50: '#F5EFFF',
          100: '#E5D9F2',
          200: '#D7C7F7',
          300: '#CDC1FF',
          400: '#B7A9FB',
          500: '#A294F9',
          600: '#A294F9',
          700: '#8E7DEE',
          800: '#7967DE',
          900: '#614FC4',
          950: '#1E164D',
        },
        purple: {
          50: '#F5EFFF',
          100: '#E5D9F2',
          200: '#D7C7F7',
          300: '#CDC1FF',
          400: '#B7A9FB',
          500: '#A294F9',
          600: '#8E7DEE',
          700: '#7967DE',
          800: '#614FC4',
          900: '#4C3CA5',
          950: '#1E164D',
        },
        dark: {
          bg: '#0C0A17',
          card: '#131024',
          surface: '#1C1736',
          border: '#2F275A',
          hover: '#261F49',
        }
      },
      fontFamily: {
        sans: ['Ranade', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        display: ['Ranade', 'sans-serif'],
        heading: ['Ranade', 'sans-serif'],
        brand: ['"Playfair Display"', 'Georgia', 'serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan': 'scan 2.5s ease-in-out infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.6', transform: 'scale(1.05)' },
        },
        scan: {
          '0%, 100%': { transform: 'translateY(0%)' },
          '50%': { transform: 'translateY(100%)' },
        }
      }
    },
  },
  plugins: [],
}
