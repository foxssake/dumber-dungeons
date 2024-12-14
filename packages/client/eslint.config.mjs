// @ts-check

import { dev } from '@dumber-dungeons/shared';
import { config as mergeConfigs } from 'typescript-eslint';

export default mergeConfigs(dev.eslintConfig, {
  rules: {
    'import-x/no-nodejs-modules': 'off',
  },
});
