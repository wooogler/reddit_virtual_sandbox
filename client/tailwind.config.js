module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      'sans': ['Noto Sans', 'Arial', 'sans-serif'],
      'display': ['IBM Plex Sans','Arial','sans-serif']
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
