import React from 'react';
import Link from 'next/link';
import { Button } from './Button';

import Image from 'next/image';

export const Navbar = () => {
  return (
    <nav className="border-b border-border bg-background sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-mono text-xl text-text-primary hover:text-accent-cyan transition-colors group">
          <Image src="/logo.png" alt="WeekndLabs Logo" width={36} height={36} className="group-hover:opacity-80 transition-opacity" />
          <span>WeekndLabs</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          <Link href="#products" className="font-mono text-sm text-text-secondary hover:text-text-primary transition-colors">
            Products
          </Link>
          <Link href="/philosophy" className="font-mono text-sm text-text-secondary hover:text-text-primary transition-colors">
            Philosophy
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="outlined" href="https://github.com/sponsors/fajarhide" className="hidden sm:inline-flex border-accent-amber text-accent-amber hover:bg-accent-amber hover:text-background">
            Sponsor
          </Button>
          <Button variant="outlined" href="https://github.com/weekndlabs">
            Star on GitHub
          </Button>
        </div>
      </div>
    </nav>
  );
};
