// Serves the static export in out/ and the design docs, which are a separate
// Astro build in the weekndlabs-design Worker, reached through the DESIGN
// service binding.
const DESIGN_SITE = 'https://design.weekndlabs.com';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.hostname === 'www.weekndlabs.com') {
      url.hostname = 'weekndlabs.com';
      return Response.redirect(url.toString(), 301);
    }

    // The Astro docs ask for their stylesheet at the absolute path /_astro, so
    // that has to be proxied too or /design arrives unstyled.
    const p = url.pathname;
    if (p === '/design' || p.startsWith('/design/') || p.startsWith('/_astro/')) {
      const target = DESIGN_SITE + (p.startsWith('/_astro/') ? p : p.slice('/design'.length) || '/') + url.search;
      return env.DESIGN.fetch(new Request(target, request));
    }

    const res = await env.ASSETS.fetch(request);
    // The export writes the OG image without an extension, so assets cannot
    // guess its type.
    if (p === '/opengraph-image' && res.ok) {
      const png = new Response(res.body, res);
      png.headers.set('content-type', 'image/png');
      return png;
    }
    return res;
  },
};
