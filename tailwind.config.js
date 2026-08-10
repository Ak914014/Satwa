/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        forest: "#213f28",
        leaf: "#5f7f3b",
        marigold: "#d3a12f",
        honey: "#b06d1a",
        parchment: "#f5ecdc",
        linen: "#fffaf1",
        ink: "#162117",
      },
      fontFamily: {
        display: ["Georgia", "Cambria", "Times New Roman", "serif"],
        body: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 22px 70px rgba(33, 63, 40, 0.14)",
      },
    },
  },
  plugins: [],
};
