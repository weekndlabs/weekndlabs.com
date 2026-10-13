import { Button } from '@/components/Button';
import { SectionFadeIn } from '@/components/SectionFadeIn';
import { PRODUCTS } from '@/lib/products';
import { SITE } from '@/lib/site';

export const metadata = {
  title: 'About | WeekndLabs',
  description: `WeekndLabs is operated by ${SITE.legalName}, founded by ${SITE.founder.name} in ${SITE.country}. Who builds it, where each product meets Claude, and how to reach us.`,
};

// One sentence per product on how it meets Claude, keyed by the catalog name so
// a renamed or removed product fails the lookup below rather than leaving a
// stale row here.
const WITH_CLAUDE: [string, string][] = [
  [
    'Omni',
    'Runs as hooks inside Claude Code. It shortens command and file output before the model reads it, and hands back a handle for what it cut.',
  ],
  [
    'Selat',
    'An MCP gateway. Claude Desktop, Claude Code and any other MCP client call the same tools through one OAuth grant.',
  ],
  ['Fifin', 'A personal finance assistant for Indonesia, built on the Claude API.'],
];

const link =
  'text-brand underline underline-offset-4 hover:text-brand-strong transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm';

const external = { target: '_blank', rel: 'noopener noreferrer' } as const;

const FACTS: [string, React.ReactNode][] = [
  ['Operated by', SITE.legalName],
  [
    'Founder',
    <a key="founder" href={SITE.founder.url} {...external} className={`inline-flex min-h-11 items-center ${link}`}>
      {SITE.founder.name}
    </a>,
  ],
  ['Based in', SITE.country],
  [
    'Source',
    <a key="source" href={SITE.github} {...external} className={`inline-flex min-h-11 items-center font-mono text-sm ${link}`}>
      github.com/weekndlabs
    </a>,
  ],
  [
    'Licences',
    <>
      MIT and Apache 2.0.{' '}
      <a href="/philosophy" className={link}>
        Read the commitment
      </a>
      .
    </>,
  ],
];

export default function About() {
  return (
    <div className="pb-24 md:pb-32">
      <SectionFadeIn className="pt-16 md:pt-24 px-6 max-w-5xl mx-auto w-full">
        <div className="rise">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display text-foreground mb-6 leading-tight tracking-tight">
            About<span className="text-brand">.</span>
          </h1>
          <p className="max-w-3xl text-lg md:text-xl text-muted-foreground leading-relaxed text-pretty">
            WeekndLabs builds open-source infrastructure for AI agents, and the products that run
            on it. It is operated by {SITE.legalName}, a company in {SITE.country} founded by{' '}
            {SITE.founder.name}.
          </p>
        </div>
      </SectionFadeIn>

      <SectionFadeIn id="claude" className="mt-20 md:mt-28 px-6 max-w-5xl mx-auto w-full">
        <div className="grid gap-8 lg:grid-cols-5 lg:gap-12">
          <h2 className="lg:col-span-2 font-display text-2xl md:text-3xl text-foreground text-balance">
            Where Claude comes in
          </h2>
          <ul className="lg:col-span-3 list-none pl-0 divide-y divide-border border-y border-border">
            {WITH_CLAUDE.map(([name, how]) => {
              const product = PRODUCTS.find((p) => p.name === name);
              if (!product) throw new Error(`${name} is not in the catalog`);
              return (
                <li key={name} className="pt-2 pb-5">
                  <a href={product.href} {...external} className={`inline-flex min-h-11 min-w-11 items-center font-display text-lg ${link}`}>
                    {name}
                  </a>
                  <p className="text-muted-foreground leading-relaxed text-pretty">{how}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </SectionFadeIn>

      <SectionFadeIn id="company" className="mt-20 md:mt-28 px-6 max-w-5xl mx-auto w-full">
        <div className="grid gap-8 lg:grid-cols-5 lg:gap-12">
          <h2 className="lg:col-span-2 font-display text-2xl md:text-3xl text-foreground">The company</h2>
          <dl className="lg:col-span-3 divide-y divide-border border-y border-border">
            {FACTS.map(([term, value]) => (
              <div key={term} className="grid min-h-14 gap-1 py-2 sm:grid-cols-3 sm:items-center sm:gap-6">
                <dt className="text-sm font-medium text-muted-foreground">{term}</dt>
                <dd className="ml-0 sm:col-span-2 text-foreground">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </SectionFadeIn>

      <SectionFadeIn id="contact" className="mt-28 md:mt-40 px-6 max-w-5xl mx-auto w-full">
        <div className="flex flex-col gap-8 border-t border-border pt-12 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <h2 className="font-display text-4xl md:text-5xl text-foreground tracking-tight">
              Write to us<span className="text-brand">.</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              Partnerships, integrations and anything else go to {SITE.email}. Security reports go
              to {SITE.security}.
            </p>
          </div>
          <Button href={`mailto:${SITE.email}`} variant="filled" className="shrink-0 self-start md:self-auto">
            Email us
          </Button>
        </div>
      </SectionFadeIn>
    </div>
  );
}
