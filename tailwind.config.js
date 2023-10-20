/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./node_modules/flowbite-react/**/*.js",
    "./src/pages/*.jsx",
    "./src/components/*.jsx",
    "./src/components/*/*.jsx",
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
