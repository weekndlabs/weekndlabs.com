import { SectionFadeIn } from '@/components/SectionFadeIn';

export const metadata = {
  title: 'Philosophy | WeekndLabs',
  description: 'Engineering for builders. Our commitment to radical transparency and high-performance agentic AI infrastructure.',
};

export default function Philosophy() {
  return (
    <div className="flex flex-col gap-16 py-32 px-6 max-w-4xl mx-auto w-full">
      <SectionFadeIn>
        <h1 className="text-4xl md:text-5xl font-mono text-text-primary mb-4 leading-tight">
          Philosophy<span className="text-accent-cyan">.</span>
        </h1>
        <h2 className="text-lg md:text-xl text-text-muted mb-8">
          Engineering for builders.
        </h2>

        <div className="space-y-6 text-text-secondary leading-relaxed">
          <p>
            AI is eating software. Agents are eating AI. The infrastructure layer for agentic systems is where the next decade of value lives. We&apos;re building it out of Southeast Asia, and we&apos;re building it with <strong className="text-text-primary">radical transparency</strong>.
          </p>
          <p>
            We believe that foundational developer tools should be transparent, portable, and owned by the builders who use them. This is not just a strategy—it&apos;s a commitment to infrastructure sovereignty for the agentic era.
          </p>
        </div>
      </SectionFadeIn>

      <SectionFadeIn>
        <h3 className="text-2xl font-mono text-text-primary mb-4">
          The Commitments<span className="text-accent-cyan">.</span>
        </h3>
        <ul className="space-y-8 text-text-secondary list-none pl-0">
          <li className="flex gap-4 items-start">
            <span className="text-accent-cyan mt-1 shrink-0">{"->"}</span>
            <div>
              <strong className="text-text-primary font-mono block mb-1">Transparent & Portable</strong>
              We believe you should own your infrastructure. No black boxes. No hidden enterprise editions. High-performance code that is fully transparent, portable, and ready for production.
            </div>
          </li>
          <li className="flex gap-4 items-start">
            <span className="text-accent-cyan mt-1 shrink-0">{"->"}</span>
            <div>
              <strong className="text-text-primary font-mono block mb-1">Builder-First Empathy</strong>
              We build tools we actually want to use. We prioritize CLI ergonomics, low-latency, predictability, and local-first workflows over marketing metrics.
            </div>
          </li>
          <li className="flex gap-4 items-start">
            <span className="text-accent-cyan mt-1 shrink-0">{"->"}</span>
            <div>
              <strong className="text-text-primary font-mono block mb-1">Permissive Licensing</strong>
              We strictly release under the MIT or Apache 2.0 license. Fork it, learn from it, run it in production. You own your infrastructure without strings attached.
            </div>
          </li>
        </ul>
      </SectionFadeIn>

      <SectionFadeIn>
        <h3 className="text-2xl font-mono text-text-primary mb-4">
          How We Sustain This<span className="text-accent-cyan">.</span>
        </h3>
        <div className="space-y-6 text-text-secondary leading-relaxed mb-10">
          <p>
            Building high-performance software requires time, electricity, and coffee. We sustain our operations through two transparent channels without relying on external VCs dictating our roadmap:
          </p>
          <ul className="space-y-4 list-none pl-0">
             <li className="flex gap-4 items-start">
              <span className="text-accent-cyan mt-1 shrink-0">01</span>
              <div>
                <strong className="text-text-primary block">Managed Cloud Services</strong>
                For teams who prefer not to manage infrastructure, we provide fully-managed, hosted versions of our networking and deployment tools.
              </div>
            </li>
            <li className="flex gap-4 items-start">
              <span className="text-accent-cyan mt-1 shrink-0">02</span>
              <div>
                <strong className="text-text-primary block">Community Sponsorships</strong>
                Support directly from the engineers who rely on our tools via GitHub Sponsors or direct contributions.
              </div>
            </li>
          </ul>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <a href="https://github.com/weekndlabs" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-6 py-3 font-mono text-sm border border-border bg-surface hover:border-accent-cyan/50 hover:text-accent-cyan transition-colors rounded-sm">
            <span>Sponsor on GitHub</span>
            <span className="text-text-muted text-xs">{"->"}</span>
          </a>
        </div>
      </SectionFadeIn>
    </div>
  );
}
