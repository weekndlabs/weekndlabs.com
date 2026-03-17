import { SectionFadeIn } from '@/components/SectionFadeIn';

export const metadata = {
  title: 'Terms of Service | WeekndLabs',
  description: 'Rules for using our services and open-source infrastructure.',
};

export default function TermsOfService() {
  return (
    <div className="flex flex-col gap-12 py-32 px-6 max-w-3xl mx-auto w-full">
      <SectionFadeIn>
        <h1 className="text-4xl md:text-5xl font-mono text-text-primary mb-4 leading-tight">
          Terms of Service<span className="text-accent-cyan">.</span>
        </h1>
        <h2 className="text-lg md:text-xl text-text-muted mb-8">
          The rules of engagement.
        </h2>

        <div className="space-y-6 text-text-secondary leading-relaxed">
          <p>
            <strong className="text-text-primary">Last Updated</strong>: March 2026
          </p>
          <p>
            By accessing or using the services, websites, and applications (&quot;products&quot;) provided by WeekndLabs, you agree to be bound by these Terms of Service. If you do not agree with them, please do not use our managed services.
          </p>

          <h3 className="text-2xl font-mono text-text-primary pt-8 pb-2">
            Open Source Licensing<span className="text-accent-cyan">.</span>
          </h3>
          <p>
            Our core products (like Omni, AI PR Describer, and ForgePod) are open-source and governed by their respective licenses (usually MIT or Apache 2.0). These Terms primarily apply to our hosted domains, APIs, and managed cloud infrastructure. For the open-source code itself, the repository&apos;s license file takes precedence.
          </p>

          <h3 className="text-2xl font-mono text-text-primary pt-8 pb-2">
            Acceptable Use<span className="text-accent-cyan">.</span>
          </h3>
          <p>You agree not to use our hosted APIs or infrastructure to:</p>
          <ul className="list-disc ml-6 space-y-2">
            <li>Violate any applicable local, regional, or international laws.</li>
            <li>Deploy malicious workloads (malware, unconsented cryptomining, DDoS nodes).</li>
            <li>Attempt to overwhelm, breach, or exploit the WeekndLabs infrastructure.</li>
            <li>Impersonate WeekndLabs or our maintainers.</li>
          </ul>

          <h3 className="text-2xl font-mono text-text-primary pt-8 pb-2">
            Limitation of Liability<span className="text-accent-cyan">.</span>
          </h3>
          <p>
            We build tools for developers, but developers know that software is hard. We do our absolute best to ensure our managed services are highly available and secure. However, our services are provided on an &quot;as-is&quot; and &quot;as-available&quot; basis without warranties of any kind. 
          </p>
          <p>
            In no event shall WeekndLabs or its contributors be liable for any direct, indirect, incidental, special, or consequential damages (including, but not limited to, procurement of substitute goods or services; loss of use, data, or profits; or business interruption) arising in any way out of the use of our software or services.
          </p>

          <h3 className="text-2xl font-mono text-text-primary pt-8 pb-2">
            Account Termination<span className="text-accent-cyan">.</span>
          </h3>
          <p>
            We reserve the right to suspend or terminate your access to our hosted services immediately, without prior notice, if you violate these Terms (especially the Acceptable Use clause).
          </p>

          <h3 className="text-2xl font-mono text-text-primary pt-8 pb-2">
            Contact Us<span className="text-accent-cyan">.</span>
          </h3>
          <p>For legal inquiries, abuse reporting, or clarification on these terms, contact:</p>
          <ul className="list-none pt-2">
            <li><strong className="text-text-primary">Email</strong>: hi@weekndlabs.com</li>
          </ul>
        </div>
      </SectionFadeIn>
    </div>
  );
}
