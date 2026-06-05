/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        midnight: '#081120',
        ink: '#111827',
        mist: '#e5eefb',
        aurora: '#6ee7f9',
        ember: '#fb7185',
        gold: '#fbbf24',
      },
      boxShadow: {
        glow: '0 24px 80px rgba(14, 165, 233, 0.18)',
      },
    },
  },
  plugins: [],
};
