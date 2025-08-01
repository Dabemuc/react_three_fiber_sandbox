/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.(glsl|vert|frag)$/,
      use: ["webpack-glsl-loader"],
    });
    return config;
  },
};

export default nextConfig;
