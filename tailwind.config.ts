import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#080808",
        surface: "#111111",
        accent: {
          cyan: "#00FFD1",
          amber: "#FFB800",
        },
        border: {
          DEFAULT: "#1E1E1E",
        },
        text: {
          primary: "#F0F0F0",
          secondary: "#888888",
          muted: "#444444",
        }
      },
      fontFamily: {
        mono: ['var(--font-jetbrains)', 'monospace'],
        sans: ['var(--font-geist)', 'sans-serif'],
      },
      borderRadius: {
        sm: '2px',
        DEFAULT: '4px',
        md: '4px',
        lg: '4px',
        xl: '4px',
        '2xl': '4px',
        '3xl': '4px',
        full: '9999px',
      },
      boxShadow: {
        scrim: "none",
        sm: "none",
        DEFAULT: "none",
        md: "none",
        lg: "none",
        xl: "none",
        "2xl": "none",
        inner: "none",
      }
    },
  },
  plugins: [],
};
export default config;
