/** @type {import('prettier').Config} */
const config = {
  semi: true,
  singleQuote: true,
  printWidth: 100,
  trailingComma: 'es5',
  arrowParens: 'avoid',
  plugins: ['@trivago/prettier-plugin-sort-imports'],
  importOrder: ['<THIRD_PARTY_MODULES>', '^@/', '^[./]'],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  importOrderParserPlugins: ['typescript', 'jsx'],
};

export default config;
