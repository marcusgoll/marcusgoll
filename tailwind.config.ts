import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      white: "#ffffff",
      background: "var(--background)",
      foreground: "var(--foreground)",
      // Brand colors using CSS variables
      "navy-900": "var(--navy-900)",
      "emerald-500": "var(--emerald-500)",
      "emerald-600": "var(--emerald-600)",
      "gray-300": "var(--gray-300)",
      "gray-400": "var(--gray-400)",
      "gray-500": "var(--gray-500)",
      // Tailwind default colors needed for utilities
      transparent: "transparent",
      black: "#000000",
    },
  },
  plugins: [],
};

export default config;
