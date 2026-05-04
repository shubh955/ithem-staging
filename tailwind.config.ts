import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: "#F97316",
          "orange-dark": "#EA6C0A",
          "orange-light": "#FB923C",
          navy: "#1B3A6B",
          "navy-dark": "#122850",
          "navy-light": "#2451A0",
        },
        dark: {
          DEFAULT: "rgb(10 10 10 / <alpha-value>)",
          800: "rgb(20 20 20 / <alpha-value>)",
          700: "rgb(28 28 28 / <alpha-value>)",
          600: "rgb(42 42 42 / <alpha-value>)",
          500: "rgb(58 58 58 / <alpha-value>)",
          400: "rgb(74 74 74 / <alpha-value>)",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
        display: ["var(--font-inter)", "Inter", "sans-serif"],
        inter: ["var(--font-inter)", "Inter", "sans-serif"],
      },
      backgroundImage: {
        "gradient-brand": "linear-gradient(135deg, #F97316 0%, #EA580C 100%)",
        "gradient-dark": "linear-gradient(180deg, #0A0A0A 0%, #141414 100%)",
      },
      animation: {
        marquee: "marquee 30s linear infinite",
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.4s ease-out",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/aspect-ratio"),
  ],
};
export default config;
