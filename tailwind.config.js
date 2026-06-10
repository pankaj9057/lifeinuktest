/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
      },
      colors: {
        navy: {
          950: '#060C18',
          900: '#0F172A',
          800: '#1E293B',
          700: '#253349',
          600: '#334155',
        },
        emerald: {
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
        },
        ruby: {
          400: '#F87171',
          500: '#EF4444',
          600: '#DC2626',
        },
        sky: {
          400: '#38BDF8',
          500: '#0EA5E9',
          600: '#0284C7',
        },
        amber: {
          400: '#FBBF24',
          500: '#F59E0B',
        },
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ring-fill': 'ringFill 1.2s ease-out forwards',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'slide-up': 'slideUp 0.3s ease-out forwards',
        'progress-fill': 'progressFill 0.6s ease-out forwards',
        'shimmer': 'shimmer 1.5s infinite',
      },
      keyframes: {
        ringFill: {
          '0%': { strokeDashoffset: '301' },
          '100%': { strokeDashoffset: 'var(--target-offset)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        progressFill: {
          '0%': { width: '0%' },
          '100%': { width: 'var(--target-width)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      boxShadow: {
        'glow-green': '0 0 20px rgba(16, 185, 129, 0.3)',
        'glow-blue': '0 0 20px rgba(14, 165, 233, 0.25)',
        'card-hover': '0 8px 32px rgba(0, 0, 0, 0.12)',
      },
    },
  },
  plugins: [],
};
