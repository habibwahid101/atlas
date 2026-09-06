import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        coral: {
          DEFAULT: "#E11D48",
          50: "#FFF1F3",
          100: "#FFE4E8",
          600: "#E11D48",
          700: "#BE123C",
        },
        sand: {
          50: "#FAF8F5",
          100: "#F5F1EB",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
      },
      borderRadius: {
        card: "14px",
        pill: "9999px",
      },
      boxShadow: {
        soft: "0 8px 30px rgba(15, 23, 42, 0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
