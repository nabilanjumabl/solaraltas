/** @type {import('next').NextConfig} */
const nextConfig = {
  // NO workerThreads - causes DataCloneError with Recharts
  // NO experimental.cpus - not needed
};

module.exports = nextConfig;
