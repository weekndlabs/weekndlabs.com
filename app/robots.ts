import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/_next/'],
    },
    // Two sitemaps, because /design is a separate Astro build proxied in from
    // weekndlabs/design and it owns its own URLs.
    //
    // It has to be named here. robots.txt is read from an origin root and never
    // from a path, so the robots.txt that build serves only ever answers at
    // design.weekndlabs.com, which is not the canonical host. Those pages
    // canonicalise to weekndlabs.com/design, and this is the only robots.txt
    // Google reads for them.
    sitemap: [
      'https://weekndlabs.com/sitemap.xml',
      'https://weekndlabs.com/design/sitemap.xml',
    ],
  };
}
