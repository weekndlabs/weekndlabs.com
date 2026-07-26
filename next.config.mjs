/** @type {import('next').NextConfig} */
const DESIGN_SITE = "https://design.weekndlabs.com";

const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      { source: "/design", destination: DESIGN_SITE },
      { source: "/design/:path*", destination: `${DESIGN_SITE}/:path*` },
      // The docs site is Astro, and it asks for its stylesheet at the absolute
      // path /_astro/index.*.css. Without this the proxied page arrives with no
      // styling at all. Next never serves /_astro itself, so nothing collides.
      { source: "/_astro/:path*", destination: `${DESIGN_SITE}/_astro/:path*` },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "a.storyblok.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "significa.co",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "source.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "be.webarq.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
