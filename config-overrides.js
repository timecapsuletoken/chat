const webpack = require('webpack');

module.exports = function override(config) {
  config.resolve.fallback = {
    ...config.resolve.fallback,
    assert: require.resolve('assert'),
    crypto: require.resolve('crypto-browserify'),
    stream: require.resolve('stream-browserify'),
    http: require.resolve('stream-http'),
    https: require.resolve('https-browserify'),
    os: require.resolve('os-browserify/browser'),
    vm: require.resolve('vm-browserify'),
    url: require.resolve('url'),
    buffer: require.resolve('buffer'),
  };  

  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser',
    }),
  ]);

  // Add React Refresh plugin only in development mode
  if (process.env.NODE_ENV === 'development') {
    const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
    config.plugins.push(new ReactRefreshWebpackPlugin());
  }

  // Filter out source-map-loader to avoid related warnings
  config.module.rules = config.module.rules.filter(
    rule => !rule.loader || !rule.loader.includes('source-map-loader')
  );

  // Ignore specific Gun.js warnings related to dynamic dependencies
  config.ignoreWarnings = [/Critical dependency: the request of a dependency is an expression/];

    // Add devServer configuration to bind to all interfaces
  if (process.env.NODE_ENV === 'development') {
    config.devServer = {
      ...config.devServer,
      host: process.env.HOST || '0.0.0.0', // Use HOST from .env or default to 0.0.0.0
      port: process.env.PORT || 3000, // Use PORT from .env or default to 3000
      allowedHosts: 'all', // Allow access from any host
      https: process.env.HTTPS === 'true' ? {
        key: process.env.SSL_KEY_FILE,
        cert: process.env.SSL_CRT_FILE,
      } : undefined,
    };
  }

  return config;
};
