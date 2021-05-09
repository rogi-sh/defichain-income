module.exports = {
  prefix: '',
  purge: {
    enabled: true,
    content: [
      './src/**/*.{html,ts}',
    ]
  },
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        pink: {
          400: '#FF4DC6',
          500: '#FF00AF',
          600: '#CC008B',
        }
      },
      height: {
        '97%': '97%',
      },
    },
  },
  variants: {
    extend: {
      borderStyle: ['dark'],
      textColor: ['active, focus, hover'],
    },
  },
  plugins: [],
};
