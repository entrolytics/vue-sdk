import { defineConfig } from 'vite-plus';

export default defineConfig({
  pack: {
    // The CJS output cannot keep `import.meta`; readEnv() falls back to
    // process.env there. Declaring the replacement makes that explicit instead
    // of leaving it as a build warning.
    transform: { define: { 'import.meta': '{}' } },
    entry: ['src/index.ts'],
    format: ['esm', 'cjs'],
    fixedExtension: false,
    dts: false,
    clean: true,
    sourcemap: true,
    treeshake: true,
    minify: false,
    deps: { resolveDepSubpath: true,
      neverBundle: ['vue', 'vue-router'],
    },
  },
  fmt: {
    printWidth: 100,
    useTabs: false,
    singleQuote: true,
    jsxSingleQuote: false,
    quoteProps: 'as-needed',
    trailingComma: 'all',
    semi: true,
    arrowParens: 'avoid',
    objectWrap: 'preserve',
    insertFinalNewline: true,
    embeddedLanguageFormatting: 'auto',
    htmlWhitespaceSensitivity: 'css',
    proseWrap: 'preserve',
    sortPackageJson: {
      sortScripts: true,
    },
  },
  run: {
    cache: {
      scripts: true,
      tasks: true,
    },
  },
  staged: {
    '*.{ts,tsx,js,jsx,mjs,cjs,json,md,yml,yaml}': 'vp check --fix',
  },
  lint: {
    categories: {
      correctness: 'warn',
      suspicious: 'warn',
    },
    rules: {
      'typescript/no-redundant-type-constituents': 'off',
      'typescript/no-explicit-any': 'off',
      'typescript/no-unsafe-type-assertion': 'off',
      'unicorn/consistent-function-scoping': 'off',
      'unicorn/prefer-add-event-listener': 'off',
    },
    plugins: ['oxc', 'typescript', 'unicorn'],
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
});
