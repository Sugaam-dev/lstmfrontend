/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        mono:    ['"JetBrains Mono"', 'monospace'],
        display: ['"Syne"', 'sans-serif'],
        body:    ['"DM Sans"', 'sans-serif'],
      },
      colors: {
        bg:      '#090d12',
        surface: '#0f1621',
        border:  '#1c2a3a',
        muted:   '#2a3f55',
        text:    '#c8d8e8',
        dim:     '#5a7a94',
        accent:  '#00d4aa',
        accentDim: '#00d4aa22',
        bull:    '#00d4aa',
        bear:    '#ff4d6d',
        warn:    '#f59e0b',
      },
      boxShadow: {
        glow:     '0 0 20px #00d4aa22',
        glowSm:   '0 0 8px #00d4aa18',
        bearGlow: '0 0 20px #ff4d6d22',
      },
      animation: {
        'fade-in':    'fadeIn 0.4s ease forwards',
        'slide-up':   'slideUp 0.35s ease forwards',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'blink':      'blink 1.2s step-end infinite',
      },
      keyframes: {
        fadeIn:  { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(12px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        blink:   { '0%,100%': { opacity: 1 }, '50%': { opacity: 0 } },
      },
    },
  },
  plugins: [],
}
