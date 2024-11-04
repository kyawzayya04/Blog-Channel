const colors = require("tailwindcss/colors");
/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: colors.indigo[600],
        navbg: "rgba(5, 6, 27, 0.50)",
        dbg: "rgba(5, 6, 27, 1)",
        dcard: "rgba(7, 14, 39, 1)",
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
