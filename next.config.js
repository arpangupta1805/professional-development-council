/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
const repoName = 'pdc-own'; // Replace with your actual GitHub repository name

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'export',
  trailingSlash: true,
  basePath: isProd ? `/${repoName}` : '',
  assetPrefix: isProd ? `/${repoName}/` : '',
  images: {
    unoptimized: true, // Required for static export
    domains: [
      "images.unsplash.com",
      "media.istockphoto.com",
      "drive.google.com",
      "lh3.googleusercontent.com", // Google profile pictures
      "lh4.googleusercontent.com", // Google profile pictures
      "lh5.googleusercontent.com", // Google profile pictures
      "lh6.googleusercontent.com", // Google profile pictures
    ],
  },
  env: {
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  },
};
const isGithubPages = process.env.NODE_ENV === 'production';


module.exports = nextConfig;
