// @ts-check

import { config as mergeConfigs } from 'typescript-eslint';
// eslint-disable-next-line no-restricted-imports
import sharedConfig from '../shared/eslint.config.mjs';

export default mergeConfigs(sharedConfig, {
  rules: {
    'import-x/no-nodejs-modules': 'off',
  },
});
