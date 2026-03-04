import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Dark premium palette
        bg: {
          DEFAULT: '#0A0A0A',
          card:    '#141414',
          alt:     '#1a1a1a',
        },
        surface: '#F5F0E8',
        muted:   '#888888',
        accent: {
          DEFAULT: '#5B8CF5',
          hover:   '#4A7CF3',
        },
        'border-subtle': '#222222',
        'border-mid':    '#333333',
        // Keep brand for any remaining references
        brand: {
          '50':  '#f0f7ff',
          '100': '#e0effe',
          '500': '#0d90e7',
          '600': '#0171c3',
          '700': '#025a9e',
        },
        neutral: {
          '50':  '#f8fafc',
          '100': '#f1f5f9',
          '200': '#e2e8f0',
          '400': '#94a3b8',
          '500': '#64748b',
          '600': '#475569',
          '800': '#1e293b',
          '900': '#0f172a',
        },
        success: { DEFAULT: '#22c55e', light: '#dcfce7' },
        warning: { DEFAULT: '#f59e0b', light: '#fef3c7' },
        danger:  { DEFAULT: '#ef4444', light: '#fee2e2' },
      },
      fontFamily: {
        display: ['Bebas Neue', 'sans-serif'],
        sans:    ['DM Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card:           '0 1px 3px 0 rgb(0 0 0 / 0.4)',
        'card-hover':   '0 4px 12px 0 rgb(0 0 0 / 0.5)',
        'accent-glow':  '0 0 20px rgba(91, 140, 245, 0.15)',
        focus:          '0 0 0 3px rgba(91, 140, 245, 0.2)',
      },
      borderRadius: {
        DEFAULT: '4px',
        sm:  '2px',
        md:  '4px',
        lg:  '8px',
        xl:  '8px',
        '2xl': '8px',
      },
      animation: {
        'fade-in':    'fadeIn 0.3s ease-in-out',
        'slide-up':   'slideUp 0.3s ease-out',
        'fade-up':    'fadeUp 0.65s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn:  { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: {
          '0%':   { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',    opacity: '1' },
        },
        fadeUp: {
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
