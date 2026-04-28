/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          50:  "#eef2ff",
          100: "#c7d2fe",
          500: "#1e3a5f",
          600: "#162d4a",
          700: "#0f2035",
          800: "#091525",
          900: "#040d18",
        },
        gold: {
          400: "#f5c842",
          500: "#e6b800",
          600: "#c9a000",
        },
      },
      fontFamily: {
        display: ["'Playfair Display'", "serif"],
        body:    ["'DM Sans'", "sans-serif"],
      },
    },
  },
  plugins: [],
};