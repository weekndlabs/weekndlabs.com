import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { HeroVisual } from '@/components/HeroVisual';
import { SectionFadeIn } from '@/components/SectionFadeIn';
import { totalStars, starClause } from '@/lib/stars';
import { parseCommit } from '@/lib/commits';
import { githubHeaders, warnGithub } from '@/lib/github';
import { CATEGORY_NOTES, byCategory, starRepos } from '@/lib/products';
import type { ProductGroup } from '@/lib/products';

export const revalidate = 3600;

// The catalog, the categories and the rule about which repos are safe to count
// all live in lib/products.js now. See issue #28.
const PRODUCT_REPOS: string[] = starRepos();

// One command per product in focus, in the order the cards appear.
const INSTALL = [
  { label: 'start with selat', command: 'npx @fajarhide/selat' },
  { label: 'or with omni', command: 'brew install fajarhide/tap/omni' },
];

// The site repo ships often, so it earns a place in the activity feed.
const ACTIVITY_REPOS = [...PRODUCT_REPOS, 'weekndlabs/weekndlabs.com'];

type CommitResponse = { commit: { message: string; author: { date: string } } }[];

type Activity = { message: string; repo: string; date: string };

async function getRepoStars(repo: string): Promise<number | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${repo}`, {
      headers: githubHeaders(process.env.GITHUB_TOKEN),
      next: { revalidate },
    });
    if (!res.ok) {
      warnGithub('stars', repo, `${res.status} ${res.statusText}`);
      return null;
    }
    const { stargazers_count } = (await res.json()) as { stargazers_count?: number };
    return typeof stargazers_count === 'number' ? stargazers_count : null;
  } catch (reason) {
    warnGithub('stars', repo, reason);
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
      headers: githubHeaders(process.env.GITHUB_TOKEN),
      next: { revalidate },
    });
    if (!res.ok) {
      warnGithub('commits', repo, `${res.status} ${res.statusText}`);
      return null;
    }
    const commits = (await res.json()) as CommitResponse;
    if (!Array.isArray(commits)) return null;
    // A merge commit is the tip of every repo that takes pull requests, and it
    // says nothing about what shipped. Walk past it to the commit that does.
    const shipped = commits.find((c) => !c.commit.message.startsWith('Merge '));
    if (!shipped) return null;
    const { message, author } = shipped.commit;
    return { message: message.split('\n')[0], repo, date: author.date };
  } catch (reason) {
    warnGithub('commits', repo, reason);
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
      {/* Wider than everything below it, and deliberately so: this is the only
          two-column section on the page, and the graph needs the second half. */}
      <SectionFadeIn className="pt-16 md:pt-24 px-6 max-w-6xl mx-auto w-full grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display text-foreground mb-6 leading-tight tracking-tight text-balance">
            Reliable infrastructure for the agentic era<span className="text-brand">.</span>
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mb-8 md:mb-10 leading-relaxed text-pretty">
            A gateway for the credentials your agents hold, a context layer for what they read
            twice, and routing for the models they call. All of it open source under MIT and
            Apache 2.0{starClause(stars)}. Nothing here is a trial, and every number we publish is
            measured on a real corpus and replays
            on yours.
          </p>
          <div className="flex flex-wrap gap-4 justify-center lg:justify-start w-full sm:w-auto">
            <Button href="#products" variant="filled">
              See what we ship
            </Button>
            <Button href="https://github.com/sponsors/fajarhide" variant="outlined" className="lg:hidden">
              Sponsor
            </Button>
          </div>
        </div>

        {/* Fixed height, so the box is the same size before and after the scene
            loads and nothing under it moves. */}
        <div className="h-64 sm:h-80 lg:h-[26rem] w-full">
          <HeroVisual />
        </div>
      </SectionFadeIn>

      <SectionFadeIn id="products" className="px-6 max-w-5xl mx-auto w-full">
        <SectionHeading title="What we ship" action={{ label: 'github.com/weekndlabs', href: 'https://github.com/weekndlabs' }} />

        {/* One axis, not two. This section used to split on "In focus" and
            "Also shipped", which said which two products got the month and
            nothing about what any of them do. The categories are the ones the
            nav menu uses, and each opens by saying what that layer is for. */}
        <div className="flex flex-col gap-12 md:gap-16">
          {byCategory().map(({ category, items }: ProductGroup) => {
            const featured = items.filter((product) => product.focus);
            const rows = items.filter((product) => !product.focus);

            return (
              <div key={category}>
                <div className="mb-5 md:mb-6 border-b border-border pb-4">
                  <h3 className="font-mono text-xs uppercase text-muted-foreground">{category}</h3>
                  <p className="mt-2.5 max-w-3xl text-foreground leading-relaxed text-pretty">
                    {CATEGORY_NOTES[category]}
                  </p>
                </div>

                {featured.length > 0 && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                      {featured.map((product) => (
                        <Card
                          key={product.name}
                          featured
                          title={product.name}
                          description={product.description}
                          version={product.version}
                          tags={product.tags}
                          linkHref={product.href}
                        />
                      ))}
                    </div>

                    {/* The commands sit with the cards they install, which is
                        the only group that has any. */}
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
                  </>
                )}

                {/* Rows, because a row cannot leave a hole in a grid and equal
                    cards under the two large ones only muddy which is which. */}
                {rows.length > 0 && (
                  <ul className="border border-border rounded-lg bg-muted divide-y divide-border list-none pl-0 overflow-hidden">
                    {rows.map((product) => (
                      <li key={product.name}>
                        <a
                          href={product.href}
                          {...(product.href.startsWith('/') ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
                          className="group flex flex-col gap-1 px-4 py-4 sm:flex-row sm:items-baseline sm:gap-6 hover:bg-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-inset"
                        >
                          <span className="font-display text-foreground w-40 shrink-0 group-hover:text-brand transition-colors">
                            {product.name}
                          </span>
                          <span className="text-sm text-muted-foreground flex-grow">{product.description}</span>
                          <span className="font-mono text-xs text-muted-foreground shrink-0 sm:w-16 sm:text-right">
                            {product.version}
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
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
