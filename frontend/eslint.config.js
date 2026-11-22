import js from '@eslint/js';
import pluginReact from 'eslint-plugin-react';

export default [
  {
    ignores: ['node_modules/', 'dist/', '.vite/', '*.config.js'],
  },
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
globals: {
    window: 'readonly',
    document: 'readonly',
    console: 'readonly',
    localStorage: 'readonly',
    fetch: 'readonly',
    import: 'readonly',
    meta: 'readonly',
    alert: 'readonly',
    setTimeout: 'readonly',
    clearTimeout: 'readonly',
    URLSearchParams: 'readonly',
  },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    plugins: {
      react: pluginReact,
    },
    rules: {
      'no-undef': 'error',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
    },
  },
];