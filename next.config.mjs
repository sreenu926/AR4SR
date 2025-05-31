// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     domains: ["firebasestorage.googleapis.com"],
//   },
// };

// export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  // No need to configure external image domains since you're using local images
  reactStrictMode: true,
  swcMinify: true,
};

export default nextConfig;
