export default {
  plugins: {
    'postcss-preset-env': {
      stage: 1,
      features: {
        'custom-properties': false,
        'logical-properties-and-values': false,
        'cascade-layers': false,
        'media-query-ranges': false,
      },
    },
  },
};
