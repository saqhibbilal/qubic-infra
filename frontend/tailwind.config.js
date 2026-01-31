/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Voces', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: "#1F3A34",
        surface: "#F4F8F9",
        "primary-dark": "#162d28",
        "primary-light": "#2d524a",
      },
    },
  },
  plugins: [],
}
