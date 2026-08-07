'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { Button } from './Button';
import { ThemeToggle } from './ThemeToggle';

const LINKS = [
  { href: '/#products', label: 'Products' },
  { href: '/design', label: 'Design' },
  { href: '/philosophy', label: 'Philosophy' },
];

export const Navbar = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // The hash is client-only. usePathname drops it and reading location during
  // render would not match the server, so it starts empty and fills in on mount.
  // Re-reading on pathname change covers arriving at /#products from another
  // page, where hashchange does not fire.
  const [hash, setHash] = useState('');
  useEffect(() => {
    const read = () => setHash(window.location.hash);
    read();
    setOpen(false);
    window.addEventListener('hashchange', read);
    return () => window.removeEventListener('hashchange', read);
  }, [pathname]);

  const isActive = (href: string) =>
    href.includes('#')
      ? pathname === '/' && hash !== '' && href.endsWith(hash)
      : pathname === href;

  // A same-page hash link routes through history.pushState, which never fires
  // hashchange, so the listener above would miss exactly the click the highlight
  // is meant to answer. Read it off the href instead.
  const select = (href: string) => {
    setOpen(false);
    const [, fragment] = href.split('#');
    if (fragment) setHash(`#${fragment}`);
  };

  return (
    <nav className="border-b border-border bg-background sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="flex items-center gap-2.5 font-display font-bold text-lg sm:text-xl text-foreground hover:text-brand transition-colors group"
        >
          {/* No radius here. The mark carries its own silhouette, and a CSS corner
              on top of a squircle clips the curve it already has. */}
          <Image src="/logo.png" alt="" width={32} height={32} className="group-hover:opacity-80 transition-opacity" />
          <span>WeekndLabs</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => select(href)}
              aria-current={isActive(href) ? 'page' : undefined}
              className={`font-mono text-sm border-b transition-colors ${
                isActive(href)
                  ? 'text-brand border-brand'
                  : 'text-muted-foreground border-transparent hover:text-foreground hover:border-border'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <ThemeToggle />
          <Button variant="filled" href="https://github.com/sponsors/fajarhide" className="hidden lg:inline-flex">
            Sponsor
          </Button>
          <Button variant="outlined" href="https://github.com/weekndlabs" className="hidden md:inline-flex">
            Star on GitHub
          </Button>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-sm border border-border text-muted-foreground transition-colors hover:border-brand hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            {open ? <X size={16} aria-hidden="true" /> : <Menu size={16} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {open && (
        // Absolute, not in flow: an in-flow panel pushes the page down while it
        // is open, so closing it on a jump to /#products yanked the section back
        // under the navbar.
        <div
          id="mobile-nav"
          className="md:hidden absolute top-full inset-x-0 border-b border-border bg-muted px-6 py-2 flex flex-col"
        >
          {LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => select(href)}
              aria-current={isActive(href) ? 'page' : undefined}
              className={`font-mono text-sm py-3.5 border-b border-border/60 last:border-b-0 transition-colors ${
                isActive(href) ? 'text-brand' : 'text-foreground active:text-brand'
              }`}
            >
              {label}
              {isActive(href) && <span className="block h-px w-8 bg-brand mt-2" aria-hidden="true" />}
            </Link>
          ))}
          <div className="flex flex-col gap-3 pt-4 pb-2 mt-2 border-t border-border">
            <Button variant="filled" href="https://github.com/sponsors/fajarhide" className="w-full">
              Sponsor
            </Button>
            <Button variant="outlined" href="https://github.com/weekndlabs" className="w-full">
              Star on GitHub
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};
