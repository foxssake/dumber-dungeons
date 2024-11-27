// @ts-check
//
import {
  config as mergeConfigs,
} from 'typescript-eslint';
import sharedConfig from '../shared/eslint.config.mjs';
import nextConfig from '@next/eslint-plugin-next';

export default mergeConfigs(
  sharedConfig,
  nextConfig
)
