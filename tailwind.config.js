/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";
// ✅ Use default import and destructure to avoid CommonJS import issues
import defaultTheme from "tailwindcss/defaultTheme";

const { fontFamily } = defaultTheme;

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", ...fontFamily.sans],
      },
      animation: {
        "background-shine": "background-shine 2s linear infinite",
      },
      keyframes: {
        "background-shine": {
          from: { backgroundPosition: "0 0" },
          to: { backgroundPosition: "-200% 0" },
        },
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: ["light", "dark", "cupcake", "black", "nord"],
  },
};
