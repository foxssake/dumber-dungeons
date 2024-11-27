// @ts-check
// Used by `next lint` and `bun run build`

import {
  config as mergeConfigs,
} from 'typescript-eslint';
import sharedConfig from '../../eslint.config.mjs';
import nextConfig from '@next/eslint-plugin-next';

export default mergeConfigs(
  sharedConfig,
  nextConfig
)
