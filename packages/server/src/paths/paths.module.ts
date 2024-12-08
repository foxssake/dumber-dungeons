import { Module } from '@nestjs/common';
import { join, resolve } from 'path';

const packageRoot = resolve(join(import.meta.dir, '../../'));
const projectRoot = resolve(join(packageRoot, '../../'));
const distRoot = resolve(join(projectRoot, 'dist/'));

const viewsRoot = join(distRoot, 'views');

@Module({
  providers: [
    { provide: 'PACKAGE_ROOT', useValue: packageRoot },
    { provide: 'PROJECT_ROOT', useValue: projectRoot },
    { provide: 'DIST_ROOT', useValue: distRoot },
    { provide: 'VIEWS_ROOT', useValue: viewsRoot }
  ],
  exports: [
    'PACKAGE_ROOT',
    'PROJECT_ROOT',
    'DIST_ROOT',
    'VIEWS_ROOT'
  ]
})
export class PathsModule {}
