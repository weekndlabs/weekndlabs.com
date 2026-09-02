# weekndlabs.com

The site behind [weekndlabs.com](https://weekndlabs.com). Open-source
infrastructure for agents: a gateway for the credentials they hold, a context
layer for what they read twice, and routing for the models they call.

Everything the lab ships is listed on the site itself and in
[github.com/weekndlabs](https://github.com/weekndlabs). This README does not
repeat the catalog, because a copy of it here goes stale the moment the shelf
grows. That is the same failure `lib/hero-count.test.js` was written for.

[Read the commitment to open source](https://weekndlabs.com/philosophy)

## The stack

- **Framework**: Next.js 14, App Router.
- **Design**: [`@weekndlabs/design`](https://design.weekndlabs.com) owns every
  colour, radius, spacing step and type token. `app/globals.css` declares none of
  its own on purpose: a value defined here is one the package's contrast gate
  cannot measure, which is how something that fails WCAG AA ships with the tests
  green. See #16.
- **Hero**: a [three.js](https://threejs.org) scene in
  `components/HeroGraph.tsx`. Agents on the left, one gateway in the middle,
  tools on the right, and particles carrying requests through it. Loaded through
  `next/dynamic` with `ssr: false`, so it stays out of the first load. It draws a
  single static frame under `prefers-reduced-motion`, and stops entirely when the
  tab is hidden or the canvas scrolls out of view.
- **Live data**: star counts and recent commits come from the GitHub API on an
  hourly revalidation. When a lookup fails the page drops the affected line
  rather than substituting a stale number, and writes a `[github]` line to the
  log so the drop is visible.

## Local development

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Configuration

One optional environment variable.

| variable | effect |
| --- | --- |
| `GITHUB_TOKEN` | Raises the GitHub API budget from 60 requests an hour per IP to 5000. |

The homepage makes nine calls per hourly revalidation. Without a token those nine
come out of an anonymous budget shared with everything else leaving the same IP,
and on a shared serverless pool that can run out. A read-only token with no
scopes is enough. See #4.

## Checks

```bash
npm run lint
npm test
npm run build
```

All three run on every pull request and on pushes to `main`
(`.github/workflows/ci.yml`). Several of the tests exist because the thing they
guard already shipped once: `lib/stars.test.js` for a hardcoded star count,
`lib/hero-count.test.js` for a tool count that went stale twice, and
`lib/readme.test.js` for this file.

## Licensing

The tools and this site are open source under the [MIT License](LICENSE).
