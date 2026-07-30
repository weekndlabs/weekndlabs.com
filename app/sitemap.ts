import { MetadataRoute } from 'next';

/**
 * `lastModified` is deliberately absent.
 *
 * It used to be `new Date()` on every entry, which is not a modification date:
 * this route re-renders per request, so every page claimed to have changed today,
 * every day, forever. Google learns from that quickly and starts ignoring the
 * field, which costs the signal on the one page that really did change.
 *
 * Omitting it is honest and loses nothing. Put a real date back only when there
 * is a real one to put, from a CMS timestamp or the file's git history.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://weekndlabs.com',
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: 'https://weekndlabs.com/philosophy',
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://weekndlabs.com/privacy-policy',
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: 'https://weekndlabs.com/terms-of-service',
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ];
}
