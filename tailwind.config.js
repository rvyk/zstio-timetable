/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./node_modules/flowbite-react/**/*.js", "./src/**/*.tsx"],
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
          scrollbar: "#141414",
        },
      },
    },
  },
};
