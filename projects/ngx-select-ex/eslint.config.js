// @ts-check
const tseslint = require("typescript-eslint");
const rootConfig = require("../../eslint.config.js");

module.exports = tseslint.config(
  ...rootConfig,
  {
    files: ["**/*.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@angular-eslint/no-output-native": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
      "no-case-declarations": "warn",
      "@typescript-eslint/no-empty-object-type": "warn",
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "ngx-select",
          style: "kebab-case",
        },
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "ngx-select",
          style: "kebab-case",
        },
      ],
    },
  },
  {
    files: ["**/*.html"],
    rules: {
      "@angular-eslint/template/click-events-have-key-events": "warn",
      "@angular-eslint/template/interactive-supports-focus": "warn",
      "@angular-eslint/template/role-has-required-aria": "warn",
    },
  }
);
