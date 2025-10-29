import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.{md,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        navy: {
          900: "#0F172A",
          950: "#020617",
        },
        emerald: {
          600: "#059669",
          700: "#047857",
        },
        sky: {
          500: "#0EA5E9",
          600: "#0284C7",
          blue: "#0EA5E9",
        },
        purple: {
          600: "#9333EA",
        },
        gray: {
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
          700: "#374151",
        },
      },
      fontFamily: {
        sans: ["var(--font-work-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      spacing: {
        base: "8px",
      },
    },
  },
  plugins: [],
};

export default config;
