/* eslint-disable import-x/no-nodejs-modules */

import { Glob, type GlobScanOptions } from 'bun';
import { join, resolve } from 'path';

export async function globScan(
  pattern: string,
  options: GlobScanOptions = {}
): Promise<Array<string>> {
  const glob = new Glob(pattern);
  return Array.fromAsync(glob.scan(options));
}

export const packageRoot = resolve(join(import.meta.dir, '../'));
export const projectRoot = resolve(join(packageRoot, '../../'));
export const srcRoot = resolve(join(packageRoot, 'src'));
export const publicRoot = resolve(join(packageRoot, 'public'));
export const distRoot = resolve(join(projectRoot, 'dist'));
export const viewRoot = resolve(join(distRoot, 'views'));
export const publicDistRoot = resolve(join(distRoot, 'public'));
