/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./node_modules/flowbite-react/**/*.js",
    "./src/pages/**/*.{ts,tsx, js, jsx}",
    "./src/pages/*.jsx",
    "./src/pages/components/*.jsx",
    "./src/pages/utils/*.jsx",
    "./public/**/*.html",
  ],
  safelist: [
    "animate-[fade-in_1s_ease-in-out]",
    "animate-[fade-in-down_1s_ease-in-out]",
  ],
  plugins: [require("flowbite/plugin")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        light: {
          scrollbar: "#2b161b",
        },
        dark: {
          scrollbar: "#111827",
        },
      },
    },
  },
};
