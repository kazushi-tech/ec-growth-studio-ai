/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          50: "#f4f6fb",
          100: "#e6ebf5",
          200: "#c5d0e4",
          300: "#94a6c8",
          400: "#5b76a5",
          500: "#3a5687",
          600: "#284271",
          700: "#1d3460",
          800: "#13244a",
          900: "#0b1e3f",
          950: "#06122a",
        },
        accent: {
          mint: "#34d399",
          rose: "#f87171",
          gold: "#f59e0b",
          sky: "#38bdf8",
          violet: "#8b5cf6",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "Noto Sans JP",
          "Hiragino Sans",
          "Hiragino Kaku Gothic ProN",
          "Yu Gothic",
          "Meiryo",
          "system-ui",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 1px 2px rgba(15, 23, 42, 0.04), 0 1px 3px rgba(15, 23, 42, 0.06)",
        cardLg:
          "0 8px 24px -8px rgba(15, 23, 42, 0.16), 0 2px 6px rgba(15, 23, 42, 0.06)",
      },
    },
  },
  plugins: [],
};
