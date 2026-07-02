import js from "@eslint/js";
import ts from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import svelte from "eslint-plugin-svelte";
import globals from "globals";

export default [
  js.configs.recommended,
  ...svelte.configs["flat/recommended"],
  {
    files: ["**/*.ts"],
    languageOptions: { parser: tsParser, globals: { ...globals.browser } },
    plugins: { "@typescript-eslint": ts },
    // no-undef is redundant (and wrong for type-only positions like
    // `BufferSource`, `RequestInit`, etc.) once TypeScript is in the mix —
    // tsc/svelte-check already catches genuinely undefined identifiers.
    // This is typescript-eslint's own documented recommendation.
    rules: { ...ts.configs.recommended.rules, "no-undef": "off" },
  },
  {
    // Plain .svelte.ts module files use Svelte 5 runes outside any .svelte
    // file, so the Svelte parser (which normally teaches ESLint about
    // $state/$derived/etc.) never sees them. Declare the rune globals
    // explicitly for this file pattern only, matching Svelte's own naming
    // convention for rune-using module files.
    files: ["**/*.svelte.ts"],
    languageOptions: {
      globals: {
        $state: "readonly",
        $derived: "readonly",
        $effect: "readonly",
        $props: "readonly",
        $bindable: "readonly",
        $inspect: "readonly",
        $host: "readonly",
      },
    },
  },
  {
    files: ["**/*.svelte"],
    languageOptions: {
      parserOptions: { parser: tsParser },
      globals: { ...globals.browser },
    },
    plugins: { "@typescript-eslint": ts },
    // Same reasoning as the **/*.ts block above: <script> blocks in .svelte
    // files also run through the TS parser, so they hit the same core-rule
    // false positives on type-only syntax (e.g. a parameter name inside a
    // function-type cast gets misreported as an unused variable by the
    // type-unaware core `no-unused-vars`/`no-undef`). Only swapping these two
    // specific rules for their type-aware equivalents — not adopting the
    // full recommended TS ruleset here, since that would turn on additional
    // rules (e.g. no-explicit-any) that weren't previously enforced on
    // .svelte files and are a separate concern from this fix.
    rules: {
      "no-undef": "off",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "error",
    },
  },
  { ignores: [".svelte-kit/", "build/", ".vercel/", "node_modules/", ".superpowers/"] },
];
