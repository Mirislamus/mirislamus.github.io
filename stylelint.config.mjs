export default {
  extends: ['stylelint-config-standard-scss'],
  overrides: [
    { files: ['**/*.astro'], customSyntax: 'postcss-html' },
    {
      // The tokens themselves and the page-transition choreography use literal values.
      files: ['src/styles/helpers/_variables.scss', 'src/styles/helpers/_animations.scss'],
      rules: { 'declaration-property-value-disallowed-list': { 'z-index': ['/^-?[1-9]\\d*$/'] } },
    },
  ],
  rules: {
    // Project rules
    'declaration-no-important': true,
    // Stacking order comes from the --z-* tokens; only 0 and calc() on a token are allowed.
    'declaration-property-value-disallowed-list': {
      'z-index': ['/^-?[1-9]\\d*$/'],
      // Timing comes from the motion tokens in _variables.scss.
      '/^(transition|animation)(-duration|-delay|-timing-function)?$/': [
        '/cubic-bezier\\(/',
        '/(^|[^\\w.-])(?!0m?s\\b)\\d*\\.?\\d+m?s\\b/',
      ],
    },
    'selector-class-pattern': [
      '^[a-z][a-zA-Z0-9_-]*$',
      { message: 'Use lowercase class names: camelCase in CSS modules, kebab-case for global utilities' },
    ],

    // Formatting is Prettier's job.
    'rule-empty-line-before': null,
    'declaration-empty-line-before': null,
    'at-rule-empty-line-before': null,
    'comment-empty-line-before': null,
    'custom-property-empty-line-before': null,
    'scss/double-slash-comment-empty-line-before': null,
    'scss/double-slash-comment-whitespace-inside': null,
    'value-keyword-case': null,
    'color-hex-length': null,

    // The reset keeps -moz-appearance and the visually-hidden helper keeps legacy clip on purpose.
    'property-no-vendor-prefix': null,
    'property-no-deprecated': null,

    // CSS modules and Astro use these on purpose.
    'selector-pseudo-class-no-unknown': [true, { ignorePseudoClasses: ['global'] }],
    'custom-property-pattern': null,
    'keyframes-name-pattern': null,
    'scss/at-mixin-pattern': null,
    'scss/dollar-variable-pattern': null,
    'scss/at-function-pattern': null,
  },
};
