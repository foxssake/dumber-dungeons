// @ts-check

import { config as mergeConfigs } from 'typescript-eslint';
import baseConfig from '@dumber-dungeons/shared/eslint.config.mjs';

export default mergeConfigs(baseConfig, {
  rules: {
    'import-x/no-nodejs-modules': 'off',
  },
});
