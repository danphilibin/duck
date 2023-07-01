/* eslint-env node */
module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ["@typescript-eslint", "react", "promise"],
  rules: {
    "react-hooks/exhaustive-deps": ["warn"],
    "react/react-in-jsx-scope": ["off"],
    "no-case-declarations": "off",
    "promise/always-return": ["off"],
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:promise/recommended",
    "prettier",
  ],
};
