/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./App.tsx", "./app/**/*.{js,jsx,ts,tsx}", "./app/*"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        text: "#efe4ef",
        background: "#160d15",
        primary: "#484F45",
        secondary: "#303e26",
        accent: "#a3dcbc",
      }
    },
  },
  plugins: [],
}