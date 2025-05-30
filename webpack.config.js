const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const path = require('path');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  
  // Customize the config before returning it.
  config.output.publicPath = '/';
  
  // Set entry point to index.web.js
  config.entry = [path.resolve(__dirname, 'index.web.js')];
  
  // Add alias for LinearGradient
  config.resolve.alias = {
    ...config.resolve.alias,
    'react-native-linear-gradient': __dirname + '/__mocks__/react-native-linear-gradient.js'
  };

  // Add fallback for crypto module
  config.resolve.fallback = {
    ...config.resolve.fallback,
    "crypto": require.resolve("crypto-browserify"),
    "stream": require.resolve("stream-browserify"),
    "vm": require.resolve("vm-browserify")
  };
  
  return config;
}; 