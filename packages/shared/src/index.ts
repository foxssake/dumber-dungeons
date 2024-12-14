import eslintConfig from '../eslint.config.mjs';
import prettierConfig from '../prettier.config.mjs';

export * from './event.emitter';

export const dev = {
  eslintConfig,
  prettierConfig
}
