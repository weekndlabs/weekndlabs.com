import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { SectionFadeIn } from '@/components/SectionFadeIn';
import { totalStars, starClause } from '@/lib/stars';
import { parseCommit } from '@/lib/commits';

export const revalidate = 3600;

// Public product repos. ForgePod is private, so it has no stars or feed.
const PRODUCT_REPOS = [
  'fajarhide/selat',
  'fajarhide/omni',
  'fajarhide/heimsense',
  'fajarhide/bubo',
  'fajarhide/ai-pr-describer',
];

// What the hero counts: public repo, permissive licence, nothing to pay later.
// Bubo and ForgePod ship too, but their repos are private, so they are not part
// of the open-source claim and `hero-count.test.js` holds that line.
const OPEN_SOURCE_TOOLS = ['selat', 'omni', 'heimsense', 'ai-pr-describer', 'design-system'];
const COUNT_WORD = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven'];

// One command per product in focus, in the order the cards appear.
const INSTALL = [
  { label: 'start with selat', command: 'npx @fajarhide/selat' },
  { label: 'or with omni', command: 'brew install fajarhide/tap/omni' },
];

// Shipped and maintained, just not where this month goes.
const SHIPPED = [
  {
    title: 'Heimsense',
    description: 'Point Claude Code at any LLM. A Go proxy that routes your agent traffic to whichever model you actually want to pay for.',
    version: 'v0.1.3',
    href: 'https://github.com/fajarhide/heimsense',
  },
  {
    title: 'Bubo',
    description: 'Names the app making your Mac heavy and quits it in one click. Menu bar only, no daemon.',
    version: 'v1.4',
    href: 'https://bubo.weekndlabs.com',
  },
  {
    title: 'ForgePod',
    description: 'Write down the assumption, ship the smallest thing that tests it, then watch what users do instead of what they said they would.',
    version: 'Beta',
    href: 'https://forgepod.dev',
  },
  {
    title: 'AI PR Describer',
    description: 'Reads the diff and writes the pull request description. Any OpenAI-compatible model, one step from the Actions marketplace.',
    version: 'v1.1.4',
    href: 'https://github.com/marketplace/actions/ai-pull-request-describer',
  },
  {
    title: 'Design System',
    description: 'Colour, type and spacing tokens behind every product here. A test fails the build when a contrast ratio drops below WCAG.',
    version: 'v0.5.0',
    href: '/design',
  },
];

// The site repo ships often, so it earns a place in the activity feed.
const ACTIVITY_REPOS = [...PRODUCT_REPOS, 'weekndlabs/weekndlabs.com'];

type CommitResponse = { commit: { message: string; author: { date: string } } }[];

type Activity = { message: string; repo: string; date: string };

async function getRepoStars(repo: string): Promise<number | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${repo}`, {
      headers: { Accept: 'application/vnd.github+json' },
      next: { revalidate },
    });
    if (!res.ok) return null;
    const { stargazers_count } = (await res.json()) as { stargazers_count?: number };
    return typeof stargazers_count === 'number' ? stargazers_count : null;
  } catch {
    return null;
  }
}

// Aggregation rule and its test live in lib/stars.js.
async function getTotalStars(): Promise<number | null> {
  return totalStars(await Promise.all(PRODUCT_REPOS.map(getRepoStars)));
}

async function getLatestCommit(repo: string): Promise<Activity | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${repo}/commits?per_page=5`, {
      headers: { Accept: 'application/vnd.github+json' },
      next: { revalidate },
    });
    if (!res.ok) return null;
    const commits = (await res.json()) as CommitResponse;
    if (!Array.isArray(commits)) return null;
    // A merge commit is the tip of every repo that takes pull requests, and it
    // says nothing about what shipped. Walk past it to the commit that does.
    const shipped = commits.find((c) => !c.commit.message.startsWith('Merge '));
    if (!shipped) return null;
    const { message, author } = shipped.commit;
    return { message: message.split('\n')[0], repo, date: author.date };
  } catch {
    return null;
  }
}

async function getActivity(): Promise<Activity[]> {
  const commits = await Promise.all(ACTIVITY_REPOS.map(getLatestCommit));
  return commits
    .filter((c): c is Activity => c !== null)
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
    .slice(0, 4);
}

function ago(iso: string) {
  const days = Math.round((Date.parse(iso) - Date.now()) / 86_400_000);
  return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(days, 'day');
}

// Every section opens the same way: the heading on the rule, and on the right
// the one link that section is asking you to follow.
function SectionHeading({ title, action }: { title: string; action?: { label: string; href: string } }) {
  return (
    <div className="mb-8 md:mb-12 flex items-end justify-between gap-6 border-b border-border pb-4">
      <h2 className="font-display text-2xl md:text-3xl text-foreground">{title}</h2>
      {action && (
        <a
          href={action.href}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-xs text-muted-foreground hover:text-brand transition-colors shrink-0 pb-1"
        >
          {action.label}
        </a>
      )}
    </div>
  );
}

