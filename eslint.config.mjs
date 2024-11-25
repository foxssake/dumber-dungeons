// @ts-check

import js from '@eslint/js';
import {
  config as mergeConfigs,
  configs as tsConfigs,
  parser as tsParser,
} from 'typescript-eslint';
import eslintPluginImportX from 'eslint-plugin-import-x';
import * as prettierConfig from 'eslint-config-prettier';

export default mergeConfigs(
  {
    // TODO: ignorePatterns: [] i.e. dist, localization, etc
    // https://github.com/eslint/eslint/discussions/17429#discussioncomment-6579229
    ignores: ['public/build/'],
  },
  js.configs.recommended,
  ...tsConfigs.strictTypeChecked,
  eslintPluginImportX.flatConfigs.recommended,
  eslintPluginImportX.flatConfigs.typescript,
  {
    files: ['**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    name: 'dumber-dungeons',
    rules: {
      'import-x/no-dynamic-require': 'error',
      'import-x/no-nodejs-modules': 'warn',
      '@typescript-eslint/explicit-member-accessibility': [
        'error',
        {
          overrides: { constructors: 'no-public' },
        },
      ],
      '@typescript-eslint/explicit-function-return-type': [
        'error',
        {
          allowExpressions: false,
          allowTypedFunctionExpressions: true,
          allowHigherOrderFunctions: false,
          allowDirectConstAssertionInArrowFunctions: true,
          allowConciseArrowFunctionExpressionsStartingWithVoid: false,
          allowFunctionsWithoutTypeParameters: false,
          allowedNames: ['args'],
          allowIIFEs: false,
        },
      ],
      // prettier does the job: https://stackoverflow.com/a/58977894/11009933
      indent: 'off',
      'prefer-template': 'error',
      complexity: ['error', 8],
      'max-params': ['error', 4],
      'max-depth': ['error', 2],
      'max-nested-callbacks': ['error', 2],
      'max-statements': ['error', 24],
      'max-lines': [
        'error',
        { max: 256, skipBlankLines: true, skipComments: true },
      ],
      'max-lines-per-function': [
        'error',
        { max: 64, skipBlankLines: false, skipComments: false },
      ],
      // TODO: check on this
      '@typescript-eslint/member-ordering': 'error',
      quotes: ['error', 'single', { avoidEscape: true }],
      semi: ['error', 'always'],
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_' },
      ],
      'import-x/no-unresolved': 'off',
      'import-x/no-absolute-path': 'off',
      'import-x/extensions': 'off',
      'no-plusplus': 'off',
      'lines-between-class-members': [
        'error',
        {
          enforce: [
            { blankLine: 'always', prev: 'method', next: 'method' },
            { blankLine: 'never', prev: 'field', next: 'field' },
            { blankLine: 'always', prev: 'method', next: 'field' },
            { blankLine: 'always', prev: 'field', next: 'method' },
          ],
        },
      ],
      'no-useless-constructor': 'off',
      'no-empty-function': ['error', { allow: ['constructors'] }],
      'no-param-reassign': ['error', { props: false }],
      '@typescript-eslint/no-shadow': 'error',
      'no-shadow': 'off',
      'default-case': 'off',
      'default-case-last': 'error',
      'class-methods-use-this': 'off',
      // for overload we need this, and anyway ts takes care of this rule
      // https://eslint.org/docs/latest/rules/no-dupe-class-members#handled_by_typescript
      'no-dupe-class-members': 'off',
      'dot-notation': 'off',
      'import-x/no-extraneous-dependencies': [
        'error',
        { devDependencies: true },
      ],
      // https://eslint.org/docs/latest/rules/no-undef#handled_by_typescript
      'no-undef': 'off',
      'prefer-promise-reject-errors': 'error',
      'no-debugger': 'warn',
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            // maybe later we'll use
            // {
            //   "group": ["*test-helpers*"],
            //   "message": "no test files in production code"
            // },
            {
              group: ['..*'],
              message: 'no relative parent imports in production code',
            },
          ],
        },
      ],
      '@typescript-eslint/restrict-template-expressions': [
        'error',
        {
          allowNumber: true,
          allowBoolean: true,
        },
      ],
    },
    ...prettierConfig.rules,
  },
  {
    files: [
      '**/*.module.ts',
    ],
    rules: {
      // nest.js modules are marked by empty classes with annotations
      '@typescript-eslint/no-extraneous-class': 'off'
    }
  },
  {
    files: [
      '**/*.test.ts',
      '**/*.spec.ts',
      '**/*.mock.ts',
      '**/test/**/*',
      '**/tests/**/*',
      '**/mock/**/*',
      '**/mocks/**/*',
    ],
    rules: {
      'max-nested-callbacks': ['error', 4],
      'max-lines-per-function': 'off',
      'max-statements': 'off',
      'no-restricted-imports': 'off',
    },
  }
);
