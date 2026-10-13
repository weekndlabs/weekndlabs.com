import React from 'react';
import Link from 'next/link';
import { SITE } from '@/lib/site';

export const Footer = () => {
  return (
    <footer className="border-t border-border bg-background mt-24 py-12">
      <div className="max-w-7xl mx-auto px-6 flex justify-between flex-wrap gap-y-8 flex-col md:flex-row items-center md:items-start text-center md:text-left">
        
        <div>
          <p className="text-sm text-muted-foreground">
            &copy; 2026 {SITE.legalName}.
          </p>
        </div>

        <div className="flex-grow flex justify-center text-center">
          <p className="text-sm text-muted-foreground">
            Built in Indonesia, shipped to the world.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-x-6">
          <a href="https://github.com/sponsors/fajarhide" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 min-w-11 items-center justify-center text-sm text-brand-strong hover:opacity-80 transition-opacity">
            Sponsor
          </a>
          <a href="https://github.com/weekndlabs" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 min-w-11 items-center justify-center text-sm text-muted-foreground hover:text-foreground transition-colors">
            GitHub
          </a>
          <Link href="/about" className="inline-flex min-h-11 min-w-11 items-center justify-center text-sm text-muted-foreground hover:text-foreground transition-colors">
            About
          </Link>
          <Link href="/philosophy" className="inline-flex min-h-11 min-w-11 items-center justify-center text-sm text-muted-foreground hover:text-foreground transition-colors">
            Philosophy
          </Link>
          <Link href="/privacy-policy" className="inline-flex min-h-11 min-w-11 items-center justify-center text-sm text-muted-foreground hover:text-foreground transition-colors">
            Privacy
          </Link>
          <Link href="/terms-of-service" className="inline-flex min-h-11 min-w-11 items-center justify-center text-sm text-muted-foreground hover:text-foreground transition-colors">
            Terms
          </Link>
        </div>

      </div>
    </footer>
  );
};
