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
          primary: "81667a",
          secondary: "92b4a7",
          accent: "d1f0b1",
          neutral: "#8C8A93",
          error: "8c271e",
          "base-100": "#FFFFFF",
        },
      },
    ],
  },
};