// Metro configuration for Expo
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.platforms = Array.from(
  new Set([...(config.resolver.platforms ?? []), 'native', 'android', 'ios', 'web'])
);

config.resolver.sourceExts = Array.from(
  new Set([...(config.resolver.sourceExts ?? []), 'ts', 'tsx', 'js', 'jsx'])
);

// Respect package.json "exports" but force the CJS condition so packages like
// zustand resolve to ./index.js instead of ./esm/index.mjs (which uses
// `import.meta` and breaks Metro's web target).
config.resolver.unstable_enablePackageExports = true;
config.resolver.unstable_conditionNames = ['require', 'react-native', 'default'];

module.exports = config;
