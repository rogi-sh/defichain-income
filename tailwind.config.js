module.exports = {
  prefix: '',
  purge: {
    enabled: true,
    content: [
      './src/**/*.{html,ts}',
    ]
  },
  mode: 'jit',
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
      minHeight: {
        '96vh': '96vh',
      },
      height: {
        '97%': '97%',
      },
      width: {
        'fit-content': 'fit-content',
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
