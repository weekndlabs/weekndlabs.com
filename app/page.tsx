import { Button } from '@/components/Button';
import { HeroVisual } from '@/components/HeroVisual';
import { SectionFadeIn } from '@/components/SectionFadeIn';
import { totalStars, starClause } from '@/lib/stars';
import { releaseCount, uniqueContributors } from '@/lib/traction';
import { githubHeaders, warnGithub } from '@/lib/github';
import { CATEGORY_NOTES, PRODUCTS, byCategory, starRepos } from '@/lib/products';
import type { Product, ProductGroup } from '@/lib/products';

export const revalidate = 3600;

// The catalog, the categories and the rule about which repos are safe to count
// all live in lib/products.js now. See issue #28.
const PRODUCT_REPOS: string[] = starRepos();

// The three an agent runs on get the stack section, and the one with measured
// results leads it. Everything else is a row further down.
const STACK = PRODUCTS.filter((product) => product.layer);
const LEAD = STACK.find((product) => product.figures);
const REST = STACK.filter((product) => product !== LEAD);
const COUNTED = PRODUCTS.filter((product) => product.repo).map((product) => product.name);

const INSTALL: Record<string, string> = {
  Selat: 'npx @fajarhide/selat',
  Omni: 'brew install fajarhide/tap/omni',
};

// Already published on /terms-of-service. A link and not a form: a form needs
// a mail route, spam handling and a success state, and none of that exists.
const CONTACT = 'mailto:hi@weekndlabs.com';

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

const link =
  'text-brand underline underline-offset-4 hover:text-brand-strong transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm';

const external = { target: '_blank', rel: 'noopener noreferrer' } as const;

