import eslint from "@eslint/js";
import eslintReact from "@eslint-react/eslint-plugin";
import vitest from "@vitest/eslint-plugin";
import prettierPlugin from "eslint-plugin-prettier/recommended";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import globals from "globals";

export default [
  {
    ignores: ["**/node_modules/", ".git/", "**/dist/"],
  },
  eslint.configs.recommended,
  prettierPlugin,
  eslintReact.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      "simple-import-sort": simpleImportSort,
    },
    settings: {
      "react-x": {
        version: "detect",
      },
    },
    rules: {
      eqeqeq: "error",
      "max-lines-per-function": [
        "error",
        { max: 80, skipBlankLines: true, skipComments: true },
      ],
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-unused-vars": [
        "warn",
        {
          caughtErrors: "none",
          destructuredArrayIgnorePattern: "^_",
          ignoreRestSiblings: true,
          args: "none",
        },
      ],
      "no-empty-function": "off",
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      "prettier/prettier": ["error", { trailingComma: "es5" }],
    },
  },
  {
    files: ["**/*.jsx", "**/*.tsx"],
    rules: {
      "max-lines-per-function": [
        "error",
        { max: 160, skipBlankLines: true, skipComments: true },
      ],
    },
  },
  {
    files: [
      "**/*.test.js",
      "**/*.test.jsx",
      "vitest.setup.js",
      "vite.config.js",
    ],
    plugins: { vitest },
    languageOptions: {
      globals: vitest.environments.env.globals,
    },
    rules: {
      ...vitest.configs.recommended.rules,
      "max-lines-per-function": "off",
    },
  },
];
