/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true,
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  plugins: [],
  theme: {
    extend: {
      colors: {
        primary: '#07B53B',
      },
      width: {
        112: '448px',
      },
      spacing: {
        7.5: '30px',
      },
    },
  },
  corePlugins: {
    preflight: false,
  },
}
