// @ts-check

import {
  config as mergeConfigs,
} from 'typescript-eslint';
import baseConfig from '../shared/eslint.config.mjs'

export default mergeConfigs(
  {},
  baseConfig
)
