import { FlatCompat } from "@eslint/eslintrc";
import eslintPluginReact from "eslint-plugin-react";
import tseslint from "typescript-eslint";
import nextPlugin from "eslint-config-next";

const compat = new FlatCompat({
  baseDirectory: import.meta.dir
});

export default [
  ...compat.extends("next/core-web-vitals"),
  {
    plugins: {
      react: eslintPluginReact
    },
    rules: {
      "react/jsx-props-no-spreading": "off",
      "react/react-in-jsx-scope": "off",
      "@next/next/no-html-link-for-pages": "off"
    }
  },
  ...tseslint.configs.recommended
];
