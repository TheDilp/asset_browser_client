/** @type {import("prettier").Config} */
export default {
  $schema: "http://json.schemastore.org/prettierrc",
  arrowParens: "always",
  bracketSpacing: true,
  bracketSameLine: true,
  printWidth: 128,
  proseWrap: "preserve",
  tabWidth: 2,
  trailingComma: "all",
  jsxSingleQuote: false,
  semi: true,
  endOfLine: "auto",
  singleQuote: false,
  plugins: ["prettier-plugin-tailwindcss", "prettier-plugin-astro"],
  overrides: [
    {
      files: "*.astro",
      options: {
        parser: "astro",
      },
    },
  ],
};
