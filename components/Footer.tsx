import React from 'react';
import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className="border-t border-border bg-background mt-24 py-12">
      <div className="max-w-7xl mx-auto px-6 flex justify-between flex-wrap gap-y-8 flex-col md:flex-row items-center md:items-start text-center md:text-left">
        
        <div>
          <p className="font-mono text-sm text-text-muted">
            &copy; 2026 WeekndLabs.
          </p>
        </div>

        <div className="flex-grow flex justify-center text-center">
          <p className="font-mono text-sm text-text-muted">
            Built from Bandung, Indonesia 🇮🇩 — shipped to the world.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-6">
          <a href="https://github.com/weekndlabs" target="_blank" rel="noopener noreferrer" className="font-mono text-sm text-text-secondary hover:text-text-primary transition-colors">
            GitHub
          </a>
          <Link href="/philosophy" className="font-mono text-sm text-text-secondary hover:text-text-primary transition-colors">
            Philosophy
          </Link>
          <Link href="/privacy-policy" className="font-mono text-sm text-text-secondary hover:text-text-primary transition-colors">
            Privacy
          </Link>
          <Link href="/terms-of-service" className="font-mono text-sm text-text-secondary hover:text-text-primary transition-colors">
            Terms
          </Link>
        </div>

      </div>
    </footer>
  );
};
