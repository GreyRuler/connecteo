/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg_color': 'White',
        'secondary_bg_color': '#DAD9E6',
        'text_color': '#000028',
        'hint_color': '#D9D9D9',
        'button_color': '#C43251',
        'button_text_color': 'White',
      },
      fontFamily: {
        druk: ["druk", "sans"],
        sera_regular: ["cera-regular", "sans"],
        sera_bold: ["cera-bold", "sans"],
      }
    },
  },
  plugins: [require("daisyui"), require('@tailwindcss/line-clamp')],
  daisyui: {
    themes: ['light'],
  }
}