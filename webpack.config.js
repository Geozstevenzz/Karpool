// webpack.config.js
const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  config.resolve.alias = {
    // first keep whatever Expo already set
    ...(config.resolve.alias || {}),

    // map all react-native imports to react-native-web
    'react-native$': 'react-native-web',

    // cover deep import that expo-router currently uses
    'react-native-web/dist/index': 'react-native-web',

    // alias RN’s private Utilities/Platform import back into the web export
    'react-native/Libraries/Utilities/Platform': 'react-native-web/dist/exports/Platform',

    // if you see similar errors for Dimensions or other utils, alias them too:
    'react-native/Libraries/Utilities/Dimensions':
      'react-native-web/dist/exports/Dimensions',

    // and for RCTEventEmitter if needed:
    'react-native/Libraries/EventEmitter/RCTEventEmitter':
      'react-native-web/dist/exports/EventEmitter/RCTDeviceEventEmitter',
  };

  return config;
};
