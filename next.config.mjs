// next.config.mjs
const nextConfig = {
  reactStrictMode: true,
  // output: 'export',
  images: {
    domains: [
      "i.ibb.co",
      "images.pexels.com",
      "10.10.7.111",
      "moshfiqur5000.binarybards.online",
      "api.raconliapp.com",
    ],
  },
  // images: {
  //   remotePatterns: [
  //     {
  //       // protocol: "https",
  //       protocol: "http",
  //       hostname: "**",
  //     },
  //   ],
  // },
};

export default nextConfig;
