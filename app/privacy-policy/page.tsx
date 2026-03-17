import { SectionFadeIn } from '@/components/SectionFadeIn';

export const metadata = {
  title: 'Privacy Policy | WeekndLabs',
  description: 'How we handle your data. Transparently and securely.',
};

export default function PrivacyPolicy() {
  return (
    <div className="flex flex-col gap-12 py-32 px-6 max-w-3xl mx-auto w-full">
      <SectionFadeIn>
        <h1 className="text-4xl md:text-5xl font-mono text-text-primary mb-4 leading-tight">
          Privacy Policy<span className="text-accent-cyan">.</span>
        </h1>
        <h2 className="text-lg md:text-xl text-text-muted mb-8">
          How we handle your data.
        </h2>

        <div className="space-y-6 text-text-secondary leading-relaxed">
          <p>
            <strong className="text-text-primary">Last Updated</strong>: March 2026
          </p>
          <p>
            At WeekndLabs (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), we build open-source tools and infrastructure for agentic AI. Through our domains (weekndlabs.com, forgepod.dev, and related services), our goal is to provide a transparent interaction.
          </p>
          <p>
            Because the vast majority of our products are CLI tools and self-hosted infrastructure (like Omni and ForgePod) that run directly on your machines, <strong className="text-text-primary">we collect virtually zero telemetry by default</strong>. 
          </p>

          <h3 className="text-2xl font-mono text-text-primary pt-8 pb-2">
            What We Collect<span className="text-accent-cyan">.</span>
          </h3>
          <p>If you use our managed cloud products (if applicable) or subscribe to our updates, we collect:</p>
          <ul className="list-disc ml-6 space-y-2">
            <li>Your email address (for authentication and critical updates).</li>
            <li>Standard server logs (IP address, user agent) strictly for uptime monitoring, abuse prevention, and rate-limiting.</li>
          </ul>

          <h3 className="text-2xl font-mono text-text-primary pt-8 pb-2">
            What We Never Do<span className="text-accent-cyan">.</span>
          </h3>
          <ul className="list-disc ml-6 space-y-2">
            <li>We do not sell your data to third parties.</li>
            <li>We do not ingest your codebase, terminal outputs, or private deployment keys into any central analytics engine.</li>
            <li>We do not track your activity across other websites.</li>
          </ul>

          <h3 className="text-2xl font-mono text-text-primary pt-8 pb-2">
            Data Protection<span className="text-accent-cyan">.</span>
          </h3>
          <p>
            Any data you do provide (like account emails) is stored securely using modern encryption. We retain your data only for as long as necessary to provide our services. You can request deletion of your data at any time.
          </p>

          <h3 className="text-2xl font-mono text-text-primary pt-8 pb-2">
            Contact Us<span className="text-accent-cyan">.</span>
          </h3>
          <p>If you have any questions about this policy or your data, reach out directly at:</p>
          <ul className="list-none pt-2">
            <li><strong className="text-text-primary">Email</strong>: security@weekndlabs.com</li>
          </ul>
        </div>
      </SectionFadeIn>
    </div>
  );
}
