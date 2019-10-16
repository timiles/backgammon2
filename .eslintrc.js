module.exports = {
  env: {
    jest: true,
  },
  extends: ["airbnb-typescript"],
  rules: {
    'linebreak-style': ['error', 'windows'],
    '@typescript-eslint/no-use-before-define': 'off',
  },
};
