export default {
  plugins: {
    autoprefixer: {},
    'postcss-preset-env': {
      stage: 1,
      features: {
        'custom-properties': true,
      },
    },
    cssnano: {
      preset: [
        'default',
        {
          discardComments: { removeAll: true },
          normalizeWhitespace: true,
          mergeLonghand: true,
          minifySelectors: true,
          reduceIdents: true,
          svgo: true,
        },
      ],
    },
  },
};
