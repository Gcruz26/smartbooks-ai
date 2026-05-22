import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand palette - Main Blue (navy) + Accent Orange (sky), white as base.
        // The "navy" name is retained so existing class names continue to work;
        // the underlying ramp is now anchored at #1E3A8A.
        navy: {
          50: "#EFF4FB",
          100: "#DBEAFE", // Light Blue from spec
          200: "#BFD8FB",
          300: "#93BAF6",
          400: "#5E94EA",
          500: "#3970D6",
          600: "#2756C4",
          700: "#2447B0", // lighter than 800 for hover
          800: "#1E3A8A", // PRIMARY - Main Blue
          900: "#152C68",
          950: "#0A1228", // dark-mode background
        },
        // "sky" is retained as a name but now points to the Accent Orange ramp
        // so existing classes (bg-sky-500, text-sky-500, etc.) become orange.
        sky: {
          50: "#FFF7F0",
          100: "#FDEEDD",
          200: "#FADFC4",
          300: "#F4C7A8", // Soft Orange from spec
          400: "#EDB58E",
          500: "#E6A57E", // Accent Orange from spec
          600: "#D38563", // hover state
          700: "#B66B4B",
          800: "#8E523A",
          900: "#693E2C",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.125rem",
      },
      boxShadow: {
        card: "0 1px 3px 0 rgb(15 23 42 / 0.04), 0 1px 2px -1px rgb(15 23 42 / 0.06)",
        "card-hover":
          "0 10px 30px -12px rgb(30 58 138 / 0.18), 0 4px 8px -4px rgb(30 58 138 / 0.08)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out both",
        "fade-in": "fade-in 0.4s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
