import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { SectionFadeIn } from '@/components/SectionFadeIn';

export default function Home() {
  return (
    <div className="flex flex-col gap-32 pb-24 top-0 relative">
      <SectionFadeIn className="pt-32 px-6 max-w-5xl mx-auto text-center flex flex-col items-center">
        <h1 className="text-5xl md:text-7xl font-mono text-text-primary mb-6 leading-tight tracking-tight">
          Reliable infrastructure for the agentic era.
        </h1>
        <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
          High-performance tools built for developers building the future of automated intelligence. Shipped to production.
        </p>
        <div className="flex flex-wrap gap-4 justify-center w-full sm:w-auto">
          <Button href="#products" variant="filled">
            Explore Products
          </Button>
          <Button href="https://github.com/sponsors/fajarhide" variant="outlined" className="sm:hidden border-accent-amber text-accent-amber hover:bg-accent-amber hover:text-background">
            Sponsor
          </Button>
        </div>
      </SectionFadeIn>

      <SectionFadeIn id="products" className="px-6 max-w-7xl mx-auto w-full">
        <div className="mb-12">
          <h2 className="text-3xl font-mono text-text-primary mb-4">Our Products</h2>
          <div className="h-px w-24 bg-border"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card 
            title="Omni"
            description="High-performance semantic filter for agentic AI. Reduces 30–90% of token noise by stripping non-essential CLI output. Built in Rust for zero-latency context management."
            badgeLabel="ON-GOING"
<<<<<<< HEAD
            tags={['Zig', 'Wasm', 'MCP', 'Agent Infrastructure']}
            linkHref="https://omni.weekndlabs.com"
=======
            tags={['Rust', 'CLI', 'MCP', 'Context Management']}
            linkHref="https://omni-nine-rho.vercel.app"
>>>>>>> 7decf0a (feat: Update homepage marketing copy, introduce sponsor links and buttons, and refine Omni product details.)
          />
          <Card 
            title="ForgePod"
            description="Lightweight self-hosted PaaS powered by Podman. Ship containers like Heroku. Own your infrastructure like a pro. No Docker daemon. No vendor lock-in."
            badgeLabel="ON-GOING"
            tags={['Go', 'Podman', 'Self-hosted', 'PaaS']}
            linkHref="https://forgepod.dev"
          />
          <Card 
            title="AI PR Describer"
            description="Automated Pull Request descriptions powered by AI. Reads the diff, understands the context, writes descriptions developers actually read."
            badgeLabel="ON-GOING"
            tags={['AI', 'Developer Tools', 'GitHub Actions']}
            linkHref="https://github.com/marketplace/actions/ai-pull-request-describer"
          />
        </div>
      </SectionFadeIn>

      <SectionFadeIn id="philosophy" className="px-6 max-w-4xl mx-auto w-full text-center py-8">
        <h2 className="text-2xl font-mono text-text-primary mb-6">Engineering for builders.</h2>
        <p className="text-text-secondary mb-8">
          We believe that the best developer tools are built with radical transparency and deep empathy for the people using them.
        </p>
        <div className="flex justify-center">
          <Button href="/philosophy" variant="outlined">
            Read our philosophy
          </Button>
        </div>
      </SectionFadeIn>

      <SectionFadeIn id="activity" className="px-6 max-w-4xl mx-auto w-full">
        <h2 className="text-xl font-mono text-text-primary mb-6">Recent activity</h2>
        <ul className="border border-border rounded bg-surface divide-y divide-border list-none pl-0">
          <li className="p-4 flex flex-col sm:flex-row gap-2 sm:items-center justify-between font-mono text-sm hover:bg-background transition-colors">
            <div className="flex items-start gap-4">
              <span className="text-accent-cyan shrink-0 mt-0.5 sm:mt-0">⚡</span>
              <span className="text-text-primary">feat(omni): add semantic filter for JSON output</span>
            </div>
            <div className="flex items-center gap-4 shrink-0 mt-2 sm:mt-0 ml-8 sm:ml-0">
              <span className="px-2 py-0.5 bg-background border border-border rounded text-text-muted text-xs">weekndlabs/omni</span>
              <span className="text-text-muted text-xs">2 days ago</span>
            </div>
          </li>
          <li className="p-4 flex flex-col sm:flex-row gap-2 sm:items-center justify-between font-mono text-sm hover:bg-background transition-colors">
            <div className="flex items-start gap-4">
              <span className="text-accent-amber shrink-0 mt-0.5 sm:mt-0">🐛</span>
              <span className="text-text-primary">fix(forgepod): scheduler race condition on multi-node deploy</span>
            </div>
            <div className="flex items-center gap-4 shrink-0 mt-2 sm:mt-0 ml-8 sm:ml-0">
              <span className="px-2 py-0.5 bg-background border border-border rounded text-text-muted text-xs">weekndlabs/forgepod</span>
              <span className="text-text-muted text-xs">5 days ago</span>
            </div>
          </li>
          <li className="p-4 flex flex-col sm:flex-row gap-2 sm:items-center justify-between font-mono text-sm hover:bg-background transition-colors">
            <div className="flex items-start gap-4">
              <span className="text-accent-cyan shrink-0 mt-0.5 sm:mt-0">⚡</span>
              <span className="text-text-primary">feat(ai-pr-describer): support GitLab MR format</span>
            </div>
            <div className="flex items-center gap-4 shrink-0 mt-2 sm:mt-0 ml-8 sm:ml-0">
              <span className="px-2 py-0.5 bg-background border border-border rounded text-text-muted text-xs">weekndlabs/ai-pr-describer</span>
              <span className="text-text-muted text-xs">1 week ago</span>
            </div>
          </li>
        </ul>
      </SectionFadeIn>

    </div>
  )
}
