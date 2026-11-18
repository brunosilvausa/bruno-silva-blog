import { FlatCompat } from '@eslint/eslintrc';
import quality from './eslint-rules/index.cjs';

const compat = new FlatCompat({ baseDirectory: import.meta.dirname });

const config = [
  { ignores: ['**/node_modules/**', '**/.next/**', '**/.sanity/**', 'studio/dist/**', 'out/**', 'coverage/**', '.agents/**', '.claude/**', '.codex/**', '.superpowers/**', 'graphify-out/**'] },
  ...compat.extends('next/core-web-vitals'),
  {
    files: ['**/*.{js,jsx,mjs,cjs}'],
    plugins: { quality },
    rules: {
      'quality/max-lines': ['warn', { max: 350 }],
      '@next/next/no-html-link-for-pages': 'warn',
    },
  },
];

export default config;
