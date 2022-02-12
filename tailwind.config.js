module.exports = {
  prefix: '',
  darkMode: 'class',
  content: [
    './src/**/*.{html,ts}',
  ],
  theme: {
    extend: {
      typography: {
        'sm': {
          css: {
            a: {
              '&:hover': {
                color: '#FF00AF',
              },
            },
          },
        },
      },
      colors: {
        pink: {
          400: '#FF4DC6',
          500: '#FF00AF',
          600: '#CC008B',
        },
        yellow: {
          500: '#ffff00',
          600: '#ffff4c'
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
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
