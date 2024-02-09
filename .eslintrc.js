module.exports = {
  root: true,
  extends: ['universe/native'],
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', { varsIgnorePattern: '^exhaustiveCheck$' }],
  },
};
