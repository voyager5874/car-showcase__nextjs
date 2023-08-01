/** @type {import("next").NextConfig} */
const nextConfig = {
  // images: {
  //   domains: [
  //     "cdn.imagin.studio",
  //     "platform.cstatic-images.com",
  //     "cars.com",
  //     "www.cars.com",
  //     "upload.wikimedia.org",
  //     "editorial.pxcrush.net",
  //     "www.motortrend.com",
  //     "cdcssl.ibsrv.net",
  //     "carsales.pxcrush.net",
  //     "s1.cdn.autoevolution.com",
  //   ],
  // },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "https",
        hostname: "***",
      },
      {
        protocol: "http",
        hostname: "***",
      },
    ],
  },
};

module.exports = nextConfig;
