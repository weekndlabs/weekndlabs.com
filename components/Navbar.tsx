'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ChevronDown, Menu, X } from 'lucide-react';
import { Button } from './Button';
import { ThemeToggle } from './ThemeToggle';
import { byCategory } from '@/lib/products';

// Read once at module scope. The catalog is static, and rebuilding the grouping
// on every render of a component that opens and closes a lot is work for nothing.
const GROUPS = byCategory();

// Products is a menu now, not a link, so only these two are plain destinations.
const LINKS = [
  { href: '/design', label: 'Design' },
  { href: '/philosophy', label: 'Philosophy' },
];

const isExternal = (href: string) => !href.startsWith('/');
const linkTarget = (href: string) =>
  isExternal(href) ? { target: '_blank' as const, rel: 'noopener noreferrer' } : {};

export const Navbar = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState(false);

  const nav = useRef<HTMLElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // A tap fires mouseenter on a touch screen and then leaves the panel stuck
  // open over the page, so hover drives the menu only where hover is real.
  const [canHover, setCanHover] = useState(false);
  useEffect(() => setCanHover(window.matchMedia('(hover: hover)').matches), []);

  useEffect(() => {
    setOpen(false);
    setProducts(false);
  }, [pathname]);

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = null;
  };

  const openMenu = () => {
    cancelClose();
    setProducts(true);
  };

  // Moving diagonally from the trigger to the far column crosses a strip that
  // belongs to neither, so an immediate close pulls the panel out from under
  // the pointer. The grace period is short enough not to feel sticky.
  const closeMenu = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setProducts(false), 120);
  };

  useEffect(() => cancelClose, []);

  useEffect(() => {
    if (!products) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setProducts(false);
      trigger.current?.focus();
    };
    // mousedown, not click: a click on a link inside the panel would otherwise
    // race the navigation, and pointerdown fires for scrollbar drags too.
    const onDown = (e: MouseEvent) => {
      if (!nav.current?.contains(e.target as Node)) setProducts(false);
    };

    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onDown);
    };
  }, [products]);

  return (
    <nav
      ref={nav}
      className="border-b border-border bg-background sticky top-0 z-50"
      onBlur={(e) => {
        // Tabbing past the last link in the panel has to close it, or the menu
        // stays open behind whatever the user moved on to.
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setProducts(false);
      }}
    >
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

        <div
          className="hidden md:flex items-center gap-8"
          onMouseLeave={() => canHover && closeMenu()}
        >
          <button
            ref={trigger}
            type="button"
            aria-expanded={products}
            aria-controls="products-menu"
            onClick={() => (products ? setProducts(false) : openMenu())}
            onMouseEnter={() => canHover && openMenu()}
            className={`font-mono text-sm border-b transition-colors inline-flex items-center gap-1.5 ${
              products
                ? 'text-brand border-brand'
                : 'text-muted-foreground border-transparent hover:text-foreground hover:border-border'
            }`}
          >
            Products
            <ChevronDown
              size={13}
              aria-hidden="true"
              className={`transition-transform ${products ? 'rotate-180' : ''}`}
            />
          </button>

          {LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onMouseEnter={() => canHover && closeMenu()}
              aria-current={pathname === href ? 'page' : undefined}
              className={`font-mono text-sm border-b transition-colors ${
                pathname === href
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

      {/* Full bleed rather than anchored to the trigger: the columns need the
          container's width, and a panel that starts under the word "Products"
          would run off the right edge at four columns.

          Hidden by class, never by the `hidden` attribute. `md:block` is a class
          and outranks the attribute's UA rule, so the panel would sit open on
          desktop forever. It stays mounted either way so aria-controls always
          resolves to a real element. */}
      <div
        id="products-menu"
        onMouseEnter={openMenu}
        onMouseLeave={() => canHover && closeMenu()}
        className={`absolute top-full inset-x-0 border-b border-border bg-background ${
          products ? 'hidden md:block' : 'hidden'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-8">
          {GROUPS.map(({ category, items }) => (
            <div key={category}>
              <h2 className="font-mono text-xs uppercase text-muted-foreground border-b border-border pb-3">
                {category}
              </h2>
              <ul className="list-none pl-0 mt-1">
                {items.map((product) => (
                  <li key={product.name}>
                    <a
                      href={product.href}
                      {...linkTarget(product.href)}
                      onClick={() => setProducts(false)}
                      className="group block rounded-sm px-3 py-3 -mx-3 transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                    >
                      <span className="flex items-baseline justify-between gap-3">
                        <span className="font-display text-foreground group-hover:text-brand transition-colors">
                          {product.name}
                        </span>
                        <span className="font-mono text-xs text-muted-foreground shrink-0">
                          {product.version}
                        </span>
                      </span>
                      <span className="mt-1 block text-sm text-muted-foreground">{product.blurb}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-border bg-muted">
          <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-4 font-mono text-xs">
            <span className="text-muted-foreground">Every one of them MIT or Apache 2.0</span>
            <a
              href="https://github.com/weekndlabs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-brand transition-colors"
            >
              github.com/weekndlabs
            </a>
          </div>
        </div>
      </div>

      {open && (
        // Absolute, not in flow: an in-flow panel pushes the page down while it
        // is open, so closing it on a jump to /#products yanked the section back
        // under the navbar.
        <div
          id="mobile-nav"
          className="md:hidden absolute top-full inset-x-0 border-b border-border bg-muted px-6 py-2 flex flex-col max-h-[calc(100vh-4rem)] overflow-y-auto"
        >
          {GROUPS.map(({ category, items }) => (
            <div key={category} className="py-3 border-b border-border/60">
              <h2 className="font-mono text-xs uppercase text-muted-foreground">{category}</h2>
              <ul className="list-none pl-0 mt-2 flex flex-col gap-2.5">
                {items.map((product) => (
                  <li key={product.name}>
                    <a
                      href={product.href}
                      {...linkTarget(product.href)}
                      onClick={() => setOpen(false)}
                      className="flex items-baseline justify-between gap-3 font-mono text-sm text-foreground active:text-brand"
                    >
                      {product.name}
                      <span className="text-xs text-muted-foreground">{product.version}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              aria-current={pathname === href ? 'page' : undefined}
              className={`font-mono text-sm py-3.5 border-b border-border/60 transition-colors ${
                pathname === href ? 'text-brand' : 'text-foreground active:text-brand'
              }`}
            >
              {label}
              {pathname === href && <span className="block h-px w-8 bg-brand mt-2" aria-hidden="true" />}
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
