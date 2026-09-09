import { defineConfig } from 'tsdown'

const shared = {
  entry: ['src/index.ts'],
  fixedExtension: false,
  dts: false,
  sourcemap: true,
  treeshake: true,
  minify: false,
  deps: { neverBundle: ['vue', 'vue-router'] },
} as const

// Two builds rather than one, because the `import.meta` replacement must not apply to both.
// `import.meta.env` is how Vite exposes VITE_* variables, and readEnv() depends on it for the
// zero-config path, so the ESM output has to keep it. CJS has no `import.meta` at all -- it is a
// syntax error there -- so that build alone substitutes an empty object and readEnv() falls
// through to process.env. This is what the published 3.0.2 artifact does.
export default defineConfig([
  { ...shared, format: ['esm'], clean: true },
  { ...shared, format: ['cjs'], clean: false, define: { 'import.meta': '{}' } },
])
