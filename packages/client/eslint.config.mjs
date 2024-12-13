// @ts-check

import { config as mergeConfigs } from 'typescript-eslint';
import sharedConfig from 'shared/eslint.config.mjs';

export default mergeConfigs(
  sharedConfig,
  {
    // TODO: ignorePatterns: [] i.e. dist, localization, etc
    // https://github.com/eslint/eslint/discussions/17429#discussioncomment-6579229
    ignores: ['dist/', 'public'],
  },
  {
    rules: {
      'import-x/no-nodejs-modules': 'off',
    },
  }
);
