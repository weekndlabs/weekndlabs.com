import type { Config } from "tailwindcss";
import design from "@weekndlabs/design/tailwind";

const config: Config = {
  // A touch device fires hover on tap and then leaves it stuck on whatever was
  // last touched, so a phone shows a hovered nav link the user never hovered.
  // This gates every hover: utility behind @media (hover: hover).
  future: {
    hoverOnlyWhenSupported: true,
  },
  // Colour, spacing, radius and the type scale all arrive from the design
  // package. Everything below is either a site-level alias onto a package token,
  // or a decision that is this site's and not the system's.
  presets: [design],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // The system has one accent, the blue that also serves `ring` and
        // `chart-1`. This site uses it as a brand mark on headings, links and
        // code, which `ring` does not describe, so it gets a name here.
        //
        // Not called `accent`. In shadcn's vocabulary, which this package
        // follows, `--accent` is the dim hover surface and naming a brand
        // colour after it is the mistake the package's own docs warn about.
        brand: {
          DEFAULT: "var(--wl-ring)",
          // One step up, for the badge and the emphasis word. Mixing toward the
          // ink is the package's documented way to gain contrast in both
          // themes; subtracting lightness only works on a light ground.
          strong: "color-mix(in oklch, var(--wl-ring) 78%, var(--wl-foreground))",
        },
      },
      borderRadius: {
        // The package ships control/card/window. These are the Tailwind names
        // the markup already uses, pointed at those steps, so `rounded-sm` is a
        // control and `rounded-lg` is a card rather than an arbitrary pixel.
        sm: "var(--wl-radius-control)",
        DEFAULT: "var(--wl-radius-control)",
        md: "var(--wl-radius-card)",
        lg: "var(--wl-radius-card)",
        xl: "var(--wl-radius-window)",
        "2xl": "var(--wl-radius-window)",
        "3xl": "var(--wl-radius-window)",
      },
      fontFamily: {
        // Omni's rule, adopted here: mono means a machine emitted it, sans means
        // a person wrote it. Headings are people talking, and one family covers
        // both because Inter's optical size axis reshapes the letterforms as the
        // size grows. Bricolage Grotesque is gone with 0.4.0.
        display: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        // Separation here is a hairline, never a shadow. The system reserves
        // shadow for things that genuinely float, and this site has none.
        scrim: "none",
        sm: "none",
        DEFAULT: "none",
        md: "none",
        lg: "none",
        xl: "none",
        "2xl": "none",
        inner: "none",
      },
    },
  },
  plugins: [],
};
export default config;
