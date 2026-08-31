/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    // The three.js scene + framer-motion are client-only; nothing to transpile
    // specially, but images from remote CDNs are used via plain <img>, so no
    // next/image domain config is required.
};

module.exports = nextConfig;
