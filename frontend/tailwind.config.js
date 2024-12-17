/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {

        "custom-blue":"var(--blue )",
        "custom-light-blue":"var(--light-blue )",
        "custom-pink" :"var(--pink )",
        "custom-green" :"var(--green )",
        "custom-light-green" :"var(--light-green )",
        "custom-inventvm-color" :"var(--inventvm-color)",
        "custom-light-inventvm-color" :"var(--light-inventvm-color )",
      },
    },
  },
  plugins: [],
}