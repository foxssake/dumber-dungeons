import { Injectable } from "@nestjs/common";
import { join, resolve } from 'path';

const packageRoot = resolve(join(import.meta.dir, '../'));
const projectRoot = resolve(join(packageRoot, '../../'));
const distRoot = resolve(join(projectRoot, 'dist/'));

const viewsRoot = join(distRoot, 'views');
const staticRoot = join(distRoot, 'public');

@Injectable()
export class ViewService {
  private viewsRoot: string = viewsRoot;

  public async render(view: string): Promise<string> {
    return Bun.file(join(this.viewsRoot, view + '.html')).text();
  } 
}
