/** @type {import('next').NextConfig} */

const dotenv = require('dotenv');

const loadEnv = () => {
  const env = {
    NEXT_PUBLIC_APP_ENV: process.env.APP_ENV || process.env.NODE_ENV,
  };
  const loaded = dotenv.config({
    path: `.env.${env.NEXT_PUBLIC_APP_ENV}`,
    silent: true,
  });
  Object.keys(process.env).forEach((key) => {
    if (key.startsWith('NEXT_PUBLIC_')) {
      env[key] = loaded.parsed[key];
    }
  });

  return env;
};

const nextConfig = {
  env: loadEnv(),
  reactStrictMode: false,
  experimental: {
    appDir: true,
  },
  webpack: function (config, options) {
    config.resolve.fallback = {
      crypto: false,
      path: false,
      fs: false,
    };
    config.module.rules.push({
      test: /\.(png|jpg|gif|eot|ttf|woff|woff2)$/i,
      use: {
        loader: 'url-loader',
        options: {
          limit: 1024 * 30,
          name: '[path][name].[ext]',
          encoding: 'base64',
          fallback: require.resolve('file-loader'),
        },
      },
    });
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
  images: {
    disableStaticImages: true,
    unoptimized: true,
  },
  output: 'export',
  distDir: 'out',
};

module.exports = nextConfig;
