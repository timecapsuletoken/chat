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
  };  

  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
  ]);

  // Filter out source-map-loader to avoid related warnings
  config.module.rules = config.module.rules.filter(
    rule => !rule.loader || !rule.loader.includes('source-map-loader')
  );

  // Ignore specific Gun.js warnings related to dynamic dependencies
  config.ignoreWarnings = [
    ...(config.ignoreWarnings || []),
    {
      module: /gun\.js$/,
      message: /Critical dependency: the request of a dependency is an expression/,
    },
  ];

  return config;
};
