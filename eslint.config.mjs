import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import importPlugin from "eslint-plugin-import";
import eslintConfigPrettier from "eslint-config-prettier";
import { defineConfig } from "eslint/config";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = dirname(fileURLToPath(import.meta.url));

const tsRecommended = tsPlugin.configs["flat/recommended"];
const tsRecommendedTypeChecked = tsPlugin.configs["flat/recommended-type-checked"];

const globals = {
  Buffer: "readonly",
  __dirname: "readonly",
  __filename: "readonly",
  afterAll: "readonly",
  afterEach: "readonly",
  beforeAll: "readonly",
  beforeEach: "readonly",
  console: "readonly",
  describe: "readonly",
  expect: "readonly",
  global: "readonly",
  it: "readonly",
  jest: "readonly",
  module: "readonly",
  process: "readonly",
  require: "readonly",
  test: "readonly",
};

export default defineConfig([
  {
    ignores: ["node_modules/**", "dist/**"],
  },
  ...tsRecommended,
  ...tsRecommendedTypeChecked,
  importPlugin.flatConfigs.errors,
  importPlugin.flatConfigs.warnings,
  importPlugin.flatConfigs.typescript,
  eslintConfigPrettier,
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: ["./tsconfig.lib.json", "./tsconfig.test.json"],
        sourceType: "module",
        tsconfigRootDir: rootDir,
      },
      sourceType: "module",
      ecmaVersion: "latest",
      globals,
    },
    settings: {
      "import/resolver": {
        node: { paths: ["."] },
        typescript: {
          alwaysTryTypes: true,
        },
      },
    },
    rules: {
      "class-methods-use-this": "off",
      complexity: ["warn", { max: 10 }],
      curly: "error",
      "default-case": "error",
      "dot-notation": "error",
      "eol-last": "error",
      "guard-for-in": "off",
      "linebreak-style": ["error", "unix"],
      "max-classes-per-file": "off",
      "max-lines": "off",
      "no-bitwise": "error",
      "no-caller": "error",
      "no-console": "error",
      "no-extra-bind": "error",
      "no-magic-numbers": "off",
      "no-multiple-empty-lines": ["error", { max: 1 }],
      "no-new-func": "error",
      "no-new-wrappers": "error",
      "no-plusplus": "off",
      "no-return-await": "error",
      "require-await": "off",
      "no-sequences": "error",
      "no-template-curly-in-string": "error",
      "no-throw-literal": "error",
      "no-undef-init": "error",
      "no-var": "error",
      "object-shorthand": "error",
      "one-var": ["error", "never"],
      "prefer-const": "error",
      "prefer-object-spread": "error",
      "prefer-template": "error",
      radix: "error",
      yoda: "error",
      "no-unused-expressions": "error",
      "no-duplicate-imports": "error",
      "no-unneeded-ternary": "error",
      "no-useless-computed-key": "error",
      "padded-blocks": [
        "error",
        { blocks: "never", classes: "never", switches: "never" },
      ],
      "padding-line-between-statements": [
        "error",
        { blankLine: "always", prev: "*", next: "return" },
      ],
      "no-lonely-if": "error",
      "no-nested-ternary": "error",
      eqeqeq: "error",
      "no-unused-vars": "off",
      "require-atomic-updates": "off",
      "no-case-declarations": "off",

      "@typescript-eslint/array-type": ["error", { default: "array-simple" }],
      "@typescript-eslint/explicit-member-accessibility": [
        "off",
        { overrides: { constructors: "off" } },
      ],
      "@typescript-eslint/no-empty-interface": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-extraneous-class": "off",
      "@typescript-eslint/no-parameter-properties": "off",
      "@typescript-eslint/no-require-imports": "error",
      "@typescript-eslint/no-unnecessary-qualifier": "error",
      "@typescript-eslint/prefer-for-of": "error",
      "@typescript-eslint/prefer-function-type": "error",
      "@typescript-eslint/restrict-plus-operands": "error",
      "@typescript-eslint/unified-signatures": "error",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-misused-promises": "off",
      "no-use-before-define": "off",
      "@typescript-eslint/no-use-before-define": [
        "error",
        { functions: false, classes: false },
      ],
      "@typescript-eslint/require-await": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",

      "import/no-named-as-default": "off",
      "import/namespace": "off",
      "import/order": ["error", { "newlines-between": "always" }],
    },
  },
]);
