# WeekndLabs

> **Agents run here.** Five shipped developer tools for the agentic era, open source and built in Indonesia.

WeekndLabs is an open-source agentic AI lab building foundational developer tools that run directly on your machines. No VC roadmap theater, no opaque enterprise sales calls, and no bullshit.

## Philosophy

We believe that foundational developer tools should not be gated behind arbitrary paywalls. Open source is not just a distribution strategy for us—it's a strict commitment to the builders who trust our stack.

[-> Read our full commitment to open source](https://weekndlabs.com/philosophy)

## The Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: TailwindCSS. Colour tokens live in [`app/globals.css`](app/globals.css) as RGB triplets, so one set serves both themes and Tailwind's alpha modifiers still resolve.
- **Typography**: [Bricolage Grotesque](https://fonts.google.com/specimen/Bricolage+Grotesque) for headings, [Inter](https://fonts.google.com/specimen/Inter) for body, [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) for anything a machine emitted: commands, versions, tags, commit subjects.
- **Themes**: light and dark. Follows the OS by default; the nav toggle overrides it and the choice persists. Amber on navy in the dark, the same amber deepened to hold as text on paper in the light.
- **Live data**: star counts and recent commits come from the GitHub API on an hourly ISR revalidation. When a lookup fails the page drops the affected line rather than substituting a stale number.
- **SEO & PWA**: Dynamic Open Graph Images (`next/og`), Native Manifest Generation

## Local Development

First, run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Configuration

One optional environment variable.

| variable | effect |
| --- | --- |
| `GITHUB_TOKEN` | Raises the GitHub API budget from 60 requests an hour per IP to 5000. |

The homepage makes nine calls per hourly revalidation. Without a token those nine
come out of an anonymous budget shared with everything else leaving the same IP,
and on a shared serverless pool that can run out. When it does, the star count and
the activity feed drop out of the page and a `[github]` line lands in the deploy
log. A read-only token with no scopes is enough.

## Licensing

The tools and website are open-source and released under the [MIT License](LICENSE).
