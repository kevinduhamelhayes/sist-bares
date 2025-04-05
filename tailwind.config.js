/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        'modal-appear': {
          'from': {
            opacity: '0',
            transform: 'translateY(-20px)'
          },
          'to': {
            opacity: '1',
            transform: 'translateY(0)'
          }
        }
      },
      animation: {
        'modal': 'modal-appear 0.3s ease-out'
      },
      gridTemplateColumns: {
        'auto-fill-150': 'repeat(auto-fill, minmax(150px, 1fr))',
      }
    },
  },
  plugins: [],
} 