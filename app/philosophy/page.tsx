import { SectionFadeIn } from '@/components/SectionFadeIn';

export const metadata = {
  title: 'Philosophy | WeekndLabs',
  description: 'Engineering for builders. Our commitment to radical transparency and high-performance agentic AI infrastructure.',
};

export default function Philosophy() {
  return (
    <div className="flex flex-col gap-16 py-32 px-6 max-w-4xl mx-auto w-full">
      <SectionFadeIn>
        <h1 className="text-4xl md:text-5xl font-display text-foreground mb-4 leading-tight">
          Philosophy<span className="text-brand">.</span>
        </h1>
        <h2 className="text-lg md:text-xl text-muted-foreground mb-8">
          Engineering for builders.
        </h2>

        <div className="space-y-6 text-muted-foreground leading-relaxed">
          <p>
            Agents are becoming the way a lot of software gets written, and the tooling underneath them is still thin. We build that layer out of Southeast Asia with <strong className="text-foreground">radical transparency</strong>: the benchmarks on this site are numbers you can reproduce from the repo, not numbers we liked the sound of.
          </p>
          <p>
            Developer tools should be transparent, portable, and owned by the people who use them. That means you can read the code, fork it, and run it in production without asking us first.
          </p>
        </div>
      </SectionFadeIn>

      <SectionFadeIn>
        <h3 className="text-2xl font-display text-foreground mb-4">
          The Commitments<span className="text-brand">.</span>
        </h3>
        <ul className="space-y-8 text-muted-foreground list-none pl-0">
          <li className="flex gap-4 items-start">
            <span className="text-brand mt-1 shrink-0">{"->"}</span>
            <div>
              <strong className="text-foreground font-mono block mb-1">Transparent & Portable</strong>
              You own your infrastructure. There is no black box and no hidden enterprise edition holding back the parts that matter. Everything we run ourselves is the same code you download.
            </div>
          </li>
          <li className="flex gap-4 items-start">
            <span className="text-brand mt-1 shrink-0">{"->"}</span>
            <div>
              <strong className="text-foreground font-mono block mb-1">Builder-First Empathy</strong>
              We build tools we actually want to use. We prioritize CLI ergonomics, low-latency, predictability, and local-first workflows over marketing metrics.
            </div>
          </li>
          <li className="flex gap-4 items-start">
            <span className="text-brand mt-1 shrink-0">{"->"}</span>
            <div>
              <strong className="text-foreground font-mono block mb-1">Permissive Licensing</strong>
              We strictly release under the MIT or Apache 2.0 license. Fork it, learn from it, run it in production. You own your infrastructure without strings attached.
            </div>
          </li>
        </ul>
      </SectionFadeIn>

      <SectionFadeIn>
        <h3 className="text-2xl font-display text-foreground mb-4">
          How We Sustain This<span className="text-brand">.</span>
        </h3>
        <div className="space-y-6 text-muted-foreground leading-relaxed mb-10">
          <p>
            Building high-performance software requires time, electricity, and coffee. We sustain our operations through two transparent channels without relying on external VCs dictating our roadmap:
          </p>
          <ul className="space-y-4 list-none pl-0">
             <li className="flex gap-4 items-start">
              <span className="text-brand mt-1 shrink-0">01</span>
              <div>
                <strong className="text-foreground block">Managed Cloud Services</strong>
                For teams who would rather not run this themselves, we offer hosted versions of our tools. The self-hosted build stays complete either way.
              </div>
            </li>
            <li className="flex gap-4 items-start">
              <span className="text-brand mt-1 shrink-0">02</span>
              <div>
                <strong className="text-foreground block">Community Sponsorships</strong>
                Support directly from the engineers who rely on our tools via GitHub Sponsors or direct contributions.
              </div>
            </li>
          </ul>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <a href="https://github.com/weekndlabs" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-6 py-3 font-mono text-sm border border-border bg-muted hover:border-brand/50 hover:text-brand transition-colors rounded-sm">
            <span>Sponsor on GitHub</span>
            <span className="text-muted-foreground text-xs">{"->"}</span>
          </a>
        </div>
      </SectionFadeIn>
    </div>
  );
}
