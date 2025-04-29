// eslint.config.js
import compat from "@eslint/eslintrc/compat";

export default [
  ...compat.extends(
    "next/core-web-vitals",
    "next",
    "plugin:@typescript-eslint/recommended"
  ),
  {
    rules: {
      "react/no-unescaped-entities": "off",
      "@next/next/no-img-element": "off",
    },
  },
];
