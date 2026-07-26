import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { SectionFadeIn } from '@/components/SectionFadeIn';

export const revalidate = 3600;

// Public product repos. ForgePod is private, so it has no stars or feed.
const PRODUCT_REPOS = [
  'fajarhide/omni',
  'fajarhide/heimsense',
  'fajarhide/bubo',
  'fajarhide/ai-pr-describer',
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

// Sum across the public product repos. Returns null if any lookup fails, so we
// never render a total that silently under-counts.
async function getTotalStars(): Promise<number | null> {
  const counts = await Promise.all(PRODUCT_REPOS.map(getRepoStars));
  if (counts.some((c) => c === null)) return null;
  return counts.reduce((sum: number, c) => sum + c!, 0);
}

async function getLatestCommit(repo: string): Promise<Activity | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${repo}/commits?per_page=1`, {
      headers: { Accept: 'application/vnd.github+json' },
      next: { revalidate },
    });
    if (!res.ok) return null;
    const commits = (await res.json()) as CommitResponse;
    if (!Array.isArray(commits) || commits.length === 0) return null;
    const { message, author } = commits[0].commit;
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
    .slice(0, 3);
}

function ago(iso: string) {
  const days = Math.round((Date.parse(iso) - Date.now()) / 86_400_000);
  return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(days, 'day');
}

export default async function Home() {
  const [stars, activity] = await Promise.all([getTotalStars(), getActivity()]);

  return (
    <div className="flex flex-col gap-16 md:gap-32 pb-16 md:pb-24 top-0 relative">
      <SectionFadeIn className="pt-16 md:pt-32 px-6 max-w-5xl mx-auto text-center flex flex-col items-center">
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-display text-text-primary mb-6 leading-tight tracking-tight">
          Reliable infrastructure for the agentic era.
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-8 md:mb-10 leading-relaxed">
          Five tools running in production: agent context, LLM routing, pull request automation,
          macOS performance, and founder workflow. Open source under MIT and Apache 2.0,
          with {stars ?? '300+'} stars on GitHub.
        </p>
        <div className="flex flex-wrap gap-4 justify-center w-full sm:w-auto">
          <Button href="#products" variant="filled">
            See the tools
          </Button>
          <Button href="https://github.com/sponsors/fajarhide" variant="outlined" className="sm:hidden">
            Sponsor
          </Button>
        </div>
      </SectionFadeIn>

      <SectionFadeIn id="products" className="px-6 max-w-4xl mx-auto w-full">
        <div className="mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-display text-text-primary mb-4">What we ship</h2>
          <div className="h-px w-24 bg-border"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          <Card
            title="Omni"
            description="Noise-canceling context and long-term memory for AI agents. Cuts a real command mix by 58.9%, leaves JSON and YAML untouched, and passes failing commands through verbatim so no error ever gets compressed away."
            badgeLabel="SHIPPED v0.6.6"
            tags={['Rust', 'Agentic AI', 'MCP', 'Context Engine']}
            linkHref="https://omni.weekndlabs.com"
          />
          <Card
            title="Heimsense"
            description="Point Claude Code at any LLM. A Go proxy that routes your agent traffic to whichever model you actually want to pay for."
            badgeLabel="SHIPPED v0.1.3"
            tags={['Go', 'Proxy', 'Router', 'API-Adapter', '9Router']}
            linkHref="https://github.com/fajarhide/heimsense"
          />
          <Card
            title="Bubo"
            description="Tiny macOS menu-bar monitor that names the app making your Mac heavy and quits it in one click. Apple Silicon & Intel, no daemon."
            badgeLabel="SHIPPED v1.2"
            tags={['Swift', 'SwiftUI', 'macOS', 'Menu Bar', 'IOReport', 'SMC']}
            linkHref="https://bubo.weekndlabs.com"
          />
          <Card
            title="ForgePod"
            description="An AI-guided workflow for founders. Write down the assumption, ship the smallest thing that tests it, then watch what users actually do instead of what they said they would."
            badgeLabel="SHIPPED Beta MVP"
            tags={['AI', 'Product-Market Fit', 'Lean Startup', 'MVP', 'Growth', 'SaaS']}
            linkHref="https://forgepod.dev"
          />
          <Card
            title="AI PR Describer"
            description="Reads the diff and writes the pull request description. Works with any OpenAI-compatible model, installs from the GitHub Actions marketplace in one step."
            badgeLabel="SHIPPED v1.1.4"
            tags={['AI', 'Developer Tools', 'GitHub Actions']}
            linkHref="https://github.com/marketplace/actions/ai-pull-request-describer"
          />
        </div>
        <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-3">
          <p className="font-mono text-xs text-text-muted shrink-0">start with omni</p>
          <pre className="border border-border bg-surface rounded px-4 py-3 font-mono text-sm text-accent overflow-x-auto flex-grow">
            <code>brew install fajarhide/tap/omni</code>
          </pre>
        </div>
      </SectionFadeIn>

      <SectionFadeIn id="philosophy" className="px-6 max-w-4xl mx-auto w-full text-center py-8">
        <h2 className="text-2xl font-display text-text-primary mb-6">Engineering for builders.</h2>
        <p className="text-text-secondary mb-8">
          Every tool here ships under MIT or Apache 2.0. Read the code, fork it, run it in production, and never ask us for permission.
        </p>
        <div className="flex justify-center">
          <Button href="/philosophy" variant="outlined">
            Read our philosophy
          </Button>
        </div>
      </SectionFadeIn>

      {activity.length > 0 && (
        <SectionFadeIn id="activity" className="px-6 max-w-4xl mx-auto w-full">
          <h2 className="text-xl font-display text-text-primary mb-6">Recent activity</h2>
          <ul className="border border-border rounded bg-surface divide-y divide-border list-none pl-0">
            {activity.map((item) => (
              <li key={`${item.repo}-${item.date}`} className="p-4 flex flex-col sm:flex-row gap-2 sm:items-center justify-between font-mono text-sm hover:bg-background transition-colors">
                <div className="flex items-start gap-4">
                  <span className={`shrink-0 mt-0.5 sm:mt-0 ${item.message.startsWith('fix') ? 'text-accent-bright' : 'text-accent'}`}>
                    {item.message.startsWith('fix') ? '🐛' : '⚡'}
                  </span>
                  <span className="text-text-primary">{item.message}</span>
                </div>
                <div className="flex items-center gap-4 shrink-0 mt-2 sm:mt-0 ml-8 sm:ml-0">
                  <span className="px-2 py-0.5 bg-background border border-border rounded text-text-muted text-xs">{item.repo}</span>
                  <span className="text-text-muted text-xs">{ago(item.date)}</span>
                </div>
              </li>
            ))}
          </ul>
        </SectionFadeIn>
      )}

    </div>
  )
}
