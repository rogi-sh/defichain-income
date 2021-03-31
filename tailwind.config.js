module.exports = {
  prefix: '',
  purge: {
    content: [
      './src/**/*.{html,ts}',
    ]
  },
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      height: {
        '97%': '97%',
      }
    },
  },
  variants: {
    extend: {
      textColor: ['active, focus, hover'],
    },
  },
  plugins: [],
};
