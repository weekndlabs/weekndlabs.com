import React from 'react';
import Link from 'next/link';
import { Button } from './Button';
import { ThemeToggle } from './ThemeToggle';

import Image from 'next/image';

export const Navbar = () => {
  return (
    <nav className="border-b border-border bg-background sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 font-display font-bold text-xl text-text-primary hover:text-accent transition-colors group">
          <Image src="/logo.png" alt="" width={32} height={32} className="rounded-lg group-hover:opacity-80 transition-opacity" />
          <span>WeekndLabs</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          <Link href="/#products" className="font-mono text-sm text-text-secondary hover:text-text-primary transition-colors">
            Products
          </Link>
          <Link href="/philosophy" className="font-mono text-sm text-text-secondary hover:text-text-primary transition-colors">
            Philosophy
          </Link>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <ThemeToggle />
          <Button variant="filled" href="https://github.com/sponsors/fajarhide" className="hidden sm:inline-flex">
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
