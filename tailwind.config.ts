import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        kisan: {
          green: {
            50: "#f0fdf4",
            100: "#dcfce7",
            200: "#bbf7d0",
            300: "#86efac",
            400: "#4ade80",
            500: "#22c55e",
            600: "#16a34a",
            700: "#15803d",
            800: "#166534",
            900: "#14532d",
            950: "#052e16",
          },
          earth: {
            50: "#fdf8f6",
            100: "#f2e8e5",
            200: "#e6d0ca",
            300: "#d4b0a5",
            400: "#be8a7a",
            500: "#a86958",
            600: "#8f5040",
            700: "#774032",
            800: "#64352a",
            900: "#532f27",
            950: "#2d1611",
          },
          yellow: {
            50: "#fefce8",
            100: "#fef9c3",
            200: "#fef08a",
            300: "#fde047",
            400: "#facc15",
            500: "#eab308",
            600: "#ca8a04",
            700: "#a16207",
            800: "#854d0e",
            900: "#713f12",
            950: "#422006",
          },
          cream: {
            50: "#fdfdfb",
            100: "#fbf9f4",
            200: "#f6f1e6",
            300: "#ece1ce",
            400: "#dfcbab",
            500: "#cdaf81",
            600: "#bc9562",
            700: "#ab7f4f",
            800: "#8c6441",
            900: "#715037",
            950: "#3c291c",
          }
        }
      },
      fontFamily: {
        sans: ["var(--font-poppins)", "var(--font-noto-sans-devanagari)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
