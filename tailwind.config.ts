import type { Config } from "tailwindcss";

const config: Config = {
  // A touch device fires hover on tap and then leaves it stuck on whatever was
  // last touched, so a phone shows a hovered nav link the user never hovered.
  // This gates every hover: utility behind @media (hover: hover).
  future: {
    hoverOnlyWhenSupported: true,
  },
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
      // Values live in globals.css so one token set serves both themes. See the
      // comment there for why they are triplets and not hex.
      colors: {
        background: "rgb(var(--c-background) / <alpha-value>)",
        surface: "rgb(var(--c-surface) / <alpha-value>)",
        card: "rgb(var(--c-card) / <alpha-value>)",
        accent: {
          DEFAULT: "rgb(var(--c-accent) / <alpha-value>)",
          bright: "rgb(var(--c-accent-bright) / <alpha-value>)",
        },
        border: {
          DEFAULT: "rgb(var(--c-border) / <alpha-value>)",
          soft: "rgb(var(--c-border-soft) / <alpha-value>)",
        },
        text: {
          primary: "rgb(var(--c-text-primary) / <alpha-value>)",
          secondary: "rgb(var(--c-text-secondary) / <alpha-value>)",
          muted: "rgb(var(--c-text-muted) / <alpha-value>)",
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
