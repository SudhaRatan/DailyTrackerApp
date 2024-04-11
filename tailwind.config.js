/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors:{
        primary:{
          light:"#010101",
          dark:"#efefef"
        },
        secondary:{
          dark:"#fefefe",
          light:"#121212"
        },
        tertiary:{
          dark:"#f2f2f2",
          light:"#313131"
        },
        accent:"#6D5BD0",
        accent2:"#F1EDFB",
      },
      backgroundColor:{
        primary:{
          light:"#ffffff",
          dark:"#010101"
        },
        secondary:{
          light:"#fafafa",
          dark:"#121212"
        },
        tertiary:{
          light:"#f2f2f2",
          dark:"#313131"
        },
        accent:"#6D5BD0"
      }
    },
  },
  plugins: [],
}

