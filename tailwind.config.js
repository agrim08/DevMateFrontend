/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    animation: {
      "background-shine": "background-shine 2s linear infinite",
    },
    keyframes: {
      "background-shine": {
        from: {
          backgroundPosition: "0 0",
        },
        to: {
          backgroundPosition: "-200% 0",
        },
      },
    },
  },

  plugins: [daisyui],
  daisyui: {
    themes: ["light", "dark", "cupcake", "black", "nord"],
  },
};
