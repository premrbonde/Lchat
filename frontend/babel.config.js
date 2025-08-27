module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': '.',
          },
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      ],
      // NOTE: This must be the last plugin.
      'react-native-reanimated/plugin',
    ],
  };
};
