// @ts-check

import {
  config as mergeConfigs,
} from 'typescript-eslint';
import sharedConfig from '../shared/eslint.config.mjs';

export default mergeConfigs(
  sharedConfig
)
