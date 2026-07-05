/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        night: "#0d130f",
        pitch: "#141c15",
        turf: "#1b241b",
        chalk: "#f1efe2",
        fade: "#8b9789",
        lime: "#c6ff4d",
        flare: "#ff7a45",
      },
      fontFamily: {
        display: ['"Anton"', "sans-serif"],
        body: ['"Karla"', "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 60px -15px rgba(198, 255, 77, 0.35)",
      },
    },
  },
  plugins: [],
};
