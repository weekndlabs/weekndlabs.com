import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { HeroVisual } from '@/components/HeroVisual';
import { SectionFadeIn } from '@/components/SectionFadeIn';
import { totalStars, starClause } from '@/lib/stars';
import { releaseCount, uniqueContributors } from '@/lib/traction';
import { githubHeaders, warnGithub } from '@/lib/github';
import { CATEGORY_NOTES, PRODUCTS, byCategory, starRepos } from '@/lib/products';
import type { ProductGroup } from '@/lib/products';

export const revalidate = 3600;

// The catalog, the categories and the rule about which repos are safe to count
// all live in lib/products.js now. See issue #28.
const PRODUCT_REPOS: string[] = starRepos();

// The three an agent runs on get the stack section. Everything else is a row.
const STACK = PRODUCTS.filter((product) => product.layer);
const COUNTED = PRODUCTS.filter((product) => product.repo).map((product) => product.name);

const INSTALL = [
  { label: 'start with selat', command: 'npx @fajarhide/selat' },
  { label: 'or with omni', command: 'brew install fajarhide/tap/omni' },
];

// Already published on /terms-of-service. A link and not a form: a form needs
// a mail route, spam handling and a success state, and none of that exists.
const CONTACT = 'mailto:hi@weekndlabs.com';

const FAQ = [
  {
    q: 'Is the stack open source?',
    a: 'Yes. Selat and Omni are Apache 2.0 and Heimsense is MIT. The build you download is the one we run.',
  },
  {
    q: 'Do the three layers need each other?',
    a: 'No. Each is a separate product with its own install and its own release cycle. Run one, or all three under the same agent.',
  },
  {
    q: 'How does WeekndLabs make money?',
    a: 'Selat runs hosted for teams who would rather not operate a gateway, priced on tool calls rather than seats. GitHub Sponsors is the other channel. The self-hosted build has no paid edition.',
  },
  {
    q: 'Can I check the numbers on this page?',
    a: 'The counts come from the GitHub API and refresh every hour. Omni measures its savings on a recorded corpus and ships the same measurement, so it replays on your own history.',
  },
  {
    q: 'How do I work with you?',
    a: 'Write to hi@weekndlabs.com about partnerships, integrations or investment. Security reports go to security@weekndlabs.com.',
  },
];

