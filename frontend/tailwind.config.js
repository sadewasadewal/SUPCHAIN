/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef9f7",
          100: "#d5f0eb",
          200: "#aee1d8",
          300: "#7ecbc0",
          400: "#4fafa3",
          500: "#359489",
          600: "#28776f",
          700: "#235f5a",
          800: "#204d4a",
          900: "#1d413f",
          950: "#0c2625",
        },
        surface: {
          900: "#0f1419",
          800: "#151c24",
          700: "#1c2632",
          600: "#243040",
        },
      },
      fontFamily: {
        sans: ["DM Sans", "system-ui", "sans-serif"],
        display: ["Outfit", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
