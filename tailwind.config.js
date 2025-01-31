const typography = require('@tailwindcss/typography');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: "#4F46E5",
        secondary: "#7C3AED",
        'primary-dark': '#6D28D9',
      },
      animation: {
        "beam": "beam 8s linear infinite",
        "blink": "blink 1s step-end infinite",
        "sparkle": "sparkle 1.5s ease-in-out infinite",
      },
      keyframes: {
        beam: {
          "from": {
            opacity: 0,
            transform: "translateX(-100%) skewX(-10deg)",
          },
          "to": {
            opacity: 0.3,
            transform: "translateX(100%) skewX(-10deg)",
          },
        },
        blink: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0 },
        },
        sparkle: {
          "0%, 100%": {
            opacity: 1,
            transform: "scale(1)",
          },
          "50%": {
            opacity: 0.5,
            transform: "scale(0.8)",
          },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [
    typography,
  ],
}