export default async function Home() {
  const [stars, activity] = await Promise.all([getTotalStars(), getActivity()]);

  return (
    <div className="flex flex-col gap-20 md:gap-28 pb-20 md:pb-28 top-0 relative">
      <SectionFadeIn className="pt-16 md:pt-28 px-6 max-w-5xl mx-auto text-center flex flex-col items-center">
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-display text-foreground mb-6 leading-tight tracking-tight text-balance">
          Reliable infrastructure for the agentic era<span className="text-brand">.</span>
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 md:mb-10 leading-relaxed text-pretty">
          {COUNT_WORD[OPEN_SOURCE_TOOLS.length]} open-source tools you can keep: a gateway between
          your agents and every upstream, agent context, LLM routing, pull request automation, and
          the design system under all of it. All MIT and Apache 2.0
          {starClause(stars)}. None of it is a trial, and every number we publish is
          measured on a real corpus and replays
          on yours.
        </p>
        <div className="flex flex-wrap gap-4 justify-center w-full sm:w-auto">
          <Button href="#products" variant="filled">
            See the tools
          </Button>
          <Button href="https://github.com/sponsors/fajarhide" variant="outlined" className="lg:hidden">
            Sponsor
          </Button>
        </div>
      </SectionFadeIn>

      <SectionFadeIn id="products" className="px-6 max-w-5xl mx-auto w-full">
        <SectionHeading title="What we ship" action={{ label: 'github.com/weekndlabs', href: 'https://github.com/weekndlabs' }} />

        {/* Two products get the week, and the page says which two rather than
            spreading seven equal cards and letting the reader guess. */}
        <div className="mb-4 flex items-center gap-4">
          <Badge label="In focus" />
          <div className="h-px flex-grow bg-border" aria-hidden="true" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <Card
            featured
            title="Selat"
            description="One gateway between your agents and every upstream. Connect GitHub, Google or Discord once from a browser: Selat seals the OAuth, refreshes the tokens, and never rotates the bearer your agent already holds. MCP and REST see the same catalog, so Claude Desktop and a runtime you wrote yourself call the same tools."
            version="v0.1.2"
            tags={['TypeScript', 'MCP', 'OAuth', 'Gateway']}
            linkHref="https://selat.weekndlabs.com"
          />
          <Card
            featured
            title="Omni"
            description="Stop paying to re-read the same output. Omni turns repeated bytes into retrievable handles: 97.2% off a file your agent reads twice, 14.9% across 6,656 real commands. Nothing deleted, nothing invented, and a failing command is never touched."
            version="v0.7.3"
            tags={['Rust', 'Agentic AI', 'MCP', 'Context Engine']}
            linkHref="https://omni.weekndlabs.com"
          />
        </div>
        <div className="mt-4 md:mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {INSTALL.map(({ label, command }) => (
            <div key={label} className="flex items-center gap-3">
              <p className="font-mono text-xs text-muted-foreground shrink-0">{label}</p>
              <pre className="border border-border bg-muted rounded-lg px-4 py-3 font-mono text-sm text-brand overflow-x-auto flex-grow">
                <code>{command}</code>
              </pre>
            </div>
          ))}
        </div>

        {/* The rest are shipped and maintained, not paused. They read as rows
            because a row cannot leave a hole in a grid, and because five equal
            cards under two large ones only muddies which is which. */}
        <div className="mt-12 md:mt-16 mb-4 flex items-center gap-4">
          <h3 className="font-mono text-xs uppercase text-muted-foreground">Also shipped</h3>
          <div className="h-px flex-grow bg-border" aria-hidden="true" />
        </div>
        <ul className="border border-border rounded-lg bg-muted divide-y divide-border list-none pl-0 overflow-hidden">
          {SHIPPED.map((tool) => (
            <li key={tool.title}>
              <a
                href={tool.href}
                {...(tool.href.startsWith('/') ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
                className="group flex flex-col gap-1 px-4 py-4 sm:flex-row sm:items-baseline sm:gap-6 hover:bg-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-inset"
              >
                <span className="font-display text-foreground w-40 shrink-0 group-hover:text-brand transition-colors">
                  {tool.title}
                </span>
                <span className="text-sm text-muted-foreground flex-grow">{tool.description}</span>
                <span className="font-mono text-xs text-muted-foreground shrink-0 sm:w-16 sm:text-right">
                  {tool.version}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </SectionFadeIn>

      <SectionFadeIn id="philosophy" className="px-6 max-w-5xl mx-auto w-full">
        <div className="rounded-lg border border-border bg-muted p-8 md:p-12 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="max-w-2xl">
            <h2 className="font-display text-2xl md:text-3xl text-foreground mb-4">
              Engineering for builders<span className="text-brand">.</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Every tool here ships under MIT or Apache 2.0. Read the code, fork it, run it in
              production, and never ask us for permission.
            </p>
          </div>
          <Button href="/philosophy" variant="outlined" className="shrink-0 self-start md:self-auto">
            Read our philosophy
          </Button>
        </div>
      </SectionFadeIn>

      {activity.length > 0 && (
        <SectionFadeIn id="activity" className="px-6 max-w-5xl mx-auto w-full">
          <SectionHeading title="Recent activity" />
          <ul className="border border-border rounded-lg bg-muted divide-y divide-border list-none pl-0 overflow-hidden">
            {activity.map((item) => {
              const { type, subject } = parseCommit(item.message);
              return (
                <li
                  key={`${item.repo}-${item.date}`}
                  className="px-4 py-3.5 flex flex-col sm:flex-row gap-1.5 sm:gap-4 sm:items-baseline justify-between font-mono text-sm hover:bg-background transition-colors"
                >
                  <div className="flex items-baseline gap-3 min-w-0">
                    <span
                      className={`shrink-0 w-12 text-xs uppercase ${
                        type?.startsWith('fix') ? 'text-brand-strong' : 'text-muted-foreground'
                      }`}
                    >
                      {type ?? '\u00B7'}
                    </span>
                    <span className="text-foreground truncate">{subject}</span>
                  </div>
                  <div className="flex items-baseline gap-4 shrink-0 text-xs text-muted-foreground pl-[3.75rem] sm:pl-0">
                    <span>{item.repo}</span>
                    <span>{ago(item.date)}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </SectionFadeIn>
      )}

    </div>
  )
}
