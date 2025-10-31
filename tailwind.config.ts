import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.{md,mdx}",
  ],
  theme: {
    extend: {
      // Map CSS custom properties (from your brand token file) to Tailwind names
      colors: {
        // semantic tokens
        bg: "var(--bg)",
        surface: "var(--surface)",
        "surface-muted": "var(--surface-muted)",
        text: "var(--text)",
        "text-muted": "var(--text-muted)",
        border: "var(--border)",
        "border-muted": "var(--border-muted)",
        ring: "var(--ring)",
        primary: "var(--primary)",
        "primary-foreground": "var(--primary-foreground)",
        "primary-hover": "var(--primary-hover)",
        "primary-active": "var(--primary-active)",
        secondary: "var(--secondary)",
        "secondary-foreground": "var(--secondary-foreground)",
        "secondary-hover": "var(--secondary-hover)",
        "secondary-active": "var(--secondary-active)",

        // your legacy palette (kept for convenience)
        background: "var(--background)",
        foreground: "var(--foreground)",
        navy: {
          950: "#0A0F1E",
          900: "#0F172A",
          200: "#BFDBFE",
        },
        emerald: {
          700: "#047857",
          600: "#059669",
          500: "#10B981",
          400: "#34D399",
          300: "#6EE7B7",
        },
        teal: {
          50: "#F0FDFA",
          600: "#0D9488",
          500: "#14B8A6",
          400: "#2DD4BF",
          300: "#5EEAD4",
        },
        sky: {
          500: "#0EA5E9", // renamed from `blue`
          400: "#38BDF8",
        },
        gray: {
          50: "#F9FAFB",
          100: "#F3F4F6",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
          700: "#374151",
          800: "#1F2937",
          900: "#111827",
          950: "#030712",
        },
      },

      // Ensure ring and border utilities default to your tokens
      ringColor: {
        DEFAULT: "var(--ring)",
      },
      borderColor: {
        DEFAULT: "var(--border)",
      },

      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },

      fontFamily: {
        sans: ["var(--font-work-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },

      // Map spacing + radius tokens
      spacing: {
        base: "8px",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        DEFAULT: "var(--radius)",
        lg: "var(--radius-lg)",
      },
    },
    // Optional: container helpers
    container: {
      center: true,
      padding: "1rem",
      screens: { "2xl": "72rem" },
    },
  },
  plugins: [
    require("flowbite-typography"),
    // Optional: if you want prose styles aligned to tokens, add:
    // require("@tailwindcss/typography"),
  ],
};

export default config;
