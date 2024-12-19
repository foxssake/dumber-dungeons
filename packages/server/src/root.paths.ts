import { resolve, join } from 'path';

export const packageRoot = resolve(join(import.meta.dir, '../../'));
export const projectRoot = resolve(join(packageRoot, '../'));
export const distRoot = resolve(
  join(projectRoot, 'packages', 'client', 'dist')
);
export const indexPath = resolve(join(distRoot, 'index.html'));
