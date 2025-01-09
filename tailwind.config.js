/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{html,js,svelte,ts}",
    "./public/index.html",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#F56F66",
          secondary: "92b4a7",
          accent: "d1f0b1",
          neutral: "#764C72",
          error: "#8C8A93",
          "base-100": "#FFFFFF",
        },
      },
    ],
  },
};