// Every count on the page comes through here, so a rate limit and a renamed
// repo leave the same one-line trace. See issue #4.
async function github(what: string, repo: string, path = ''): Promise<Response | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${repo}${path}`, {
      headers: githubHeaders(process.env.GITHUB_TOKEN),
      next: { revalidate },
    });
    if (res.ok) return res;
    warnGithub(what, repo, `${res.status} ${res.statusText}`);
  } catch (reason) {
    warnGithub(what, repo, reason);
  }
  return null;
}

async function getRepoStars(repo: string): Promise<number | null> {
  const res = await github('stars', repo);
  if (!res) return null;
  const { stargazers_count } = (await res.json()) as { stargazers_count?: number };
  return typeof stargazers_count === 'number' ? stargazers_count : null;
}

async function getReleaseCount(repo: string): Promise<number | null> {
  const res = await github('releases', repo, '/releases?per_page=1');
  if (!res) return null;
  const page = (await res.json()) as unknown[];
  return releaseCount(res.headers.get('link'), Array.isArray(page) ? page.length : undefined);
}

// ponytail: one page of 100. A repo with more contributors than that
// undercounts, so follow the Link header when one gets there.
async function getContributors(repo: string): Promise<string[] | null> {
  const res = await github('contributors', repo, '/contributors?per_page=100');
  if (!res) return null;
  const people = (await res.json()) as { login: string }[];
  return Array.isArray(people) ? people.map((person) => person.login) : null;
}

const each = <T,>(get: (repo: string) => Promise<T>) => Promise.all(PRODUCT_REPOS.map(get));

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

const Connector = () => <div className="mx-auto h-5 w-px bg-border" aria-hidden="true" />;

const inlineLink =
  'text-brand underline underline-offset-4 hover:text-brand-strong transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm';

export default async function Home() {
  const [stars, releases, contributors] = await Promise.all([
    each(getRepoStars).then(totalStars),
    each(getReleaseCount).then(totalStars),
    each(getContributors).then(uniqueContributors),
  ]);

  // A count that could not be read in full is dropped, tile and all.
  const proof = [
    { value: stars, label: 'GitHub stars' },
    { value: contributors, label: 'contributors' },
    { value: releases, label: 'releases shipped' },
  ].filter((tile): tile is { value: number; label: string } => tile.value !== null);

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
            Apache 2.0{starClause(stars)}. The build you run yourself is the complete one, never a
            trial, and every number we publish is
            measured on a real corpus and replays
            on yours.
          </p>
          <div className="flex flex-wrap gap-4 justify-center lg:justify-start w-full sm:w-auto">
            <Button href={CONTACT} variant="filled">
              Get in touch
            </Button>
            <Button href="#stack" variant="outlined">
              See the stack
            </Button>
          </div>
        </div>

        {/* Fixed height, so the box is the same size before and after the scene
            loads and nothing under it moves. */}
        <div className="h-64 sm:h-80 lg:h-[26rem] w-full">
          <HeroVisual />
        </div>
      </SectionFadeIn>

      <SectionFadeIn id="stack" className="px-6 max-w-5xl mx-auto w-full">
        <SectionHeading title="One stack under your agent" action={{ label: 'github.com/weekndlabs', href: 'https://github.com/weekndlabs' }} />
        <p className="max-w-3xl text-foreground leading-relaxed text-pretty mb-8 md:mb-10">
          An agent needs credentials for the services it calls, a way to stop paying for what it
          has already read, and a model to run on. Each layer is its own product and runs without
          the other two.
        </p>

        {/* Read top to bottom: the agent, the layer it talks to, what that layer
            sits in front of. Static on purpose. The hero already carries the
            moving version of this picture. */}
        <div className="rounded-lg border border-border px-4 py-3 text-center">
          <p className="font-mono text-xs uppercase text-muted-foreground">Your agent</p>
          <p className="mt-1 text-sm text-foreground">Claude Code, Claude Desktop, or a runtime you wrote</p>
        </div>
        <ol className="grid grid-cols-1 md:grid-cols-3 gap-x-6 list-none pl-0">
          {STACK.map((product) => (
            <li key={product.name} className="flex flex-col">
              <Connector />
              <p className="font-mono text-xs uppercase text-brand text-center mb-2">{product.layer}</p>
              <div className="flex-grow">
                <Card
                  title={product.name}
                  description={product.description}
                  version={product.version}
                  tags={product.tags}
                  linkHref={product.href}
                />
              </div>
              <Connector />
              <p className="rounded-lg border border-dashed border-border px-3 py-2.5 text-center font-mono text-xs text-muted-foreground">
                {product.upstream}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-8 md:mt-10 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {INSTALL.map(({ label, command }) => (
            <div key={label} className="flex items-center gap-3">
              <p className="font-mono text-xs text-muted-foreground shrink-0">{label}</p>
              <pre className="border border-border bg-muted rounded-lg px-4 py-3 font-mono text-sm text-brand overflow-x-auto flex-grow">
                <code>{command}</code>
              </pre>
            </div>
          ))}
        </div>
      </SectionFadeIn>

      {proof.length > 0 && (
        <SectionFadeIn id="proof" className="px-6 max-w-5xl mx-auto w-full">
          <SectionHeading title="In the open" />
          <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
            {proof.map(({ value, label }) => (
              <div key={label} className="rounded-lg border border-border bg-muted p-6 flex flex-col-reverse">
                <dt className="font-mono text-xs uppercase text-muted-foreground mt-2">{label}</dt>
                <dd className="font-display text-4xl md:text-5xl text-foreground ml-0">
                  {value.toLocaleString('en-US')}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-sm text-muted-foreground max-w-3xl">
            Counted across {COUNTED.slice(0, -1).join(', ')} and {COUNTED.at(-1)}, read from the
            GitHub API every hour. A count we cannot read in full is left off the page.
          </p>
        </SectionFadeIn>
      )}

      {/* Selat takes money and the landing page has to say so, or the lab reads
          as a shelf rather than a company. No pricing table: that lives on the
          product's own site. See #36. */}
      <SectionFadeIn id="model" className="px-6 max-w-5xl mx-auto w-full">
        <SectionHeading title="How it pays for itself" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div className="rounded-lg border border-border bg-muted p-6 md:p-8">
            <h3 className="font-display text-xl text-foreground mb-3">Run it yourself</h3>
            <p className="text-muted-foreground leading-relaxed">
              The build you download is the whole product, on your own machine, with no account
              and no paid edition behind it.{' '}
              <a href="/philosophy" className={inlineLink}>
                Read the commitment
              </a>
              .
            </p>
          </div>
          <div className="rounded-lg border border-border bg-muted p-6 md:p-8">
            <h3 className="font-display text-xl text-foreground mb-3">Or we run it</h3>
            <p className="text-muted-foreground leading-relaxed">
              <a href="https://selat.weekndlabs.com/app" target="_blank" rel="noopener noreferrer" className={inlineLink}>
                Selat also runs hosted
              </a>{' '}
              for teams who would rather not operate a gateway, priced on tool calls rather than
              seats.{' '}
              <a href="https://github.com/sponsors/fajarhide" target="_blank" rel="noopener noreferrer" className={inlineLink}>
                GitHub Sponsors
              </a>{' '}
              is the other channel.
            </p>
          </div>
        </div>
      </SectionFadeIn>

      <SectionFadeIn id="products" className="px-6 max-w-5xl mx-auto w-full">
        <SectionHeading title="Also from the lab" />
        <div className="flex flex-col gap-12 md:gap-16">
          {byCategory(PRODUCTS.filter((product) => !product.layer)).map(({ category, items }: ProductGroup) => (
            <div key={category}>
              <div className="mb-5 md:mb-6">
                <h3 className="font-mono text-xs uppercase text-muted-foreground">{category}</h3>
                <p className="mt-2.5 max-w-3xl text-foreground leading-relaxed text-pretty">
                  {CATEGORY_NOTES[category]}
                </p>
              </div>
              <ul className="border border-border rounded-lg bg-muted divide-y divide-border list-none pl-0 overflow-hidden">
                {items.map((product) => (
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
            </div>
          ))}
        </div>
      </SectionFadeIn>

      <SectionFadeIn id="who" className="px-6 max-w-5xl mx-auto w-full">
        <SectionHeading title="Who builds it" />
        <p className="max-w-3xl text-foreground leading-relaxed text-pretty">
          WeekndLabs is built in Indonesia by{' '}
          <a href="https://github.com/fajarhide" target="_blank" rel="noopener noreferrer" className={inlineLink}>
            Fajar Hidayat
          </a>{' '}
          and the contributors who send pull requests. Releases, issues and reviews for the
          open-source products are public on GitHub.
        </p>
      </SectionFadeIn>

      <SectionFadeIn id="faq" className="px-6 max-w-5xl mx-auto w-full">
        <SectionHeading title="Questions" />
        <div className="border border-border rounded-lg bg-muted divide-y divide-border overflow-hidden">
          {FAQ.map(({ q, a }) => (
            <details key={q} className="group">
              <summary className="cursor-pointer list-none px-4 py-4 flex items-baseline justify-between gap-6 text-foreground hover:bg-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-inset [&::-webkit-details-marker]:hidden">
                {q}
                <span className="font-mono text-muted-foreground group-open:rotate-45 transition-transform" aria-hidden="true">
                  +
                </span>
              </summary>
              <p className="px-4 pb-4 max-w-3xl text-muted-foreground leading-relaxed">{a}</p>
            </details>
          ))}
        </div>
      </SectionFadeIn>

      <SectionFadeIn id="contact" className="px-6 max-w-5xl mx-auto w-full">
        <div className="rounded-lg border border-border bg-muted p-8 md:p-12 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="max-w-2xl">
            <h2 className="font-display text-2xl md:text-3xl text-foreground mb-4">
              Work with us<span className="text-brand">.</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Partnerships, integrations and investment conversations start with an email to
              hi@weekndlabs.com.
            </p>
          </div>
          <Button href={CONTACT} variant="filled" className="shrink-0 self-start md:self-auto">
            Get in touch
          </Button>
        </div>
      </SectionFadeIn>
    </div>
  );
}
