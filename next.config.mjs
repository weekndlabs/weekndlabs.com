/** @type {import('next').NextConfig} */
// A static export served as Worker static assets (see worker.js). The /design
// proxy that used to live in rewrites() is in worker.js now, because a static
// export has no server to run rewrites.
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  images: {
    // No image optimizer without a server.
    unoptimized: true,
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
