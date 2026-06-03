/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // onnxruntime-web is browser-only — exclude from server bundle
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push('onnxruntime-web');
    }
    // Handle .wasm files
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };
    return config;
  },
};

module.exports = nextConfig;
