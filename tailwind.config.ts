import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Shared with bubo-site's dark theme, token for token, so the two sites
      // read as one house. Amber is the through-line across the family: it is
      // Bubo's eyes and Omni's phosphor, which is why it replaced the old cyan.
      colors: {
        background: "#12141F",
        surface: "#1A1D2B",
        card: "#1E2333",
        accent: {
          DEFAULT: "#F5B841",
          bright: "#FCD670",
        },
        border: {
          DEFAULT: "#2A3048",
          soft: "#21273A",
        },
        text: {
          primary: "#ECEEF5",
          secondary: "#8A90A6",
          muted: "#565D75",
        }
      },
      fontFamily: {
        // Omni's rule, adopted here: mono means a machine emitted it, sans means
        // a person wrote it. Headings are people talking, so they are display.
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
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