/** Where a product lives, without the scheme: the label of its link. */
const host = (href: string) => href.replace(/^https:\/\//, '').replace(/\/$/, '');

// Name, version, what it does, what it sits in front of, how to get it. The
// lead and the two beside it share this and differ only in type size.
function Layer({ product, lead = false }: { product: Product; lead?: boolean }) {
  return (
    <div>
      <p className="text-sm font-medium text-muted-foreground">{product.layer}</p>
      {/* The version sits beside the heading, not in it, so the heading an
          engine or a screen reader gets is the name alone. */}
      <div className="mt-1 flex items-baseline gap-3">
        <h3 className={`font-display text-foreground ${lead ? 'text-3xl md:text-4xl' : 'text-2xl'}`}>{product.name}</h3>
        <span className="font-mono text-xs text-muted-foreground">{product.version}</span>
      </div>
      <p className={`mt-3 text-muted-foreground leading-relaxed text-pretty ${lead ? 'max-w-xl text-lg' : ''}`}>
        {product.description}
      </p>
      <p className="mt-3 text-sm text-muted-foreground">
        Sits in front of <span className="text-foreground">{product.upstream}</span>.
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
        {INSTALL[product.name] && (
          <code className="rounded-sm bg-muted px-3 py-2 font-mono text-sm text-foreground">{INSTALL[product.name]}</code>
        )}
        <a href={product.href} {...external} className={`inline-flex min-h-11 items-center font-mono text-sm ${link}`}>
          {host(product.href)}
        </a>
      </div>
    </div>
  );
}

export default async function Home() {
  const [stars, releases, contributors] = await Promise.all([
    each(getRepoStars).then(totalStars),
    each(getReleaseCount).then(totalStars),
    each(getContributors).then(uniqueContributors),
  ]);

  // A count that could not be read in full is dropped from the sentence.
  const proof = [
    { value: stars, label: 'stars' },
    { value: contributors, label: 'contributors' },
    { value: releases, label: 'releases' },
  ].filter((count): count is { value: number; label: string } => count.value !== null);

  return (
    <div className="pb-24 md:pb-32">
      {/* Wider than everything below it, and deliberately so: this is the only
          section with a picture, and the graph needs the second half. */}
      <SectionFadeIn className="pt-16 md:pt-24 px-6 max-w-6xl mx-auto w-full grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
        <div className="rise flex flex-col items-center text-center lg:items-start lg:text-left">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display text-foreground mb-6 leading-tight tracking-tight text-balance">
            Reliable infrastructure for the agentic era<span className="text-brand">.</span>
          </h1>
          {/* Opens with the name and a verb, so the sentence still says what
              this is when an engine quotes it with nothing around it. */}
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mb-8 md:mb-10 leading-relaxed text-pretty">
            WeekndLabs builds open-source infrastructure for AI agents: a gateway for the
            credentials they hold, a context layer for what they read twice, and routing for the
            models they call. All of it under MIT and Apache 2.0{starClause(stars)}. Every number
            we publish is measured on a real corpus and replays on yours.
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

      {/* No cards. Three equal cards said the three products weigh the same,
          and they do not: one has measurements and users, so it gets the width
          and the other two sit beside each other under it. */}
      <SectionFadeIn id="stack" className="mt-24 md:mt-36 px-6 max-w-5xl mx-auto w-full">
        <div className="grid gap-4 lg:grid-cols-5 lg:gap-12">
          <h2 className="lg:col-span-2 font-display text-3xl md:text-4xl text-foreground text-balance">
            One stack under your agent
          </h2>
          <p className="lg:col-span-3 text-lg text-muted-foreground leading-relaxed text-pretty">
            An agent needs credentials for the services it calls, a way to stop paying for what it
            has already read, and a model to run on. Each layer is its own product and runs
            without the other two.
          </p>
        </div>

        {LEAD && (
          <div className="mt-12 md:mt-16 grid gap-10 border-y border-border py-10 md:py-12 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7">
              <Layer product={LEAD} lead />
            </div>
            <dl className="lg:col-span-5 flex flex-col justify-center gap-8">
              {LEAD.figures?.map(({ value, label }) => (
                <div key={label} className="flex flex-col-reverse">
                  <dt className="mt-1 text-muted-foreground">{label}</dt>
                  <dd className="ml-0 font-mono text-5xl md:text-6xl tracking-tight text-foreground">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        <div className="reveal-each grid gap-10 py-10 md:grid-cols-2 md:gap-0 md:py-12 md:divide-x md:divide-border">
          {REST.map((product, i) => (
            <div key={product.name} className={i === 0 ? 'md:pr-12' : 'md:pl-12'}>
              <Layer product={product} />
            </div>
          ))}
        </div>

        {proof.length > 0 && (
          <p className="border-t border-border pt-6 text-muted-foreground leading-relaxed">
            {proof.map(({ value, label }, i) => (
              <span key={label}>
                {i > 0 && (i === proof.length - 1 ? ' and ' : ', ')}
                <span className="font-mono text-foreground">{value.toLocaleString('en-US')}</span> {label}
              </span>
            ))}{' '}
            across {COUNTED.slice(0, -1).join(', ')} and {COUNTED.at(-1)}, read from the GitHub API
            every hour. A count we cannot read in full is left out.
          </p>
        )}
      </SectionFadeIn>

      {/* Selat takes money and the landing page has to say so, or the lab reads
          as a shelf rather than a company. No pricing table: that lives on the
          product's own site. See #36. */}
      <SectionFadeIn id="model" className="mt-20 md:mt-28 px-6 max-w-5xl mx-auto w-full">
        <h2 className="font-display text-2xl md:text-3xl text-foreground">How it pays for itself</h2>
        <div className="mt-8 grid gap-8 md:grid-cols-2 md:gap-0 md:divide-x md:divide-border">
          <div className="md:pr-12">
            <h3 className="font-display text-xl text-foreground">Run it yourself</h3>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              The build you download is the whole product, on your own machine, with no account
              and no paid edition behind it.{' '}
              <a href="/philosophy" className={link}>
                Read the commitment
              </a>
              .
            </p>
          </div>
          <div className="md:pl-12">
            <h3 className="font-display text-xl text-foreground">Or we run it</h3>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              <a href="https://selat.weekndlabs.com/app" {...external} className={link}>
                Selat also runs hosted
              </a>{' '}
              for teams who would rather not operate a gateway, priced on tool calls rather than
              seats.{' '}
              <a href="https://github.com/sponsors/fajarhide" {...external} className={link}>
                GitHub Sponsors
              </a>{' '}
              is the other channel.
            </p>
          </div>
        </div>
      </SectionFadeIn>

      {/* The one boxed list on the page. Rows, because a row cannot leave a
          hole in a grid. */}
      <SectionFadeIn id="products" className="mt-24 md:mt-32 px-6 max-w-5xl mx-auto w-full">
        <h2 className="font-display text-2xl md:text-3xl text-foreground">Also from the lab</h2>
        <div className="mt-8 flex flex-col gap-10">
          {byCategory(PRODUCTS.filter((product) => !product.layer)).map(({ category, items }: ProductGroup) => (
            <div key={category}>
              <h3 className="text-sm font-medium text-muted-foreground">{category}</h3>
              <p className="mt-1.5 mb-4 max-w-3xl text-foreground leading-relaxed text-pretty">
                {CATEGORY_NOTES[category]}
              </p>
              <ul className="border border-border rounded-lg bg-muted divide-y divide-border list-none pl-0 overflow-hidden">
                {items.map((product) => (
                  <li key={product.name}>
                    <a
                      href={product.href}
                      {...(product.href.startsWith('/') ? {} : external)}
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

      {/* The page ends on the one thing it asks for. Open, not boxed, and the
          only place below the hero where the type goes large again. */}
      <SectionFadeIn id="contact" className="mt-28 md:mt-40 px-6 max-w-5xl mx-auto w-full">
        <div className="flex flex-col gap-8 border-t border-border pt-12 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <h2 className="font-display text-4xl md:text-5xl text-foreground tracking-tight">
              Work with us<span className="text-brand">.</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
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
