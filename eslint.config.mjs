// eslint.config.mjs
import js from '@eslint/js';
import globals from 'globals';

import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import a11y from 'eslint-plugin-jsx-a11y';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import importPlugin from 'eslint-plugin-import';

// 👉 Este paquete exporta parser + plugin en un solo import
import tseslint from 'typescript-eslint';

export default [
  // Ignora build
  { ignores: ['dist'] },

  // Base JS
  js.configs.recommended,

  // ---- BLOQUE ÚNICO PARA TS/TSX (parser + plugin + reglas juntos) ----
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,           // parser TS
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: { ...globals.browser },
    },
    plugins: {
      // registra TODOS los plugins que vayas a usar en ESTE BLOQUE
      '@typescript-eslint': tseslint.plugin,
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'jsx-a11y': a11y,
      'simple-import-sort': simpleImportSort,
      import: importPlugin,
    },
    settings: { react: { version: 'detect' } },
    rules: {
      // React / Hooks
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',

        // Desactiva la base y usa la de TS
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],


      // Imports
      'simple-import-sort/imports': 'warn',
      'simple-import-sort/exports': 'warn',
      'import/newline-after-import': 'warn',
      'import/no-duplicates': 'warn',

      // 🔒 Evita .toFixed() para precios → usa clp()
      'no-restricted-syntax': [
        'warn',
        {
          selector: "MemberExpression[property.name='toFixed']",
          message: 'Evita .toFixed(); usa el helper clp() o formateadores centralizados.',
        },
      ],

      // Estilo
      eqeqeq: ['warn', 'smart'],
      'no-trailing-spaces': 'warn',
      'eol-last': ['warn', 'always'],
    },
  },
];
